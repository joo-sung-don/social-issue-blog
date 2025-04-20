-- IP 주소를 차단하는 함수 생성
CREATE OR REPLACE FUNCTION ban_user_ip(
  ip TEXT,
  reason_text TEXT,
  duration_seconds INTEGER
)
RETURNS VOID AS $$
DECLARE
  ban_until TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 차단 종료 시간 계산
  ban_until := NOW() + (duration_seconds * INTERVAL '1 second');
  
  -- 기존 차단 정보 업데이트 또는 새로운 차단 정보 삽입
  INSERT INTO banned_ips (
    ip_address,
    reason,
    banned_until,
    banned_at,
    created_by
  ) VALUES (
    ip,
    reason_text,
    ban_until,
    NOW(),
    'system'
  )
  ON CONFLICT (ip_address) DO UPDATE SET
    reason = EXCLUDED.reason,
    banned_until = GREATEST(banned_ips.banned_until, EXCLUDED.banned_until),
    banned_at = EXCLUDED.banned_at;
    
  -- 시스템 메시지 추가
  -- INSERT INTO chat_messages (
  --   issue_slug, 
  --   sender_name, 
  --   message, 
  --   created_at, 
  --   is_system_message
  -- ) VALUES (
  --   '전체',
  --   'System',
  --   ip || ' 주소가 ' || reason_text || '로 인해 차단되었습니다.',
  --   NOW(),
  --   TRUE
  -- );
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- IP 주소 차단 해제 함수
CREATE OR REPLACE FUNCTION unban_user_ip(
  ip TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- 차단 정보 삭제
  DELETE FROM banned_ips
  WHERE ip_address = ip;
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- banned_ips 테이블의 PRIMARY KEY 제약조건 수정 (중복 IP 방지)
ALTER TABLE banned_ips DROP CONSTRAINT IF EXISTS banned_ips_pkey;
ALTER TABLE banned_ips ADD PRIMARY KEY (ip_address);

-- RPC 함수에 대한 접근 권한 설정
GRANT EXECUTE ON FUNCTION ban_user_ip(TEXT, TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION unban_user_ip(TEXT) TO authenticated; 