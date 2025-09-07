# 🏗️ InfoGraphAI 프로젝트 구조

## 📁 디렉토리 구조

```
infographai/
├── 📱 apps/                    # 애플리케이션
│   ├── api/                   # API 서버 (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── routes/        # API 라우트
│   │   │   ├── middleware/    # 미들웨어
│   │   │   ├── lib/          # 라이브러리
│   │   │   └── index.ts      # 진입점
│   │   └── package.json
│   │
│   └── web/                   # 웹 애플리케이션 (Next.js)
│       ├── app/               # App Router
│       ├── components/        # React 컴포넌트
│       ├── lib/              # 유틸리티
│       └── public/           # 정적 파일
│
├── 📦 packages/                # 공유 패키지
│   ├── scenario-manager/      # 시나리오 관리 시스템
│   ├── cost-monitor/          # 비용 모니터링
│   ├── korean-subtitle/       # 한국어 자막 생성
│   ├── video-orchestrator/    # 비디오 처리
│   ├── video-synthesizer/     # 비디오 합성
│   ├── infographic-generator/ # 인포그래픽 생성
│   ├── gpt-service/           # GPT 서비스
│   ├── subtitle-generator/    # 자막 생성
│   ├── asset-loader/          # Asset 로더
│   ├── asset-manager/         # Asset 관리
│   └── shared/                # 공통 유틸리티
│
├── 🎨 assets/                  # 리소스 (1,164개)
│   ├── groups/                 # 그룹별 정리
│   │   ├── core/              # 핵심 UI (21개)
│   │   ├── ai-ml/             # AI/ML 아이콘 (25개)
│   │   ├── visuals/           # 비주얼 (29개)
│   │   └── templates/         # 템플릿 (550+개)
│   ├── icons/                  # 아이콘
│   │   ├── ui/                # UI 아이콘
│   │   ├── brands/            # 브랜드 아이콘
│   │   └── ai/                # AI 관련 아이콘
│   ├── images/                 # 이미지
│   │   ├── backgrounds/       # 배경 이미지
│   │   └── illustrations/     # 일러스트레이션
│   └── originals/              # 원본 파일
│
├── 🛠️ scripts/                 # 스크립트
│   ├── mass-asset-collector.sh        # 대량 asset 수집
│   ├── ai-asset-collector.sh          # AI asset 수집
│   ├── asset-group-organizer.sh       # asset 그룹 정리
│   ├── asset-cleanup.sh               # asset 정리
│   └── ...                            # 기타 유틸리티
│
├── 🚀 bin/                     # 실행 스크립트
│   ├── start.sh               # 개별 서버 시작
│   ├── stop.sh                # 서버 종료
│   └── dev.sh                 # Turbo 개발 모드
│
├── 🧪 tests/                   # 테스트 파일
│   ├── test-integration.js
│   ├── test-scenario-manager.js
│   └── ...
│
├── 📚 docs/                    # 문서
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── ...
│
├── 🔧 설정 파일
├── .env.example               # 환경변수 예제
├── .env.local                 # 로컬 환경변수
├── .eslintrc.js              # ESLint 설정
├── .prettierrc               # Prettier 설정
├── docker-compose.yml        # Docker 설정
├── turbo.json                # Turbo 설정
├── package.json              # 루트 패키지
└── README.md                 # 프로젝트 설명

```

## 🚀 빠른 시작

### 1. 프로젝트 실행

```bash
# 전체 개발 환경 실행 (추천)
./dev.sh

# 또는 개별 서버 실행
./start.sh

# 서버 종료
./stop.sh
```

### 2. 접속 주소

- 웹 애플리케이션: http://localhost:3000
- API 서버: http://localhost:4000
- API 헬스체크: http://localhost:4000/health

## 📊 프로젝트 통계

- **총 Asset**: 1,164개
- **패키지**: 14개
- **앱**: 2개 (API, Web)
- **스크립트**: 18개

## 🛠️ 기술 스택

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query

### Backend
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

### Infrastructure
- Docker
- Turbo (Monorepo)
- GitHub Actions

## 📦 주요 패키지

| 패키지 | 설명 | 상태 |
|--------|------|------|
| scenario-manager | 시나리오 자동 생성 및 관리 | ✅ 완료 |
| cost-monitor | API 비용 모니터링 | ✅ 완료 |
| korean-subtitle | 한국어 자막 생성 | ✅ 완료 |
| video-orchestrator | 비디오 처리 파이프라인 | ✅ 완료 |
| asset-loader | Asset 프로그래밍 접근 | ✅ 완료 |

## 🔐 환경 변수

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/infographai"

# API Keys
OPENAI_API_KEY="your-key"
ANTHROPIC_API_KEY="your-key"

# Server
PORT=4000
NODE_ENV=development
```

## 📝 개발 가이드

### 새 패키지 추가
```bash
cd packages
mkdir new-package
cd new-package
npm init -y
```

### Asset 수집
```bash
./scripts/mass-asset-collector.sh
./scripts/ai-asset-collector.sh
```

### 테스트 실행
```bash
cd tests
node test-integration.js
```

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 라이센스

MIT License

---

마지막 업데이트: 2025년 9월 6일