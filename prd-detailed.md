# InfoGraphAI 상세 PRD (Product Requirements Document)
**Version 2.0 - Detailed Implementation Plan**

---

## 📌 제품 정의

### 제품명
**InfoGraphAI** - AI 기반 IT 기술 교육 영상 자동 생성 플랫폼

### 한 줄 설명
"IT 기술 주제를 입력하면 30분 안에 고품질 인포그래픽 교육 영상을 자동 생성하는 AI 플랫폼"

### 핵심 가치
1. **시간 절약**: 1주일 → 30분 (98% 단축)
2. **비용 절감**: $2,000 → $99 (95% 절감)
3. **품질 보장**: AI 기반 일관된 고품질
4. **무한 확장**: 다국어, 다양한 포맷 즉시 생성

---

## 🏗️ 시스템 아키텍처 상세

### 전체 아키텍처 다이어그램
```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │   Auth   │ │  Editor  │ │ Preview  │ │  Export  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                   API Gateway (Express)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Rate Limiting | Auth | Validation | Routing     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                    Microservices Layer                    │
├─────────────┬─────────────┬─────────────┬──────────────┤
│  Content    │   Script    │  Animation  │    Audio     │
│  Analysis   │ Generation  │   Engine    │   Service    │
│  (Python)   │  (Node.js)  │  (Node.js)  │  (Node.js)   │
├─────────────┼─────────────┼─────────────┼──────────────┤
│             │             │             │              │
│ • Topic     │ • GPT-4     │ • Canvas    │ • TTS        │
│   Parser    │   Integration│   Renderer  │   Generation │
│ • Knowledge │ • Template  │ • Timeline  │ • Sync       │
│   Base      │   Engine    │   Manager   │   Engine     │
│ • Structure │ • Quality   │ • Effects   │ • Music      │
│   Designer  │   Check     │   Library   │   Mixer      │
└─────────────┴─────────────┴─────────────┴──────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                    Data & Storage Layer                   │
├──────────────┬──────────────┬──────────────┬───────────┤
│  PostgreSQL  │    Redis     │     S3       │    CDN    │
│  (Metadata)  │   (Cache)    │  (Assets)    │ (Delivery)│
└──────────────┴──────────────┴──────────────┴───────────┘
```

### 기술 스택 상세

#### Frontend
```yaml
Framework: Next.js 14 (App Router)
Language: TypeScript 5.x
Styling: 
  - Tailwind CSS 3.x
  - CSS Modules
  - Framer Motion (animations)
UI Components:
  - Radix UI (headless components)
  - Custom design system
State Management:
  - Zustand (global state)
  - React Query v5 (server state)
  - React Hook Form (forms)
Canvas/Graphics:
  - Fabric.js (2D graphics)
  - Three.js (3D effects)
  - Konva.js (timeline editor)
Testing:
  - Jest (unit tests)
  - React Testing Library
  - Playwright (E2E)
Build Tools:
  - Turbo (monorepo)
  - ESLint + Prettier
  - Husky (git hooks)
```

#### Backend Services
```yaml
API Gateway:
  Language: Node.js 20 LTS
  Framework: Express 4.x
  Middleware:
    - Helmet (security)
    - CORS
    - Rate limiting
    - Morgan (logging)
    - Joi (validation)

Content Analysis Service:
  Language: Python 3.11
  Framework: FastAPI
  ML Libraries:
    - Transformers (NLP)
    - spaCy (entity recognition)
    - scikit-learn
  Database: PostgreSQL

Script Generation Service:
  Language: Node.js 20 LTS
  AI Integration:
    - OpenAI GPT-4 API
    - Anthropic Claude API (backup)
    - Custom prompt engineering
  Template Engine: Handlebars

Animation Engine:
  Language: Node.js 20 LTS
  Graphics:
    - Canvas API
    - WebGL (GPU acceleration)
    - SVG manipulation
  Libraries:
    - Sharp (image processing)
    - FFmpeg (video encoding)

Audio Service:
  Language: Node.js 20 LTS
  TTS Providers:
    - ElevenLabs (primary)
    - Azure Speech (backup)
    - Google TTS (fallback)
  Audio Processing:
    - FFmpeg
    - Web Audio API
```

#### Infrastructure
```yaml
Cloud Provider: AWS
Compute:
  - ECS Fargate (microservices)
  - Lambda (rendering jobs)
  - EC2 GPU instances (ML/rendering)
Storage:
  - S3 (assets, videos)
  - EFS (shared storage)
Database:
  - RDS PostgreSQL (primary)
  - ElastiCache Redis (caching)
  - DynamoDB (sessions)
CDN: CloudFront
Queue: SQS + SNS
Monitoring:
  - CloudWatch
  - DataDog
  - Sentry
CI/CD:
  - GitHub Actions
  - AWS CodePipeline
  - ArgoCD (K8s)
```

---

## 🎨 인포그래픽 & 사운드 에셋 전략

### 필수 에셋 라이브러리

#### 시각적 에셋
```yaml
아이콘 & 로고:
  - Devicon: 200+ 프로그래밍 언어/프레임워크 아이콘
  - Simple Icons: 2,400+ 브랜드/기술 로고
  - Tabler Icons: 3,400+ 일반 UI 아이콘
  - Heroicons: 292개 정교한 아이콘

일러스트레이션:
  - unDraw: 커스터마이징 가능한 SVG 일러스트
  - Storyset: 애니메이션 가능한 일러스트
  - DrawKit: 100+ 무료 일러스트

애니메이션:
  - LottieFiles: JSON 기반 애니메이션
  - Rive: 인터랙티브 애니메이션

배경 패턴:
  - Hero Patterns: SVG 배경 패턴
  - Haikei: 웨이브, 블롭, 그라디언트
```

#### 오디오 에셋
```yaml
효과음:
  - Mixkit: 고품질 무료 효과음
  - Freesound.org: 50만+ 커뮤니티 사운드
  - Zapsplat: 10만+ 효과음 (무료 계정)
  
배경음악:
  - YouTube Audio Library: 공식 무료 음원
  - Incompetech: Kevin MacLeod 무료 BGM
  - Bensound: 기술/기업 분위기 BGM

IT 특화 사운드:
  - 키보드 타이핑 효과
  - 마우스 클릭음
  - 서버/데이터 처리음
  - 코드 컴파일 효과음
  - 알림/성공/에러 사운드
```

### 에셋 다운로드 스크립트
```javascript
// scripts/download-assets.js
const ASSETS_CONFIG = {
  icons: {
    tech: [
      'react', 'vue', 'angular', 'nodejs', 
      'python', 'docker', 'kubernetes', 'aws'
    ],
    ui: [
      'arrow-right', 'check', 'x', 'alert',
      'play', 'pause', 'settings', 'database'
    ]
  },
  sounds: {
    transitions: [
      'swoosh-1.mp3', 'whoosh-1.mp3', 
      'slide-in.mp3', 'pop.mp3'
    ],
    ui: [
      'click.mp3', 'hover.mp3', 'success.mp3',
      'error.mp3', 'notification.mp3'
    ],
    background: [
      'tech-ambient.mp3', 'corporate.mp3',
      'uplifting.mp3', 'minimal.mp3'
    ]
  }
};
```

### 에셋 폴더 구조
```
/assets
├── /icons
│   ├── /tech         # 기술 스택 아이콘
│   ├── /ui           # UI 요소 아이콘
│   └── /brands       # 브랜드 로고
├── /illustrations
│   ├── /concepts     # 개념 설명용
│   └── /processes    # 프로세스 다이어그램
├── /sounds
│   ├── /effects      # 효과음
│   ├── /transitions  # 전환 효과음
│   └── /bgm          # 배경음악
├── /animations
│   └── /lottie       # Lottie JSON 파일
└── /patterns
    └── /backgrounds  # 배경 패턴
```

---

## 🎯 Phase 1: MVP Core (Week 1-4)

### 목표
- 기본 파이프라인 구축
- 단순 주제 → 영상 생성 흐름 완성
- 1개 템플릿으로 PoC 검증

### Task Breakdown

#### Week 1: Foundation Setup
```yaml
Task 1.1: Project Setup (2 days)
  Sub-tasks:
    1.1.1: Repository 초기화
      - Monorepo 구조 설정 (Turborepo)
      - Package.json 설정
      - TypeScript 설정
      - Git hooks 설정
      Test: 빌드 성공 확인
    
    1.1.2: Development 환경
      - Docker Compose 설정
      - 환경 변수 관리 (.env)
      - VS Code 설정 공유
      Test: docker-compose up 성공
    
    1.1.3: CI/CD 기초
      - GitHub Actions 설정
      - 자동 테스트 파이프라인
      - 린트/포맷 체크
      Test: PR 생성 시 자동 체크

Task 1.2: Infographic Assets Setup (1 day)
  Sub-tasks:
    1.2.1: 에셋 라이브러리 설치
      - npm install devicon simple-icons @tabler/icons
      - npm install @heroicons/react phosphor-icons
      - npm install lottie-react framer-motion
      Test: 패키지 설치 및 import 테스트
    
    1.2.2: 에셋 다운로드 및 구조화
      - 자동 다운로드 스크립트 작성
      - 폴더 구조 생성 (/assets)
      - 기본 아이콘 50개 다운로드
      - 사운드 효과음 20개 (Mixkit/Freesound)
      - 배경음악 5개 다운로드
      Test: 에셋 로딩 테스트
    
    1.2.3: 에셋 관리 시스템
      - AssetManager 컴포넌트 개발
      - 에셋 캐싱 시스템
      - CDN 연동 준비
      Test: 동적 에셋 로딩 확인

Task 1.3: Database Schema (1 day)
  Sub-tasks:
    1.3.1: 스키마 설계
      - Users 테이블
      - Projects 테이블
      - Videos 테이블
      - Assets 테이블
      Test: Migration 실행 성공
    
    1.3.2: Prisma 설정
      - Prisma schema 정의
      - Migration 생성
      - Seed data 작성
      Test: CRUD 작업 테스트

Task 1.4: Authentication (1 day)
  Sub-tasks:
    1.4.1: NextAuth 설정
      - Google OAuth
      - Email/Password
      - Session 관리
      Test: 로그인/로그아웃 플로우
    
    1.4.2: API 보안
      - JWT 토큰 검증
      - Rate limiting
      - CORS 설정
      Test: Protected route 접근 테스트
```

#### Week 2: AI Pipeline Core
```yaml
Task 2.1: GPT-4 Integration (3 days)
  Sub-tasks:
    2.1.1: OpenAI API 연동
      - API 클라이언트 설정
      - Error handling
      - Retry logic
      Test: 간단한 프롬프트 응답 확인
    
    2.1.2: 프롬프트 엔지니어링
      - 스크립트 생성 프롬프트
      - 구조화된 출력 파싱
      - 품질 검증 로직
      Test: 5개 샘플 주제 테스트
    
    2.1.3: 스크립트 후처리
      - 섹션 분리
      - 타이밍 계산
      - 메타데이터 추출
      Test: JSON 출력 검증

Task 2.2: Basic Animation Engine (2 days)
  Sub-tasks:
    2.2.1: Canvas 설정
      - Node Canvas 초기화
      - 기본 도형 렌더링
      - 텍스트 렌더링
      Test: PNG 이미지 생성
    
    2.2.2: 애니메이션 시스템
      - Timeline 관리
      - Keyframe 시스템
      - 기본 트랜지션 (fade, slide)
      Test: 10초 애니메이션 생성
    
    2.2.3: 인포그래픽 요소 통합
      - Devicon/SimpleIcons 아이콘 렌더링
      - SVG to Canvas 변환
      - 다이어그램 레이아웃 엔진
      Test: 기술 스택 다이어그램 생성
```

#### Week 3: Video Generation
```yaml
Task 3.1: TTS Integration (2 days)
  Sub-tasks:
    3.1.1: ElevenLabs API
      - API 연동
      - 음성 생성
      - 오디오 파일 저장
      Test: 한국어 음성 생성
    
    3.1.2: 음성 동기화
      - 타임스탬프 추출
      - 스크립트 매칭
      - 싱크 조정
      Test: 자막 동기화 확인
    
    3.1.3: 사운드 효과 통합
      - 전환 효과음 적용
      - 배경음악 믹싱
      - 볼륨 레벨 조정
      - 페이드인/아웃 처리
      Test: 오디오 트랙 완성도 확인

Task 3.2: Video Rendering (3 days)
  Sub-tasks:
    3.2.1: FFmpeg 파이프라인
      - 이미지 시퀀스 → 비디오
      - 오디오 믹싱
      - 포맷 인코딩
      Test: MP4 파일 생성
    
    3.2.2: 렌더링 최적화
      - 병렬 처리
      - 캐싱 시스템
      - Progress tracking
      Test: 5분 영상 3분 내 렌더링
```

#### Week 4: MVP Integration
```yaml
Task 4.1: Frontend UI (2 days)
  Sub-tasks:
    4.1.1: 입력 인터페이스
      - 주제 입력 폼
      - 옵션 선택 (길이, 스타일)
      - 생성 버튼
      Test: 폼 제출 및 검증
    
    4.1.2: 진행 상태 표시
      - 실시간 진행률
      - 단계별 상태
      - 에러 핸들링
      Test: WebSocket 연결 테스트

Task 4.2: End-to-End Flow (3 days)
  Sub-tasks:
    4.2.1: 전체 파이프라인 연결
      - 입력 → GPT → Animation → TTS → Video
      - 에러 복구
      - 로깅 시스템
      Test: 10개 주제 성공률 80%
    
    4.2.2: MVP 테스트
      - 10명 내부 테스트
      - 피드백 수집
      - 버그 수정
      Test: 사용자 만족도 조사
```

---

## 🚀 Phase 2: Template System (Week 5-8)

### 목표
- 5개 핵심 템플릿 완성
- 편집 기능 추가
- 품질 향상

### Template Types
```yaml
1. Comparison Template (비교형)
  Use Case: "React vs Vue", "REST vs GraphQL"
  Layout:
    - Split screen
    - Feature matrix
    - Pros/cons lists
  Animations:
    - Side-by-side reveal
    - Score animation
    - Winner highlight

2. Process Template (프로세스형)
  Use Case: "CI/CD Pipeline", "OAuth Flow"
  Layout:
    - Step-by-step flow
    - Timeline view
    - Diagram progression
  Animations:
    - Sequential reveal
    - Arrow animations
    - Status indicators

3. Architecture Template (아키텍처형)
  Use Case: "Microservices", "System Design"
  Layout:
    - Component boxes
    - Connection lines
    - Layer separation
  Animations:
    - Build-up effect
    - Data flow visualization
    - Zoom in/out

4. Concept Template (개념형)
  Use Case: "What is Docker?", "Closure Explained"
  Layout:
    - Central concept
    - Supporting points
    - Examples section
  Animations:
    - Radial expansion
    - Morphing shapes
    - Highlight emphasis

5. Tutorial Template (튜토리얼형)
  Use Case: "How to use Git", "Setup React"
  Layout:
    - Code blocks
    - Terminal output
    - Result preview
  Animations:
    - Typing effect
    - Line highlighting
    - Output reveal
```

### Week 5-6: Template Implementation
```yaml
Task 5.1: Template Engine (1 week)
  Sub-tasks:
    5.1.1: Template 구조 설계
      - JSON schema 정의
      - Component system
      - Style inheritance
      Test: Template 로딩 및 파싱
    
    5.1.2: 각 템플릿 구현
      - 5개 템플릿 코딩
      - 애니메이션 라이브러리
      - 스타일 variations
      Test: 각 템플릿 렌더링

Task 5.2: Smart Template Selection (3 days)
  Sub-tasks:
    5.2.1: AI 템플릿 추천
      - 주제 분석
      - 템플릿 매칭 로직
      - Confidence score
      Test: 정확도 80% 이상
```

### Week 7-8: Editor & Quality
```yaml
Task 6.1: Visual Editor (1 week)
  Sub-tasks:
    6.1.1: Timeline Editor
      - Drag & drop
      - 구간 편집
      - 미리보기
      Test: 편집 저장 및 로드
    
    6.1.2: Style Editor
      - 색상 변경
      - 폰트 선택
      - 레이아웃 조정
      Test: 실시간 반영

Task 6.2: Quality Improvements (1 week)
  Sub-tasks:
    6.2.1: 고품질 애니메이션
      - 60fps 지원
      - Smooth transitions
      - Physics-based motion
      Test: Performance 벤치마크
    
    6.2.2: 4K 렌더링
      - 해상도 옵션
      - 비트레이트 최적화
      - 파일 크기 관리
      Test: 4K 출력 품질 검증
```

---

## 🎨 Phase 3: Production Ready (Week 9-12)

### 목표
- 상용화 준비 완료
- 결제 시스템
- 확장성 확보

### Week 9-10: Business Features
```yaml
Task 7.1: Payment System (1 week)
  Sub-tasks:
    7.1.1: Stripe 통합
      - 구독 플랜 설정
      - 결제 프로세스
      - 인보이스 생성
      Test: 테스트 결제 완료
    
    7.1.2: Usage Tracking
      - 크레딧 시스템
      - 사용량 모니터링
      - 제한 적용
      Test: 제한 초과 시나리오

Task 7.2: Team Features (1 week)
  Sub-tasks:
    7.2.1: 팀 관리
      - 멤버 초대
      - 권한 관리
      - 프로젝트 공유
      Test: 협업 시나리오
    
    7.2.2: Brand Kit
      - 로고 업로드
      - 커스텀 색상
      - 폰트 설정
      Test: 브랜딩 적용
```

### Week 11-12: Scale & Performance
```yaml
Task 8.1: Performance Optimization (1 week)
  Sub-tasks:
    8.1.1: 렌더링 최적화
      - GPU 가속
      - 분산 렌더링
      - Queue 시스템
      Test: 동시 10개 렌더링
    
    8.1.2: 캐싱 전략
      - Redis 캐싱
      - CDN 설정
      - Asset optimization
      Test: 응답 시간 측정

Task 8.2: Production Deployment (1 week)
  Sub-tasks:
    8.2.1: AWS 배포
      - ECS 설정
      - RDS 설정
      - S3/CloudFront
      Test: 프로덕션 환경 테스트
    
    8.2.2: 모니터링 설정
      - DataDog 통합
      - 알림 설정
      - 대시보드 구성
      Test: 장애 시나리오
```

---

## 🧪 테스트 전략

### 테스트 레벨
```yaml
Level 1: Unit Tests (개별 함수)
  Coverage: 80%
  Tools: Jest, pytest
  Focus:
    - Utility functions
    - API endpoints
    - Component logic

Level 2: Integration Tests (서비스 간)
  Coverage: 60%
  Tools: Supertest, TestContainers
  Focus:
    - API workflows
    - Database operations
    - External API calls

Level 3: E2E Tests (전체 플로우)
  Coverage: Critical paths
  Tools: Playwright
  Focus:
    - 회원가입 → 영상생성
    - 결제 프로세스
    - 편집 및 다운로드

Level 4: Performance Tests
  Tools: K6, Artillery
  Metrics:
    - Response time < 500ms
    - Concurrent users: 1000
    - Rendering time < 3min

Level 5: Visual Regression Tests
  Tools: Percy, Chromatic
  Focus:
    - Template rendering
    - Animation consistency
    - Cross-browser compatibility
```

### 테스트 자동화 파이프라인
```yaml
Pre-commit:
  - Linting (ESLint, Black)
  - Type checking (TypeScript)
  - Unit tests (affected only)

Pull Request:
  - All unit tests
  - Integration tests
  - Visual regression tests
  - Code coverage check

Pre-deployment:
  - Full E2E suite
  - Performance tests
  - Security scan (Snyk)

Post-deployment:
  - Smoke tests
  - Health checks
  - Synthetic monitoring
```

---

## 📊 성공 지표 (Success Metrics)

### Phase 1 Success Criteria (Week 4)
```yaml
Technical:
  - 영상 생성 성공률: > 80%
  - 생성 시간: < 5분
  - 시스템 안정성: 99% uptime

Quality:
  - 내부 평가 점수: > 7/10
  - 스크립트 정확도: > 90%
  - 음성 자연스러움: > 8/10

Business:
  - 10명 베타 테스터 확보
  - 긍정 피드백: > 70%
  - 다음 단계 투자 확보
```

### Phase 2 Success Criteria (Week 8)
```yaml
Technical:
  - 5개 템플릿 완성
  - 편집 기능 동작
  - 4K 렌더링 지원

Quality:
  - 템플릿 만족도: > 8/10
  - 편집 사용성: > 7/10
  - 렌더링 품질: > 9/10

Business:
  - 100명 베타 사용자
  - 유료 전환 의향: > 30%
  - 월 10개 이상 영상 생성 사용자: > 50%
```

### Phase 3 Success Criteria (Week 12)
```yaml
Technical:
  - 동시 사용자: > 100
  - 일일 렌더링: > 1000개
  - API 응답시간: < 300ms

Business:
  - 유료 사용자: > 50명
  - MRR: > $5,000
  - Churn rate: < 10%
  - NPS: > 50
```

---

## 🚦 Risk Mitigation

### 기술적 리스크
```yaml
Risk 1: AI API 비용 초과
  Mitigation:
    - Usage limit per user
    - Caching frequent requests
    - Fallback to cheaper models
    - Progressive pricing tiers

Risk 2: 렌더링 성능 부족
  Mitigation:
    - Queue system with priority
    - Distributed rendering
    - GPU instance auto-scaling
    - Lower quality preview option

Risk 3: 외부 API 장애
  Mitigation:
    - Multiple provider fallbacks
    - Circuit breaker pattern
    - Local cache for common data
    - Graceful degradation
```

### 비즈니스 리스크
```yaml
Risk 1: 낮은 사용자 획득
  Mitigation:
    - Free tier with watermark
    - Referral program
    - Content marketing
    - Partnership with educators

Risk 2: 높은 이탈률
  Mitigation:
    - Onboarding improvement
    - Regular feature updates
    - Customer success team
    - Community building

Risk 3: 경쟁사 대응
  Mitigation:
    - Rapid feature iteration
    - Focus on IT niche
    - Build moat with data
    - Patent key innovations
```

---

## 📅 타임라인 요약

### 12주 로드맵
```
Week 1-4:   MVP Core       ████████████████
Week 5-8:   Templates      ░░░░████████████
Week 9-12:  Production     ░░░░░░░░████████

Milestones:
  Week 4:  MVP Demo Day
  Week 8:  Beta Launch
  Week 12: Public Launch
```

### 주요 결정 포인트
```yaml
Week 4 Decision:
  - MVP 품질 충분한가?
  - 피봇 필요한가?
  - 다음 투자 진행?

Week 8 Decision:
  - Beta 피드백 긍정적인가?
  - 기술 스택 변경 필요한가?
  - 상용화 준비되었는가?

Week 12 Decision:
  - 정식 런칭 진행?
  - 가격 정책 확정?
  - 마케팅 예산 집행?
```

---

## 🎯 다음 단계

### Immediate Actions (Today)
1. **팀 구성**
   - Lead Developer 채용 공고
   - AI Engineer 인터뷰 시작
   - Designer 포트폴리오 검토

2. **환경 설정**
   - AWS 계정 생성
   - OpenAI API 키 발급
   - GitHub repository 생성

3. **프로토타입 시작**
   - Next.js 프로젝트 초기화
   - 간단한 GPT-4 테스트
   - 기본 UI mockup

### This Week
- [ ] 개발 환경 구축 완료
- [ ] 데이터베이스 스키마 설계
- [ ] 첫 번째 AI 스크립트 생성 테스트
- [ ] 투자자 미팅 준비

### Next Week
- [ ] Authentication 구현
- [ ] 기본 애니메이션 엔진 개발
- [ ] TTS 통합 시작
- [ ] 10명 베타 테스터 모집

---

이 상세 PRD를 기반으로 한 단계씩 구현하며, 각 단계마다 테스트를 통해 검증하고 다음 단계로 진행합니다.