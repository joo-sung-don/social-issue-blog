-- chat_messages 테이블에 stance 필드 추가
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS stance text CHECK (stance IN ('agree', 'disagree', 'neutral')); 

-- stance 필드에 인덱스 추가 (필터링 성능 향상)
CREATE INDEX IF NOT EXISTS idx_chat_messages_stance ON chat_messages (stance);

-- 설명 주석 추가
COMMENT ON COLUMN chat_messages.stance IS '사용자의 입장 (찬성: agree, 반대: disagree, 중립: neutral)'; 