# Supabase 실시간 채팅 설정 가이드

이 문서는 Social Issue Blog의 실시간 채팅 기능을 위한 Supabase 설정 방법을 안내합니다.

## 1. 채팅 테이블 생성

`social-issue-blog/supabase/chat_table.sql` 스크립트를 Supabase SQL 에디터에서 실행하여 chat_messages 테이블을 생성합니다.

## 2. Realtime 기능 활성화

### Supabase 프로젝트 설정

1. Supabase 대시보드 접속
2. 좌측 메뉴에서 "Database" 클릭
3. "Replication" 탭으로 이동
4. "Realtime" 섹션에서 "Enable Realtime" 활성화
5. "Source" 드롭다운에서 "All changes" 선택
6. 저장 (Save) 클릭

### 테이블별 Realtime 설정

1. 좌측 메뉴에서 "Table Editor" 클릭
2. `chat_messages` 테이블 선택
3. "Realtime" 탭 클릭 (상단 메뉴)
4. "Enable Realtime" 활성화
5. "Source" 드롭다운에서 "All changes" 또는 "FULL" 선택
6. 저장 (Save) 클릭

## 3. 보안 정책 (RLS) 확인

Supabase 대시보드에서 테이블의 RLS 정책이 올바르게 설정되었는지 확인하세요:

1. 좌측 메뉴에서 "Authentication" 클릭
2. "Policies" 탭 선택
3. `chat_messages` 테이블의 정책 확인:
   - SELECT 권한: "Anyone can read chat messages"
   - INSERT 권한: "Anyone can insert non-system messages" 및 "Only authenticated users can insert system messages"
   - DELETE 권한: "Authenticated users can delete their own messages"

## 4. 개발 중 문제 해결

### 실시간 업데이트가 작동하지 않는 경우:

1. 브라우저 개발자 콘솔에서 로그 확인
   - "채널 구독 시작" 또는 "Realtime 상태 변경" 메시지가 표시되는지 확인
   - 오류 메시지가 있다면 기록해 두세요

2. Supabase 연결 상태 확인
   - 브라우저 콘솔에서 다음을 실행: `supabase.realtime.getSubscriptions()`
   - 활성 구독이 있는지 확인

3. Realtime 기능 재활성화
   - Supabase 대시보드에서 Realtime 기능을 비활성화했다가 다시 활성화해 보세요

4. 페이지 새로고침 및 캐시 삭제
   - Ctrl+Shift+R (Windows/Linux) 또는 Command+Shift+R (Mac)로 강제 새로고침

## 5. 테스트하기

1. 개발 서버를 재시작하세요: `npm run dev`
2. 두 개의 브라우저 창을 열고 같은 이슈 페이지로 이동
3. 각 창에서 다른 닉네임으로 채팅을 시작
4. 메시지가 실시간으로 양쪽에 모두 표시되는지 확인 