# Go-Travel

AI 기반 여행지 장소 추출 시스템 - YouTube 영상에서 여행지 정보를 자동으로 추출하여 Notion에 정리합니다.

## 📖 프로젝트 개요

YouTube에서 특정 여행지 관련 영상을 검색하고, AI를 사용하여 각 영상의 자막에서 언급된 **실제 장소(관광지, 맛집, 카페 등)**를 추출하여 Notion 데이터베이스에 자동으로 정리하는 시스템입니다.

### 작동 방식

```
1. 사용자가 여행지 입력 (예: "교토")
   ↓
2. YouTube에서 해당 여행지 영상 검색 (조회수 상위 30개)
   ↓
3. 각 영상의 자막 수집
   ↓
4. OpenAI GPT-4o-mini로 자막에서 장소 추출
   ↓
5. 중복 제거 및 언급 횟수 계산
   ↓
6. Notion Database에 저장
```

## ✨ 주요 기능

- 🔍 **여행지 기반 검색**: 원하는 여행지를 입력하면 관련 YouTube 영상 자동 검색
- 📝 **자동 자막 수집**: YouTube 자막 API를 통한 자동 수집 (한국어/영어)
- 🤖 **AI 장소 추출**: OpenAI GPT-4o-mini를 사용한 정확한 장소 추출
- 📊 **통계 분석**: 여러 영상에서 언급된 횟수 자동 집계
- 📌 **Notion 연동**: 추출된 장소를 깔끔하게 정리하여 Notion에 저장

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

#### 3. Notion Integration & Database
1. [Notion Integrations](https://www.notion.so/my-integrations)에서 Integration 생성
2. Notion에 새 Database 생성 (아래 스키마 참조)
3. Database에 Integration 연결

### Notion Database 스키마

다음 속성을 가진 데이터베이스를 만드세요:

| 속성명 | 타입 | 설명 |
|--------|------|------|
| name | Title | 장소 이름 |
| category | Select | 카테고리 (관광지/맛집/카페/호텔/사찰/시장/쇼핑/액티비티/기타) |
| destination | Select | 여행지 (교토/오사카/파리 등) |
| mention count | Number | 언급 횟수 |
| description | Text | 장소 설명 |
| mentioned videos | Text | 언급된 영상 제목들 |

### 설치

```bash
# 저장소 클론
git clone <your-repo-url>
cd go-travel

# 의존성 설치
npm install
```

### 환경 변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env
```

`.env` 파일 편집:

```env
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here

# Notion Integration
NOTION_API_KEY=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# 설정
MAX_RESULTS=30
AI_MODEL=gpt-4o-mini
```

## 💻 사용 방법

### 기본 실행

```bash
npm run dev
```

실행 후 여행지를 입력하세요:
```
? 여행지를 입력하세요: 교토
```

### 실행 예시

```
🌍 Go-Travel: AI-Powered Travel Place Extractor

==================================================

? 여행지를 입력하세요: 교토

✈️  Searching for: 교토

==================================================

📊 Setting up Notion database...
Database found: Travel Places
Database is ready to use

🔍 Searching YouTube for "교토" videos...
✅ Found 30 videos

📝 Fetching transcripts for 30 videos...

  [1/30] 교토 여행 브이로그... ✅
  [2/30] 교토 맛집 추천... ✅
  ...

✅ Successfully fetched 28/30 transcripts

🤖 Extracting places using AI (gpt-4o-mini)...

  [1/28] Analyzing: 교토 여행 브이로그... ✅ (12 places)
  [2/28] Analyzing: 교토 맛집 추천... ✅ (8 places)
  ...

📍 Total places extracted: 234
📍 Unique places after merging: 45

📤 Adding 45 places to Notion...

  [1/45] 기요미즈데라 (사찰)... ✅
  [2/45] 니시키시장 (시장)... ✅
  ...

==================================================

📊 Summary:

  Destination: 교토
  Videos found: 30
  Transcripts collected: 28
  Unique places extracted: 45
  Places saved to Notion: 45

🏆 Top 5 Most Mentioned Places:

  1. 기요미즈데라 (사찰) - 12 mentions
  2. 니시키시장 (시장) - 10 mentions
  3. 아라시야마 (관광지) - 9 mentions
  4. 후시미이나리 (사찰) - 8 mentions
  5. 이치란라멘 (맛집) - 7 mentions

✨ Done! Check your Notion database.
```

## 📁 프로젝트 구조

```
go-travel/
├── src/
│   ├── services/
│   │   ├── youtube.ts          # YouTube API 연동
│   │   ├── transcript.ts       # 자막 수집
│   │   ├── placeExtractor.ts   # AI 기반 장소 추출
│   │   └── notion.ts           # Notion API 연동
│   ├── types/
│   │   └── index.ts            # TypeScript 타입 정의
│   ├── utils/
│   │   ├── config.ts           # 환경 변수 관리
│   │   └── prompt.ts           # 사용자 입력 처리
│   └── index.ts                # 메인 실행 파일
├── .env                        # 환경 변수 (git ignored)
├── .env.example                # 환경 변수 예시
├── claude.md                   # 요구사항 명세서
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 기술 스택

- **TypeScript** - 타입 안전성
- **YouTube Data API v3** - 영상 검색 및 정보 수집
- **youtube-transcript** - 자막 추출
- **OpenAI GPT-4o-mini** - AI 기반 장소 추출
- **Notion API** - 데이터 저장 및 관리
- **prompts** - 대화형 CLI 인터페이스

## 💰 비용 예상

### YouTube API
- 무료 할당량: 10,000 units/일
- 영상 30개 검색: 약 200 units

### OpenAI API (GPT-4o-mini)
- 입력: $0.150 / 1M tokens
- 출력: $0.600 / 1M tokens
- 영상 30개 처리: 약 $0.05-0.10

## ⚠️ 주의사항

- YouTube API 일일 할당량 제한이 있습니다
- 모든 영상에 자막이 있는 것은 아닙니다
- AI 추출 정확도는 자막 품질에 따라 다를 수 있습니다
- Notion API는 초당 3회 요청 제한이 있습니다

## 🐛 문제 해결

### "API key not valid" 오류
- YouTube API 키가 올바른지 확인
- Google Cloud Console에서 YouTube Data API v3가 활성화되어 있는지 확인

### "Could not find database" 오류
- Notion Database ID가 올바른지 확인
- Integration이 데이터베이스 페이지에 연결되어 있는지 확인

### OpenAI API 오류
- API 키가 유효한지 확인
- 계정에 크레딧이 있는지 확인

## 📝 라이선스

MIT

## 🤝 기여

이슈와 PR을 환영합니다!

## 📚 참고 문서

- [claude.md](./claude.md) - 상세 요구사항 명세서
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [OpenAI API](https://platform.openai.com/docs)
- [Notion API](https://developers.notion.com/)
