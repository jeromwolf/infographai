# InfoGraphAI PRD v3.0 - 완전판
**위험 요소 대응 및 운영 관점 통합 버전**

---

## 🚨 최우선 리스크 관리

### ⚠️ CRITICAL WARNING - 반드시 읽고 시작
```
이 프로젝트의 3대 킬러 리스크:
1. 💸 비용 폭발: 통제 실패 시 일일 수백만원 발생 가능
2. 🇰🇷 한국어 처리: 실패 시 한국 시장 진입 불가
3. 🎨 품질 일관성: AI 특성상 매번 다른 결과물 생성

Week 1부터 이 3가지를 해결하지 않으면 프로젝트 실패
```

---

## 📌 제품 정의

### 제품명
**InfoGraphAI** - AI 기반 IT 기술 교육 영상 자동 생성 플랫폼

### 핵심 가치
- **시간 절약**: 1주일 → 30분 (98% 단축)
- **비용 절감**: $2,000 → $99 (95% 절감)
- **품질 보장**: AI 기반 일관된 고품질
- **한국 특화**: 한국어 최적화 및 로컬 문화 반영

---

## 💰 비용 통제 시스템 (CRITICAL)

### 비용 폭발 시나리오
```yaml
위험 상황:
  - GPT-4 API: 분당 $0.06 × 1000 요청 = $60/분
  - ElevenLabs: 분당 $0.30 × 100 요청 = $30/분
  - GPU 렌더링: 시간당 $4 × 20 인스턴스 = $80/시간
  - S3 스토리지: 1TB/일 × $0.023 = $700/월
  
최악 시나리오: 일일 $5,000+ 가능
```

### 비용 통제 아키텍처
```javascript
// 비용 통제 시스템 (필수 구현)
class CostController {
  constructor() {
    this.limits = {
      daily: { hard: 1000, soft: 500 },  // USD
      hourly: { hard: 50, soft: 25 },
      perUser: { daily: 10, monthly: 100 }
    };
  }

  async checkCost(service, estimatedCost) {
    const current = await this.getCurrentSpend();
    
    if (current.daily + estimatedCost > this.limits.daily.hard) {
      throw new Error('COST_LIMIT_EXCEEDED');
    }
    
    if (current.daily + estimatedCost > this.limits.daily.soft) {
      await this.alertAdmin('APPROACHING_LIMIT');
    }
    
    return this.proceedWithThrottling(service);
  }
  
  // 서비스별 쓰로틀링
  proceedWithThrottling(service) {
    switch(service) {
      case 'GPT4':
        return { 
          model: this.selectModel(), // gpt-4 → gpt-3.5 폴백
          maxTokens: this.adjustTokens() 
        };
      case 'RENDER':
        return { 
          quality: this.adjustQuality(), // 4K → 1080p → 720p
          queue: this.getPriority() 
        };
    }
  }
}
```

### 비용 모니터링 대시보드
```yaml
Real-time Metrics:
  - 현재 시간당 지출
  - 서비스별 비용 breakdown
  - 사용자별 비용 추적
  - 예상 월말 청구액
  
Alerts:
  - 50% 한도 도달: Slack 알림
  - 80% 한도 도달: 서비스 쓰로틀링
  - 100% 한도 도달: 서비스 중단
  
Cost Optimization:
  - 캐싱 적극 활용 (중복 요청 90% 감소)
  - 낮은 품질 프리뷰 옵션
  - 오프피크 시간 배치 처리
```

---

## 🇰🇷 한국어 처리 시스템 (CRITICAL)

### 한국어 특수성 대응
```javascript
// 한국어 처리 모듈 (필수)
class KoreanProcessor {
  constructor() {
    this.fontSystem = new KoreanFontManager();
    this.particleEngine = new ParticleProcessor();
    this.termDictionary = new TechTermDictionary();
  }
  
  // 1. 한글 폰트 렌더링
  async renderText(text, canvas) {
    // 폰트 fallback 체인
    const fonts = [
      'Pretendard',      // 1순위: 모던한 한글 폰트
      'Noto Sans KR',    // 2순위: 구글 폰트
      'Malgun Gothic'    // 3순위: 시스템 폰트
    ];
    
    // 글자 간격 최적화 (한글 특성)
    const kerning = this.calculateKoreanKerning(text);
    return this.fontSystem.render(text, fonts, kerning);
  }
  
  // 2. 조사 자동 처리
  attachParticle(word, particleType) {
    const lastChar = word[word.length - 1];
    const hasJongsung = this.hasJongsung(lastChar);
    
    const particles = {
      subject: hasJongsung ? '이' : '가',
      topic: hasJongsung ? '은' : '는',
      object: hasJongsung ? '을' : '를',
      direction: hasJongsung ? '으로' : '로'
    };
    
    return word + particles[particleType];
  }
  
  // 3. 기술 용어 처리
  processTechTerm(term) {
    // 용어 사전 검색
    const entry = this.termDictionary.lookup(term);
    
    if (entry) {
      return {
        korean: entry.korean,
        english: entry.english,
        pronunciation: entry.pronunciation,
        shouldTranslate: entry.preferKorean
      };
    }
    
    // AI 기반 번역 결정
    return this.decidetranslation(term);
  }
  
  // 4. 자막 최적화
  optimizeSubtitle(text, maxLength = 40) {
    // 한글은 영어보다 짧으므로 글자 수 조정
    const adjustedMax = Math.floor(maxLength * 0.7);
    
    // 자연스러운 끊기 위치 찾기
    const breakPoints = this.findNaturalBreaks(text);
    
    return this.splitAtBreakPoints(text, breakPoints, adjustedMax);
  }
}

// 기술 용어 사전
const techTerms = {
  'API': { korean: 'API', preferKorean: false },
  'Database': { korean: '데이터베이스', preferKorean: true },
  'Cloud': { korean: '클라우드', preferKorean: true },
  'Machine Learning': { korean: '머신러닝', preferKorean: true },
  'Frontend': { korean: '프론트엔드', preferKorean: true },
  // ... 1000+ 용어
};
```

### 한국 문화 최적화
```yaml
Visual Style:
  - 색상: 파스텔톤 선호 (한국 트렌드)
  - 아이콘: 둥근 모서리 (친근감)
  - 레이아웃: 정보 밀도 높게
  
Content Tone:
  - 존댓말 기본 ("~합니다" 체)
  - 기술 설명 시 쉬운 비유 사용
  - 단계별 학습 강조
```

---

## 🎨 품질 일관성 시스템 (CRITICAL)

### AI 출력 일관성 문제
```yaml
문제점:
  - 같은 프롬프트 → 다른 결과
  - 장면별 스타일 불일치
  - 톤앤매너 변화
  - 용어 사용 불일치
```

### 품질 일관성 보장 시스템
```javascript
// 스타일 일관성 엔진
class StyleConsistencyEngine {
  constructor() {
    this.styleGuide = new StyleGuide();
    this.qualityChecker = new QualityChecker();
    this.versionControl = new VersionController();
  }
  
  // 1. 스타일 가이드 강제 적용
  async enforceStyle(content) {
    const style = {
      colors: this.styleGuide.getColorPalette(),
      fonts: this.styleGuide.getFontSystem(),
      animations: this.styleGuide.getAnimationPresets(),
      layouts: this.styleGuide.getLayoutTemplates()
    };
    
    return this.applyStyleRules(content, style);
  }
  
  // 2. 품질 점수 시스템
  async scoreQuality(video) {
    const scores = {
      styleConsistency: await this.checkStyleConsistency(video),
      colorHarmony: await this.checkColorHarmony(video),
      fontUniformity: await this.checkFontUsage(video),
      animationSmooth: await this.checkAnimationQuality(video),
      audioSync: await this.checkAudioVideoSync(video)
    };
    
    const overall = this.calculateOverallScore(scores);
    
    if (overall < 0.7) {
      return { status: 'REGENERATE', scores };
    }
    
    if (overall < 0.85) {
      return { status: 'MANUAL_REVIEW', scores };
    }
    
    return { status: 'APPROVED', scores };
  }
  
  // 3. 자동 재생성 시스템
  async regenerateWithConstraints(content, previousAttempts) {
    const constraints = {
      mustMatch: {
        colorPalette: this.extractColors(previousAttempts[0]),
        fontFamily: this.extractFonts(previousAttempts[0]),
        animationStyle: this.extractAnimationStyle(previousAttempts[0])
      },
      avoidPatterns: this.identifyProblems(previousAttempts),
      seed: this.generateConsistentSeed()
    };
    
    return this.generateWithConstraints(content, constraints);
  }
  
  // 4. Human-in-the-loop
  async requestHumanReview(video, issues) {
    const reviewTask = {
      video,
      issues,
      suggestedFixes: this.suggestFixes(issues),
      priority: this.calculatePriority(issues)
    };
    
    await this.notifyReviewers(reviewTask);
    return this.waitForApproval(reviewTask);
  }
}

// 스타일 가이드 정의
const styleGuide = {
  brand: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    accent: '#F5A623'
  },
  typography: {
    heading: { font: 'Pretendard', weight: 700, size: 32 },
    body: { font: 'Pretendard', weight: 400, size: 16 },
    code: { font: 'JetBrains Mono', weight: 500, size: 14 }
  },
  animations: {
    transition: 'ease-in-out',
    duration: 300,
    effects: ['fade', 'slide', 'scale']
  }
};
```

---

## 🏗️ 시스템 아키텍처 (운영 관점 강화)

### 핵심 아키텍처 원칙
```yaml
1. Cost-First Design:
   - 모든 API 호출 비용 추적
   - 자동 폴백 메커니즘
   - 적극적 캐싱

2. Fail-Safe Operations:
   - 모든 단계 재시도 가능
   - 부분 실패 처리
   - 우아한 성능 저하

3. Observable System:
   - 모든 동작 로깅
   - 실시간 메트릭
   - 예측적 알림
```

### 상세 아키텍처
```
┌─────────────────────────────────────────────────────────┐
│                   Cost Monitor Layer                      │
│  실시간 비용 추적 | 한도 관리 | 자동 차단              │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                      │
│  한국어 UI | 모바일 반응형 | PWA | 오프라인 큐        │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                   API Gateway                             │
│  Rate Limiting | 비용 체크 | 보안 필터 | 캐시         │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                 Quality Control Layer                     │
│  스타일 체커 | 일관성 검증 | 자동 재생성 | 리뷰 큐    │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                   Core Services                           │
├──────────────┬──────────────┬──────────────┬────────────┤
│   Korean     │    Script    │  Animation   │   Audio    │
│  Processor   │  Generator   │    Engine    │  Service   │
│              │              │              │            │
│ • 조사처리   │ • GPT-4/3.5  │ • Canvas     │ • TTS      │
│ • 폰트렌더   │ • Fallback   │ • WebGL      │ • Mixing   │
│ • 용어사전   │ • Caching    │ • Consistent │ • Sync      │
└──────────────┴──────────────┴──────────────┴────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                   Storage & Cache                         │
│  S3 Lifecycle | Redis Cache | CDN | Temp Cleanup        │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                 Monitoring & Analytics                    │
│  Cost Tracking | Error Rates | User Behavior | Alerts   │
└─────────────────────────────────────────────────────────┘
```

---

## 📅 Phase 1: MVP Core + 리스크 대응 (Week 1-4)

### Week 1: Foundation + Critical Systems
```yaml
Day 1-2: 프로젝트 설정 + 비용 통제
  Task 1.1: Repository & 개발 환경
    - Monorepo 설정 (Turborepo)
    - Docker Compose
    - 환경 변수 관리
    
  Task 1.2: 비용 통제 시스템 (CRITICAL)
    ✅ AWS 비용 모니터링 설정
    ✅ 일일/시간별 한도 설정
    ✅ 자동 차단 시스템
    ✅ 비용 대시보드 구축
    Test: 한도 초과 시 자동 차단 확인

Day 3-4: 한국어 처리 + 보안
  Task 1.3: 한국어 처리 모듈 (CRITICAL)
    ✅ 한글 폰트 시스템 구축
    ✅ 조사 자동 처리 엔진
    ✅ 기술 용어 사전 (1000+ 용어)
    ✅ 자막 최적화 시스템
    Test: 샘플 텍스트 렌더링
    
  Task 1.4: 보안 기초 설정
    - Input sanitization
    - Rate limiting (IP당)
    - SQL injection 방지
    - XSS 방지
    - 프롬프트 인젝션 필터
    Test: 보안 스캔 통과

Day 5: 데이터베이스 + 에셋
  Task 1.5: 데이터베이스 설계
    - Users (with spending limits)
    - Projects (with cost tracking)
    - Videos (with quality scores)
    - Costs (detailed breakdown)
    
  Task 1.6: 에셋 시스템
    - 인포그래픽 라이브러리 설치
    - 사운드 에셋 다운로드
    - 캐싱 시스템 구축
    Test: 에셋 로딩 성능
```

### Week 2: AI Pipeline + 품질 관리
```yaml
Day 6-8: AI 통합 + 품질 시스템
  Task 2.1: GPT Integration with Fallback
    ✅ GPT-4 → GPT-3.5 자동 폴백
    ✅ 토큰 사용량 추적
    ✅ 응답 캐싱 (90% 중복 제거)
    ✅ 프롬프트 최적화
    Test: 비용 vs 품질 밸런스
    
  Task 2.2: 품질 일관성 시스템 (CRITICAL)
    ✅ 스타일 가이드 엔진
    ✅ 품질 점수 시스템 (0-100)
    ✅ 자동 재생성 로직 (점수 < 70)
    ✅ Human review 인터페이스
    Test: 10개 생성 → 일관성 체크

Day 9-10: Animation Engine
  Task 2.3: Canvas 렌더링 with 일관성
    ✅ 스타일 템플릿 시스템
    ✅ 색상 팔레트 강제 적용
    ✅ 폰트 일관성 체크
    ✅ 한글 텍스트 렌더링
    Test: 동일 주제 → 일관된 스타일
```

### Week 3: 통합 + 모니터링
```yaml
Day 11-13: TTS + 사운드
  Task 3.1: Audio Pipeline
    - ElevenLabs 한국어 TTS
    - 비용 효율적 음성 선택
    - 효과음 자동 삽입
    - 볼륨 레벨 정규화
    Test: 한국어 자연스러움
    
  Task 3.2: Video Rendering
    ✅ 품질별 렌더링 (720p/1080p/4K)
    ✅ 진행상황 추적
    ✅ 실패 시 재시도 (3회)
    ✅ 임시 파일 자동 삭제
    Test: 메모리 누수 체크

Day 14-15: 모니터링 시스템
  Task 3.3: Observability
    ✅ DataDog/Sentry 통합
    ✅ 실시간 비용 대시보드
    ✅ 에러율 추적
    ✅ 사용자 행동 분석
    Test: 알림 시스템 동작
```

### Week 4: MVP 검증 + 안정화
```yaml
Day 16-18: 통합 테스트
  Task 4.1: End-to-End Flow
    ✅ 한국어 주제 → 완성 영상
    ✅ 비용 한도 내 동작
    ✅ 품질 점수 > 80
    ✅ 5분 내 생성 완료
    Test: 50개 연속 생성
    
  Task 4.2: 스트레스 테스트
    - 동시 10명 사용
    - 일일 100개 생성
    - 비용 $50 이내 유지
    Test: 시스템 안정성

Day 19-20: Beta 준비
  Task 4.3: Beta Launch Prep
    - 10명 베타 테스터 모집
    - 피드백 수집 시스템
    - 긴급 패치 프로세스
    - 운영 매뉴얼 작성
```

---

## 💰 비용 구조 상세

### 예상 운영 비용 (월간)
```yaml
고정 비용:
  - AWS 인프라: $500
    - EC2 (t3.large × 2): $120
    - RDS (db.t3.small): $50
    - S3 + CloudFront: $200
    - 기타 서비스: $130
    
변동 비용 (1000 사용자 기준):
  - GPT-4 API: $2,000
    - 평균 요청: 10,000/일
    - 캐싱으로 50% 절감
  - ElevenLabs TTS: $500
    - 한국어 음성 생성
    - 분당 5,000 문자
  - GPU 렌더링: $1,000
    - g4dn.xlarge 스팟 인스턴스
    
총 예상 비용: $4,000/월
사용자당 비용: $4
```

### 가격 정책 (비용 기반)
```yaml
Free Tier:
  - 월 3개 영상
  - 720p 품질
  - 워터마크 포함
  - 예상 비용: $1/사용자
  
Pro ($29/월):
  - 월 50개 영상
  - 1080p 품질
  - 워터마크 제거
  - 예상 비용: $10/사용자
  - 마진: 65%
  
Business ($99/월):
  - 무제한 생성
  - 4K 품질
  - API 접근
  - 예상 비용: $40/사용자
  - 마진: 60%
```

---

## 🔒 보안 & 컴플라이언스

### 보안 체크리스트
```yaml
Application Security:
  ✅ Input validation (모든 사용자 입력)
  ✅ SQL injection 방지 (Prepared statements)
  ✅ XSS 방지 (React 자동 이스케이프)
  ✅ CSRF 토큰
  ✅ Rate limiting (IP/User)
  
AI Security:
  ✅ 프롬프트 인젝션 필터
  ✅ 악의적 콘텐츠 감지
  ✅ PII 정보 필터링
  
Infrastructure:
  ✅ WAF 설정
  ✅ DDoS 방어
  ✅ 암호화 (전송/저장)
  ✅ VPC 격리
  
Compliance:
  ✅ KISA 가이드라인 준수
  ✅ 개인정보보호법 준수
  ✅ 저작권 검증 시스템
```

---

## 📊 성공 지표 & 모니터링

### 핵심 지표 (KPI)
```yaml
비용 효율성:
  - CAC < $20
  - LTV/CAC > 3
  - 마진율 > 60%
  - AWS 비용 < 매출 40%
  
품질 지표:
  - 생성 성공률 > 95%
  - 품질 점수 > 80
  - 일관성 점수 > 85
  - 한국어 자연스러움 > 90
  
사용자 지표:
  - 30일 리텐션 > 40%
  - NPS > 50
  - 유료 전환율 > 15%
  - 일일 활성 사용자 > 100
```

### 실시간 모니터링
```yaml
대시보드 구성:
  1. 비용 모니터:
     - 실시간 AWS 비용
     - API 사용량
     - 비용 예측
     
  2. 품질 모니터:
     - 생성 성공/실패율
     - 평균 품질 점수
     - 재생성 비율
     
  3. 사용자 모니터:
     - 동시 사용자
     - 생성 요청 큐
     - 에러율
     
  4. 시스템 모니터:
     - CPU/메모리
     - API 응답시간
     - 스토리지 사용량
```

---

## 🚀 런칭 체크리스트

### Week 4 완료 시 필수 확인
```yaml
비용 통제: ✅
  □ 일일 한도 $100 설정
  □ 자동 차단 동작 확인
  □ 비용 알림 테스트
  
한국어 품질: ✅
  □ 조사 처리 정확도 > 95%
  □ 폰트 렌더링 깨짐 없음
  □ 자막 가독성 확인
  
품질 일관성: ✅
  □ 10개 연속 생성 일관성
  □ 스타일 가이드 적용 확인
  □ 품질 점수 > 80
  
보안: ✅
  □ OWASP Top 10 체크
  □ 부하 테스트 완료
  □ 백업 시스템 동작
  
운영 준비: ✅
  □ 모니터링 대시보드 완성
  □ 알림 시스템 테스트
  □ 운영 매뉴얼 작성
  □ 핫픽스 프로세스 준비
```

---

## 💡 핵심 성공 요인

### DO's ✅
1. **비용 먼저**: 모든 기능 구현 전 비용 계산
2. **한국어 최적화**: 글로벌보다 한국 시장 우선
3. **품질 over 속도**: 빠른 것보다 일관된 품질
4. **모니터링 필수**: 측정 없이 개선 없음
5. **점진적 확장**: MVP → 안정화 → 확장

### DON'Ts ❌
1. **비용 통제 없이 런칭 금지**
2. **한국어 테스트 없이 배포 금지**
3. **품질 검증 없이 자동화 금지**
4. **모니터링 없이 스케일 금지**
5. **운영 계획 없이 마케팅 금지**

---

## 🎯 결론

이 PRD는 **"운영 가능한 MVP"**를 목표로 합니다.

> "완벽한 제품보다 **망하지 않는 제품**이 우선이다"

핵심 3가지만 기억:
1. 💸 **비용 통제 실패 = 즉시 폐업**
2. 🇰🇷 **한국어 실패 = 시장 진입 실패**
3. 🎨 **품질 실패 = 신뢰 상실**

이 3가지를 Week 1부터 해결하면 성공, 
하나라도 놓치면 실패입니다.