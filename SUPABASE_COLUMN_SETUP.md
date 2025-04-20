# Supabase에서 chat_messages 테이블에 stance 컬럼 추가하기

## 방법 1: Supabase Studio에서 직접 컬럼 추가

1. Supabase 대시보드(https://app.supabase.com)에 로그인하여 프로젝트에 접속합니다.
2. 왼쪽 메뉴에서 'Table Editor'를 클릭합니다.
3. `chat_messages` 테이블을 클릭합니다.
4. 상단 탭에서 'Edit'을 클릭합니다.
5. 'Add Column' 버튼을 클릭하고 다음과 같이 설정합니다:
   - Name: `stance`
   - Type: `text`
   - Default Value: `null`
   - 'Is Nullable'에 체크합니다.
6. 'Save' 버튼을 클릭하여 컬럼을 추가합니다.

이렇게 하면 기본적인 `stance` 컬럼이 추가됩니다.

## 방법 2: SQL을 통해 컬럼 추가 및 제약조건 설정

1. Supabase 대시보드에서 왼쪽 메뉴의 'SQL Editor'를 클릭합니다.
2. 'New Query' 버튼을 클릭하여 새 SQL 편집기를 엽니다.
3. 다음 SQL 코드를 입력합니다:

```sql
-- chat_messages 테이블에 stance 필드 추가
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS stance text;

-- stance 필드에 체크 제약조건 추가
ALTER TABLE chat_messages
ADD CONSTRAINT stance_values CHECK (stance IS NULL OR stance IN ('agree', 'disagree', 'neutral'));

-- stance 필드에 인덱스 추가 (필터링 성능 향상)
CREATE INDEX IF NOT EXISTS idx_chat_messages_stance ON chat_messages (stance);

-- 설명 주석 추가
COMMENT ON COLUMN chat_messages.stance IS '사용자의 입장 (찬성: agree, 반대: disagree, 중립: neutral)';
```

4. 'Run' 버튼을 클릭하여 SQL을 실행합니다.

이 방법을 사용하면 컬럼 추가뿐만 아니라 `agree`, `disagree`, `neutral`만 입력 가능하도록 체크 제약조건도 설정됩니다.

## 중요 사항

* 기존 레코드의 `stance` 값은 모두 `null`로 설정됩니다.
* 컬럼을 추가한 후 애플리케이션을 다시 시작하면 오류가 해결될 것입니다.
* Row Level Security(RLS) 정책이 있다면, 새 컬럼에 대해서도 접근 권한이 올바르게 설정되어 있는지 확인하세요. 