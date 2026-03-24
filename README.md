# Go-Travel

AI 기반 여행지 장소 추출 웹 애플리케이션 - YouTube 영상에서 여행지 정보를 자동으로 추출합니다.

## 📖 프로젝트 개요

YouTube에서 특정 여행지 관련 영상을 검색하고, AI를 사용하여 각 영상의 자막에서 언급된 **실제 장소(관광지, 맛집, 카페 등)**를 추출하여 사용자에게 제공하는 웹 애플리케이션입니다.

### 작동 방식

```
1. 사용자가 웹에서 여행지 입력 (예: "교토")
   ↓
2. YouTube에서 해당 여행지 영상 검색 (조회수 상위 20개, 타이틀 필터링)
   ↓
3. 각 영상의 자막 수집
   ↓
4. OpenAI GPT-4o-mini로 자막에서 장소 추출 (구체적인 상호명만)
   ↓
5. 중복 제거 및 언급 횟수 계산
   ↓
6. 웹 화면에 결과 표시 + 구글 지도 링크 제공
```

## ✨ 주요 기능

- 🔍 **여행지 기반 검색**: 원하는 여행지를 입력하면 관련 YouTube 영상 자동 검색
- 📝 **자동 자막 수집**: YouTube 자막 API를 통한 자동 수집
- 🤖 **AI 장소 추출**: OpenAI GPT-4o-mini를 사용한 정확한 장소 추출
- 🗺️ **구글 지도 연동**: 각 장소마다 구글 지도 링크 제공
- 📊 **통계 분석**: 여러 영상에서 언급된 횟수 자동 집계
- 🎯 **스마트 필터링**: 호텔, 일반 지역명, 외부 지역 자동 제외
- 📱 **반응형 UI**: Tailwind CSS 기반 모던 UI

## 🚀 시작하기

### 사전 요구사항

#### 1. YouTube Data API 키
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성
3. "YouTube Data API v3" 활성화
4. API 키 생성

#### 2. OpenAI API 키
1. [OpenAI Platform](https://platform.openai.com/) 접속
2. API Keys 페이지에서 새 키 생성
3. GPT-4o-mini 모델 사용 (비용 효율적)

### 설치

```bash
# 저장소 클론
git clone <your-repo-url>
cd go-travel/web

# 의존성 설치
npm install
```

### 환경 변수 설정

```bash
# .env.local.example을 .env.local로 복사
cp .env.local.example .env.local
```

`.env.local` 파일 편집:

```env
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# AI Model (선택사항)
AI_MODEL=gpt-4o-mini
```

### 로컬 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### Vercel 배포

```bash
vercel --prod
```

Vercel 대시보드에서 환경 변수를 설정하고 Root Directory를 `web`으로 설정합니다.

## 💻 사용 방법

1. 웹 페이지에서 여행지 입력 (예: 교토, 후쿠오카, 오사카)
2. "검색 시작" 버튼 클릭
3. AI가 YouTube 영상을 분석하여 장소 추출 (약 1-2분 소요)
4. 결과 화면에서 추출된 장소 확인
5. "📍 지도" 버튼을 클릭하여 구글 지도에서 위치 확인

## 📁 프로젝트 구조

```
go-travel/
└── web/                           # Next.js 웹 애플리케이션
    ├── app/
    │   ├── api/
    │   │   └── search/route.ts    # 메인 API (YouTube + AI 추출)
    │   ├── page.tsx               # 메인 페이지
    │   └── layout.tsx             # 루트 레이아웃
    ├── components/
    │   ├── SearchForm.tsx         # 검색 폼
    │   └── Results.tsx            # 결과 표시 (지도 링크 포함)
    ├── lib/
    │   ├── services/
    │   │   ├── youtube.ts         # YouTube 검색
    │   │   ├── transcript.ts      # 자막 수집
    │   │   └── placeExtractor.ts  # AI 장소 추출
    │   └── types/                 # TypeScript 타입
    └── .env.local                 # 환경 변수
```

## 🔧 기술 스택

- **Frontend**: React 18, Next.js 15, Tailwind CSS
- **Backend**: Next.js API Routes
- **APIs**: YouTube Data API v3, OpenAI GPT-4o-mini
- **Libraries**: youtube-transcript, axios
- **Deployment**: Vercel

## 🎯 AI 필터링 규칙

AI는 다음 규칙에 따라 장소를 필터링합니다:

- ✅ **포함**: 구체적인 상호명이 있는 장소 (예: "이치란 라멘", "니시키 시장")
- ❌ **제외**: 일반적인 지역명 (예: "교토", "오사카")
- ❌ **제외**: 호텔/숙박시설
- ❌ **제외**: 검색 지역 외부 장소
- ❌ **제외**: 애매한 표현 (예: "그 카페", "유명한 곳")

## 📊 추출 카테고리

- **맛집**: 레스토랑, 라멘집 등
- **카페**: 커피숍, 디저트 카페
- **관광지**: 유명 관광 명소, 전망대
- **사찰**: 신사, 절 등
- **시장**: 전통 시장
- **쇼핑**: 쇼핑몰, 상점가
- **액티비티**: 체험 시설, 오락실
- **기타**: 공원, 역 등

## 💰 비용 예상

### YouTube API
- 무료 할당량: 10,000 units/일
- 영상 20개 검색: 약 150 units

### OpenAI API (GPT-4o-mini)
- 입력: $0.150 / 1M tokens
- 출력: $0.600 / 1M tokens
- 영상 20개 처리: 약 $0.03-0.08

### Vercel
- 무료 플랜 사용 가능

## ⚠️ 주의사항

- YouTube API 일일 할당량 제한이 있습니다
- 모든 영상에 자막이 있는 것은 아닙니다
- AI 추출 정확도는 자막 품질에 따라 다를 수 있습니다
- 검색 결과는 실시간 YouTube 데이터에 기반합니다

## 📝 라이선스

MIT

## 📚 참고 문서

- [Web README](./web/README.md) - 웹 애플리케이션 상세 문서
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [OpenAI API](https://platform.openai.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
