# Go-Travel Web

AI 기반 여행지 장소 추출 웹 애플리케이션 - YouTube 영상에서 여행지 정보를 자동으로 추출합니다.

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
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o-mini
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
│   │   └── search/route.ts           # YouTube 검색 + AI 추출 API
│   ├── globals.css                   # 글로벌 스타일
│   ├── layout.tsx                    # 루트 레이아웃
│   └── page.tsx                      # 메인 페이지
├── components/
│   ├── SearchForm.tsx                # 검색 폼 컴포넌트
│   └── Results.tsx                   # 결과 표시 컴포넌트
├── lib/
│   ├── services/                     # 비즈니스 로직
│   │   ├── youtube.ts                # YouTube 검색
│   │   ├── transcript.ts             # 자막 수집
│   │   └── placeExtractor.ts         # AI 장소 추출
│   └── types/                        # TypeScript 타입 정의
└── public/                           # 정적 파일
```

## 🌐 Vercel 배포

### 1. Vercel 배포

```bash
vercel --prod
```

### 2. 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에서 설정:

- `YOUTUBE_API_KEY`: YouTube Data API v3 키
- `OPENAI_API_KEY`: OpenAI API 키
- `AI_MODEL`: gpt-4o-mini (선택사항)

### 3. Root Directory 설정

Vercel 프로젝트 설정에서 Root Directory를 `web`으로 설정

## 🔧 주요 기능

### ✨ 핵심 기능
- 🔍 **YouTube 영상 검색**: 여행지 키워드로 관련 영상 자동 검색
- 📝 **자막 자동 수집**: YouTube 영상의 한글 자막 추출
- 🤖 **AI 장소 추출**: OpenAI GPT를 활용한 구체적인 장소 추출
- 🗺️ **구글 지도 연동**: 각 장소마다 구글 지도 링크 제공
- 📊 **카테고리 분류**: 맛집, 관광지, 사찰, 카페, 쇼핑 등 자동 분류

### 🎯 검색 필터링
- 타이틀에 검색어가 포함된 영상만 선택
- 조회수 상위 20개 영상 우선
- 구체적인 상호명이 있는 장소만 추출
- 호텔/숙박시설 자동 제외
- 검색 지역 외부 장소 자동 필터링

### 💡 사용자 경험
- React 18 + Next.js 15 App Router
- Tailwind CSS 반응형 UI
- 실시간 진행 상황 표시
- 원클릭 구글 지도 연동

## 📝 사용 방법

1. **여행지 입력**: 검색하고 싶은 여행지 입력 (예: 교토, 후쿠오카, 오사카)
2. **검색 시작**: AI가 YouTube 영상에서 장소 자동 추출
3. **결과 확인**: 추출된 장소 목록 확인 (카테고리별 분류)
4. **지도 확인**: 각 장소의 "📍 지도" 버튼 클릭하여 구글 지도에서 위치 확인

## ⚙️ 환경 변수

| 변수 | 설명 | 필수 | 기본값 |
|------|------|------|--------|
| `YOUTUBE_API_KEY` | YouTube Data API v3 키 | ✅ | - |
| `OPENAI_API_KEY` | OpenAI API 키 | ✅ | - |
| `AI_MODEL` | 사용할 AI 모델 | ❌ | gpt-4o-mini |

## 🎨 추출되는 카테고리

- **맛집**: 레스토랑, 카페, 디저트 가게 등
- **관광지**: 유명 관광 명소, 전망대 등
- **사찰**: 신사, 절 등 종교 시설
- **쇼핑**: 쇼핑몰, 상점가, 시장 등
- **액티비티**: 오락실, 체험 시설 등
- **기타**: 공원, 역, 기타 장소

## 🔒 보안

- API 키는 서버 환경 변수로 안전하게 관리
- API Routes는 서버사이드에서만 실행
- 클라이언트에 민감 정보 노출 없음

## 📊 비용

- **Vercel**: 무료 플랜 사용 가능
- **YouTube API**: 무료 (일일 10,000 units)
- **OpenAI API**: 사용량에 따라 과금 (gpt-4o-mini 권장)

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
- OpenAI API 크레딧 잔액 확인

## 📚 참고 문서

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [OpenAI API](https://platform.openai.com/docs)
