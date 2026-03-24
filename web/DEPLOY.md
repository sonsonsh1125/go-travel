# Vercel 배포 가이드

Go-Travel 웹 애플리케이션을 Vercel에 배포하는 완전한 가이드입니다.

## 🚀 배포 방법

### 옵션 1: GitHub를 통한 자동 배포 (추천)

#### 1. GitHub 저장소 생성

```bash
cd /Users/sonson/go-travel
git init
git add .
git commit -m "Initial commit: Go-Travel web app"
gh repo create go-travel --public --source=. --remote=origin --push
```

#### 2. Vercel에서 Import

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. "Add New" → "Project" 클릭
3. GitHub 저장소 연결
4. `go-travel` 저장소 선택
5. **Root Directory** 설정: `web`로 변경
6. **Framework Preset**: Next.js (자동 감지됨)
7. "Deploy" 클릭

#### 3. 환경 변수 설정

Vercel 프로젝트 설정 → "Environment Variables":

| Name | Value | Environment |
|------|-------|-------------|
| `YOUTUBE_API_KEY` | AIzaSy... | Production, Preview, Development |
| `OPENAI_API_KEY` | sk-... | Production, Preview, Development |
| `AI_MODEL` | gpt-4o-mini | Production, Preview, Development |

---

### 옵션 2: Vercel CLI를 통한 배포

#### 1. Vercel CLI 설치

```bash
npm i -g vercel
```

#### 2. Vercel 로그인

```bash
vercel login
```

#### 3. 프로젝트 배포

```bash
cd /Users/sonson/go-travel/web
vercel
```

프롬프트에서:
- **Set up and deploy**: Y
- **Which scope**: 본인 계정 선택
- **Link to existing project**: N
- **Project name**: go-travel (또는 원하는 이름)
- **In which directory**: `./` (현재 디렉토리)
- **Override settings**: N

#### 4. 환경 변수 추가

```bash
vercel env add YOUTUBE_API_KEY
# 값 입력: AIzaSy...
# Environment: Production, Preview, Development

vercel env add OPENAI_API_KEY
# 값 입력: sk-...

vercel env add AI_MODEL
# 값 입력: gpt-4o-mini
```

#### 5. 프로덕션 배포

```bash
vercel --prod
```

---

## 📋 배포 전 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] YouTube API 키 발급 완료
- [ ] OpenAI API 키 발급 완료
- [ ] OpenAI 계정에 크레딧이 있는지 확인
- [ ] Vercel 계정 생성 완료
- [ ] `web/` 디렉토리에서 빌드 테스트 완료

## 🔧 로컬 빌드 테스트

배포 전에 로컬에서 프로덕션 빌드를 테스트하세요:

```bash
cd web
npm install
npm run build
npm start
```

브라우저에서 `http://localhost:3000` 확인

## 🌍 배포 후 확인사항

### 1. URL 접속

배포 완료 후 Vercel이 제공하는 URL로 접속:
- Production: `https://your-project.vercel.app`
- Preview: `https://your-project-xxx.vercel.app`

### 2. 기능 테스트

- [ ] 여행지 입력 테스트
- [ ] YouTube 검색 작동 확인
- [ ] AI 장소 추출 확인
- [ ] Notion 저장 테스트

### 3. 환경 변수 확인

Vercel Dashboard → Project → Settings → Environment Variables에서 모든 변수가 설정되어 있는지 확인

## 🔄 재배포

### GitHub 연결 시 (자동)

```bash
git add .
git commit -m "Update: ..."
git push origin main
```

→ Vercel이 자동으로 재배포

### Vercel CLI 사용

```bash
cd web
vercel --prod
```

## 📊 도메인 연결 (선택사항)

### 커스텀 도메인 설정

1. Vercel Dashboard → Project → Settings → Domains
2. "Add" 클릭
3. 도메인 입력 (예: `gotravel.example.com`)
4. DNS 설정 안내에 따라 설정

## 🐛 트러블슈팅

### 빌드 실패

**증상**: Vercel 빌드가 실패함

**해결**:
```bash
# 로컬에서 빌드 테스트
cd web
rm -rf .next node_modules
npm install
npm run build
```

### API 호출 실패

**증상**: "Server configuration error: Missing API keys"

**해결**:
- Vercel Dashboard → Settings → Environment Variables 확인
- 환경 변수 재배포: Deployments → 점 3개 → Redeploy

### 함수 타임아웃

**증상**: "Function execution timed out"

**해결**:
- Vercel Pro 플랜 필요 (무료는 10초 제한)
- 또는 `MAX_RESULTS` 줄이기 (30 → 10)

### CORS 오류

**증상**: 브라우저에서 CORS 에러

**해결**:
- API Routes는 자동으로 CORS 설정됨
- 외부 도메인에서 호출 시 `next.config.ts`에 CORS 설정 추가

## 📈 성능 최적화

### 1. Edge Runtime 사용 (선택사항)

```typescript
// app/api/search/route.ts
export const runtime = 'edge'; // 더 빠른 응답
```

⚠️ 주의: youtube-transcript는 Node.js 런타임 필요

### 2. 응답 캐싱

```typescript
export const revalidate = 3600; // 1시간 캐시
```

### 3. 이미지 최적화

```typescript
// next.config.ts
images: {
  domains: ['i.ytimg.com'], // YouTube 썸네일
}
```

## 💰 비용 관리

### Vercel 무료 플랜 제한

- 월 100GB 대역폭
- 월 1000 Edge Functions 실행
- 서버리스 함수 10초 제한

### 비용 절감 팁

1. **캐싱 활용**: 같은 여행지 검색 시 캐시 사용
2. **MAX_RESULTS 제한**: 30개 → 10개로 줄이기
3. **OpenAI 모델**: gpt-4o-mini 사용 (가장 저렴)

## 📞 지원

문제가 발생하면:
- [Vercel 문서](https://vercel.com/docs)
- [Vercel 커뮤니티](https://github.com/vercel/vercel/discussions)
- [Next.js 문서](https://nextjs.org/docs)

---

**Happy Deploying! 🚀**
