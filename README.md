# Social Issue Blog

Next.js, Tailwind CSS, Supabase로 구현한 소셜 이슈 블로그

## 기능

- 소셜 이슈 목록 보기
- 상세 페이지
- 관리자 기능 (게시글 작성, 수정, 삭제)
- 이미지 업로드

## 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

## Supabase 설정

### 1. 데이터베이스 테이블 생성

```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  content TEXT,
  date TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### 2. Storage 설정 (이미지 업로드용)

1. Supabase 대시보드에서 Storage 메뉴로 이동
2. "Create new bucket" 버튼 클릭
3. 버킷 설정:
   - Name: `issue-images`
   - Public bucket 체크 (공개 액세스 허용)
   - 버킷 생성 완료
4. RLS(Row Level Security) 정책 설정:
   - 생성된 버킷 선택 후 "Policies" 탭 클릭
   - "Add policies" 버튼 클릭
   - 다음 정책 추가:
     - 파일 읽기: 모든 사용자가 읽을 수 있도록 설정
     - 파일 업로드: 인증된 사용자만 업로드 가능하게 설정

### 3. 환경 변수 설정

`.env.local` 파일에 Supabase URL과 anon key 설정:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 파일 업로드 사용 방법

관리자 페이지의 게시글 작성/수정 화면에서:

1. "클릭하여 이미지 업로드" 영역을 클릭하거나 파일을 드래그하여 이미지 업로드
2. 또는 이미지 URL을 직접 입력
3. 업로드된 이미지는 자동으로 미리보기에 표시됨
4. 게시글 저장 시 업로드된 이미지의 URL이 함께 저장됨

## 배포 방법

### Vercel을 통한 배포

1. [Vercel](https://vercel.com)에 가입하고 로그인합니다.
2. "New Project" 버튼을 클릭합니다.
3. GitHub 저장소를 연결하고 이 프로젝트를 선택합니다.
4. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
5. "Deploy" 버튼을 클릭하여 배포를 시작합니다.

### 수동 배포 (다른 호스팅 서비스 사용 시)

1. 프로젝트 빌드:
   ```bash
   npm run build
   ```
2. 정적 파일 생성:
   ```bash
   npm run start
   ```
3. `.next` 폴더, `public` 폴더, 그리고 `package.json` 파일을 호스팅 서비스에 업로드합니다.
4. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
