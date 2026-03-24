# Go-Travel Web

AI 기반 여행지 장소 추출 웹 애플리케이션 - YouTube 영상에서 여행지 정보를 자동으로 추출하여 Notion에 정리합니다.

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local.example`을 `.env.local`로 복사하고 API 키를 입력하세요:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-pro
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

## 📦 프로젝트 구조

```
web/
├── app/
│   ├── api/
│   │   ├── search/route.ts           # YouTube 검색 + AI 추출 API
│   │   └── save-to-notion/route.ts   # Notion 저장 API
│   ├── globals.css                   # 글로벌 스타일
│   ├── layout.tsx                    # 루트 레이아웃
│   └── page.tsx                      # 메인 페이지
├── components/
│   ├── SearchForm.tsx                # 검색 폼 컴포넌트
│   ├── Results.tsx                   # 결과 표시 컴포넌트
│   └── NotionSaveModal.tsx           # Notion 저장 모달
├── lib/
│   ├── services/                     # 비즈니스 로직 (기존 코드 재사용)
│   └── types/                        # TypeScript 타입 정의
└── public/                           # 정적 파일
```

## 🌐 Vercel 배포

### 1. Vercel CLI 설치

```bash
npm i -g vercel
```

### 2. Vercel 배포

```bash
cd web
vercel
```

### 3. 환경 변수 설정

Vercel 대시보드에서 환경 변수를 설정하거나, CLI로 설정:

```bash
vercel env add YOUTUBE_API_KEY
vercel env add OPENAI_API_KEY
vercel env add AI_MODEL
```

### 4. 프로덕션 배포

```bash
vercel --prod
```

## 🔧 기능

### 프론트엔드
- ✅ React 18 + Next.js 15 App Router
- ✅ Tailwind CSS로 반응형 UI
- ✅ 실시간 진행 상황 표시
- ✅ 모달 기반 Notion 연동

### 백엔드 (API Routes)
- ✅ YouTube Data API v3 통합
- ✅ youtube-transcript로 자막 수집
- ✅ Google Gemini AI로 장소 추출 (무료)
- ✅ 결과 표시 (Notion 연동 제거)

### 사용자 경험
- ✅ 사용자별 Notion 계정 연동 가능
- ✅ API 키는 서버에서 안전하게 관리
- ✅ 사용자가 Notion API 키만 입력하면 자신의 Notion에 저장

## 📝 사용 방법

1. **여행지 입력**: 검색하고 싶은 여행지 입력 (예: 교토)
2. **검색 시작**: AI가 YouTube 영상에서 장소 추출
3. **결과 확인**: 추출된 장소 목록 확인
4. **Notion 저장**: 본인의 Notion API 키로 저장

## ⚙️ 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `YOUTUBE_API_KEY` | YouTube Data API v3 키 | ✅ |
| `GEMINI_API_KEY` | Google Gemini API 키 (무료) | ✅ |
| `AI_MODEL` | 사용할 AI 모델 | ❌ (기본값: gemini-pro) |

## 🔒 보안

- API 키는 서버 환경 변수로 관리
- 사용자의 Notion API 키는 클라이언트에서만 사용 (서버 저장 안 함)
- API Routes는 서버사이드에서만 실행

## 📊 비용

- **Vercel**: 무료 플랜 사용 가능
- **YouTube API**: 무료 (일일 10,000 units)
- **Google Gemini API**: 무료 (월 1500 requests)

## 🐛 문제 해결

### 빌드 오류
```bash
rm -rf .next node_modules
npm install
npm run build
```

### API 호출 실패
- 환경 변수가 제대로 설정되었는지 확인
- Vercel 대시보드에서 환경 변수 재확인

## 📚 참고 문서

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Google Gemini API](https://ai.google.dev/docs)
