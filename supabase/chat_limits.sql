-- chat_messages 테이블에 IP 주소와 타임스탬프 인덱스 추가
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;

-- 채팅 제한을 위한 banned_ips 테이블 생성
CREATE TABLE IF NOT EXISTS banned_ips (
  id BIGSERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  reason TEXT,
  banned_until TIMESTAMP WITH TIME ZONE,
  banned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages (created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_ip_address ON chat_messages (ip_address);
CREATE INDEX IF NOT EXISTS idx_banned_ips_ip_address ON banned_ips (ip_address);

-- IP 차단 여부 확인하는 함수
CREATE OR REPLACE FUNCTION is_ip_banned(check_ip TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM banned_ips 
    WHERE ip_address = check_ip 
    AND banned_until > now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 메시지 제한 확인하는 함수
CREATE OR REPLACE FUNCTION check_message_limits()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
  same_message_count INTEGER;
  flood_detected BOOLEAN := FALSE;
  spam_message_pattern TEXT := '(viagra|casino|lottery|\\$\\$\\$|make money|www\\.|http:|https:)';  -- 스팸 메시지 패턴
BEGIN
  -- IP 주소가 차단된 경우 거부
  IF NEW.ip_address IS NOT NULL AND is_ip_banned(NEW.ip_address) THEN
    RAISE EXCEPTION '차단된 IP 주소입니다.';
  END IF;

  -- 시스템 메시지는 검사하지 않음
  IF NEW.is_system_message THEN
    RETURN NEW;
  END IF;

  -- 1분 내 동일 IP의 메시지 수 확인 (도배 방지)
  SELECT COUNT(*)
  INTO recent_count
  FROM chat_messages
  WHERE ip_address = NEW.ip_address
    AND issue_slug = NEW.issue_slug
    AND created_at > (now() - interval '1 minute')
    AND NOT is_system_message;

  -- 도배 금지: 1분에 10개 이상 메시지
  IF recent_count >= 10 THEN
    -- IP를 차단 테이블에 추가 (2분 동안)
    INSERT INTO banned_ips (ip_address, reason, banned_until, created_by)
    VALUES (NEW.ip_address, '도배 감지: 단시간에 너무 많은 메시지', now() + interval '2 minutes', 'system');
    
    -- 시스템 메시지로 알림 추가
    INSERT INTO chat_messages (issue_slug, sender_name, message, is_system_message, ip_address)
    VALUES (NEW.issue_slug, 'System', NEW.ip_address || ' 주소가 도배로 인해 2분간 차단되었습니다.', TRUE, NULL);
    
    RAISE EXCEPTION '도배 감지: 단시간에 너무 많은 메시지를 보냈습니다.';
  END IF;

  -- 30초 내 동일 내용의 메시지 확인 (중복 방지)
  SELECT COUNT(*)
  INTO same_message_count
  FROM chat_messages
  WHERE ip_address = NEW.ip_address
    AND issue_slug = NEW.issue_slug
    AND message = NEW.message
    AND created_at > (now() - interval '30 seconds')
    AND NOT is_system_message;

  -- 동일 내용 중복 방지
  IF same_message_count > 0 THEN
    RAISE EXCEPTION '같은 메시지를 너무 자주 보내고 있습니다.';
  END IF;
  
  -- 스팸 메시지 검사 (간단한 패턴 매칭)
  IF NEW.message ~* spam_message_pattern THEN
    -- IP를 차단 테이블에 추가 (10분 동안)
    INSERT INTO banned_ips (ip_address, reason, banned_until, created_by)
    VALUES (NEW.ip_address, '스팸 메시지 감지', now() + interval '10 minutes', 'system');
    
    -- 시스템 메시지로 알림 추가
    INSERT INTO chat_messages (issue_slug, sender_name, message, is_system_message, ip_address)
    VALUES (NEW.issue_slug, 'System', NEW.ip_address || ' 주소가 스팸으로 인해 10분간 차단되었습니다.', TRUE, NULL);
    
    RAISE EXCEPTION '스팸 메시지가 감지되었습니다.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 채팅 메시지 트리거 설정
DROP TRIGGER IF EXISTS check_message_limits_trigger ON chat_messages;
CREATE TRIGGER check_message_limits_trigger
BEFORE INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION check_message_limits();

-- ----------------------------------------
-- RLS 정책 갱신 (기존 정책 삭제 후 재생성)
-- ----------------------------------------

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Anyone can read chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can insert non-system messages" ON chat_messages;
DROP POLICY IF EXISTS "Only authenticated users can insert system messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can delete their own messages" ON chat_messages;

-- 새 RLS 정책 추가
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 읽기 정책: 모든 사용자가 읽을 수 있음
CREATE POLICY "Anyone can read chat messages"
ON chat_messages FOR SELECT
USING (true);

-- 쓰기 정책: 시스템 메시지가 아닌 경우 + 차단되지 않은 IP만 삽입 가능
CREATE POLICY "Anyone can insert non-system messages"
ON chat_messages FOR INSERT
WITH CHECK (
  NOT is_system_message AND
  (ip_address IS NULL OR NOT is_ip_banned(ip_address))
);

-- 시스템 메시지 쓰기 정책: 인증된 사용자만 가능
CREATE POLICY "Only authenticated users can insert system messages"
ON chat_messages FOR INSERT
WITH CHECK (
  is_system_message AND
  auth.role() = 'authenticated'
);

-- 삭제 정책: 인증된 사용자만 자신의 메시지 삭제 가능
CREATE POLICY "Authenticated users can delete their own messages"
ON chat_messages FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  ip_address = auth.jwt() ->> 'sub'
);

-- 차단 테이블 RLS
ALTER TABLE banned_ips ENABLE ROW LEVEL SECURITY;

-- 차단 IP 테이블은 인증된 사용자만 읽기 가능
CREATE POLICY "Authenticated users can view banned IPs"
ON banned_ips FOR SELECT
USING (auth.role() = 'authenticated');

-- 인증된 사용자만 IP 차단 가능
CREATE POLICY "Authenticated users can ban IPs"
ON banned_ips FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 IP 차단 해제 가능
CREATE POLICY "Authenticated users can unban IPs"
ON banned_ips FOR DELETE
USING (auth.role() = 'authenticated'); 