# 채팅 차단 시스템 설정 가이드

이 가이드는 Supabase를 사용하여 영구적인 채팅 차단 시스템을 설정하는 방법을 안내합니다. 이 기능을 사용하면 사용자가 페이지를 새로 고침하거나 브라우저를 다시 열어도 차단 상태가 유지됩니다.

## 1. Supabase SQL 에디터에서 함수 생성

1. Supabase 대시보드에 로그인합니다.
2. 왼쪽 메뉴에서 "SQL Editor"를 클릭합니다.
3. "New Query" 버튼을 클릭하여 새 SQL 에디터를 엽니다.
4. 다음 SQL 코드를 붙여넣습니다:

```sql
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
```

5. "Run" 버튼을 클릭하여 SQL을 실행합니다.

## 2. RLS 정책 확인

이미 기존 chat_limits.sql 파일에서 RLS 정책이 설정되어 있지만, 다음 내용을 확인하세요:

1. banned_ips 테이블에 대한 RLS 정책이 적용되어 있는지 확인합니다.
2. 차단된 IP의 메시지 삽입을 방지하는 정책이 작동하는지 확인합니다.

문제가 있을 경우, 다음 SQL을 실행하여 RLS 정책을 업데이트합니다:

```sql
-- 차단 테이블 RLS
ALTER TABLE banned_ips ENABLE ROW LEVEL SECURITY;

-- 차단 IP 테이블은 인증되지 않은 사용자도 읽기 가능하도록 수정
DROP POLICY IF EXISTS "Anyone can check banned IPs" ON banned_ips;
CREATE POLICY "Anyone can check banned IPs"
ON banned_ips FOR SELECT
USING (true);

-- 인증된 사용자만 IP 차단 가능
DROP POLICY IF EXISTS "Authenticated users can ban IPs" ON banned_ips;
CREATE POLICY "Authenticated users can ban IPs"
ON banned_ips FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 IP 차단 해제 가능
DROP POLICY IF EXISTS "Authenticated users can unban IPs" ON banned_ips;
CREATE POLICY "Authenticated users can unban IPs"
ON banned_ips FOR DELETE
USING (auth.role() = 'authenticated');
```

## 3. 새로운 코드 적용

위의 단계를 완료한 후, 프로젝트의 IssueChat 컴포넌트가 업데이트된 기능을 사용할 수 있습니다. 

## 4. 테스트

1. 웹 애플리케이션을 실행합니다.
2. 채팅에서 도배 또는 스팸 메시지를 보내 차단 기능을 테스트합니다.
3. 페이지를 새로 고침하고 차단 상태가 유지되는지 확인합니다.
4. 브라우저를 닫았다가 다시 열어도 차단 상태가 유지되는지 확인합니다.

## 추가 설정 (선택 사항)

### 관리자 페이지 추가

차단된 IP를 관리하기 위한 관리자 페이지를 만들 수 있습니다:

1. 관리자 인증 기능 추가
2. 차단된 IP 목록 조회 및 차단 해제 기능 구현

### 차단 이력 저장

추후 분석을 위해 차단 이력을 저장하는 테이블을 추가할 수 있습니다:

```sql
CREATE TABLE IF NOT EXISTS ban_history (
  id BIGSERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  reason TEXT,
  banned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  banned_until TIMESTAMP WITH TIME ZONE,
  banned_by TEXT,
  issue_slug TEXT,
  unbanned_at TIMESTAMP WITH TIME ZONE,
  unbanned_by TEXT
);
```

이 가이드를 따라 설정하면, 채팅 차단 시스템이 서버 측에서 관리되어 새로고침해도 차단 상태가 유지됩니다. 