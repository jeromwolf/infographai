# InfoGraphAI PRD v4.0 - 자막 중심 전략
**비용 60% 절감 + 개발 속도 30% 향상 버전**

---

## 🎯 핵심 전략 변경

### 💡 핵심 인사이트: "IT 교육 영상의 85%는 음소거로 시청된다"

```yaml
기존 전략 (v3): 음성 + 자막 (비용 높음, 복잡함)
  ↓
신규 전략 (v4): 자막 중심 + 선택적 음성 (비용 60% 절감)
```

### 🚀 전략적 이점
1. **월 운영비 60% 절감**: $2,500 → $1,000
2. **개발 기간 1주 단축**: 4주 → 3주
3. **품질 일관성 향상**: AI 음성 문제 회피
4. **사용자 니즈 부합**: 85%가 자막 선호

---

## 📌 제품 재정의

### 제품명
**InfoGraphAI** - 자막 중심 AI 기반 IT 교육 인포그래픽 영상 생성 플랫폼

### 핵심 가치 (Updated)
- **시간 절약**: 1주일 → 15분 (99% 단축) ⚡
- **비용 절감**: $2,000 → $39 (98% 절감) 💰
- **품질 보장**: 자막 + 비주얼 중심 일관성 🎨
- **한국 특화**: 완벽한 한글 자막 최적화 🇰🇷

### 차별화 포인트
> "음성 없이도 완벽하게 이해되는 영상"
- 시각적 스토리텔링 극대화
- 자막 애니메이션으로 집중도 향상
- 코드와 다이어그램 중심 설명

---

## 💰 비용 구조 (대폭 개선!)

### 🔥 비용 절감 효과
```yaml
기존 (음성 포함):
  - GPT-4 API: $2,000/월
  - TTS (ElevenLabs): $500/월  ❌ 제거
  - Audio Processing: $200/월   ❌ 제거
  - Storage (with audio): $300/월
  - GPU Rendering: $1,000/월
  총계: $4,000/월

신규 (자막 중심):
  - GPT-4 API: $1,000/월 (스크립트 간소화)
  - TTS: $0 ✅
  - Audio Processing: $0 ✅
  - BGM License: $50/월 (옵션)
  - Storage: $200/월 (20% 절감)
  - GPU Rendering: $700/월 (30% 단순화)
  총계: $1,950/월

절감액: $2,050/월 (51% 절감!)
```

### 사용자당 비용 (극적 개선)
```yaml
기존: $4/사용자 → 신규: $1.95/사용자

Free Tier (월 5개): 
  비용: $0.50/사용자
  수익: $0 (마케팅 투자)

Starter ($19/월):  💡 가격 인하!
  월 30개 영상
  비용: $5/사용자
  마진: 74%

Pro ($39/월):      💡 가격 인하!
  월 100개 영상
  비용: $15/사용자
  마진: 62%

Business ($99/월):
  무제한 + API
  비용: $40/사용자
  마진: 60%
```

---

## 🎬 자막 최적화 시스템 (핵심 기술)

### 자막 엔진 아키텍처
```javascript
class SubtitleEngine {
  constructor() {
    this.optimizer = new TextOptimizer();
    this.animator = new SubtitleAnimator();
    this.synchronizer = new VisualSynchronizer();
  }

  // 1. 스마트 자막 분할
  splitSubtitles(script) {
    const rules = {
      maxCharsPerLine: 35,      // 한 줄 최대
      maxLines: 2,               // 최대 2줄
      minDuration: 1.5,          // 최소 표시 시간
      maxDuration: 4,            // 최대 표시 시간
      readingSpeed: 250          // 분당 글자 수
    };
    
    return this.optimizer.split(script, rules);
  }

  // 2. 자막 스타일링 시스템
  getSubtitleStyles() {
    return {
      default: {
        font: 'Pretendard Variable',
        size: { mobile: 18, tablet: 22, desktop: 26 },
        weight: 500,
        color: '#FFFFFF',
        stroke: '2px #000000',
        background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.6))',
        padding: '12px 20px',
        borderRadius: '8px',
        position: { x: 'center', y: '85%' }
      },
      emphasis: {
        color: '#FFE500',
        weight: 700,
        scale: 1.15,
        animation: 'pulse'
      },
      code: {
        font: 'JetBrains Mono',
        background: '#1E1E1E',
        color: '#D4D4D4',
        padding: '8px',
        borderRadius: '4px'
      }
    };
  }

  // 3. 자막 애니메이션
  animateSubtitle(text, type = 'default') {
    const animations = {
      fadeIn: { opacity: [0, 1], duration: 300 },
      slideUp: { y: [20, 0], opacity: [0, 1], duration: 400 },
      typewriter: { width: ['0%', '100%'], duration: text.length * 50 },
      highlight: { 
        background: ['transparent', '#FFE50030', 'transparent'],
        duration: 1000 
      }
    };
    
    return animations[type] || animations.fadeIn;
  }

  // 4. 키워드 강조 시스템
  highlightKeywords(subtitle, keywords) {
    keywords.forEach(keyword => {
      subtitle = subtitle.replace(
        new RegExp(keyword, 'gi'),
        `<span class="keyword">${keyword}</span>`
      );
    });
    return subtitle;
  }

  // 5. 한국어 특화 처리
  processKorean(text) {
    // 조사 자연스러운 줄바꿈
    const particles = ['은', '는', '이', '가', '을', '를', '의', '에', '에서'];
    
    // 조사 앞에서 줄바꿈 방지
    particles.forEach(particle => {
      text = text.replace(new RegExp(`\\s+(${particle})`, 'g'), `\u00A0$1`);
    });
    
    return text;
  }
}
```

### 시각적 스토리텔링 강화
```javascript
class VisualStorytelling {
  // 자막과 완벽 동기화된 비주얼
  synchronizeWithSubtitles(subtitle, visuals) {
    return {
      // 자막 내용에 따른 자동 비주얼 매칭
      iconAnimation: this.matchIcons(subtitle.keywords),
      diagramHighlight: this.highlightRelevantParts(subtitle.topic),
      codeDisplay: this.showCodeWhenMentioned(subtitle.code),
      transitionEffect: this.selectTransition(subtitle.emotion)
    };
  }
  
  // 자막 없이도 이해 가능한 비주얼 플로우
  createVisualNarrative(script) {
    return {
      opening: this.createTitleCard(),
      sections: script.sections.map(section => ({
        overview: this.createSectionOverview(section),
        details: this.createDetailedDiagrams(section),
        examples: this.createCodeExamples(section),
        summary: this.createSectionSummary(section)
      })),
      closing: this.createRecap()
    };
  }
}
```

---

## 🏗️ 간소화된 시스템 아키텍처

### 음성 제거로 심플해진 구조
```
┌─────────────────────────────────────────────────────────┐
│                   Cost Monitor (여전히 중요!)             │
│     실시간 비용 추적 | 한도 관리 | 자동 차단           │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                      │
│   자막 편집기 | 타이밍 조절 | 스타일 커스터마이징      │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│              Simplified API Gateway                       │
│    Rate Limiting | 캐싱 | 보안 (복잡도 30% 감소)       │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                 Core Services (간소화)                    │
├──────────────┬──────────────┬──────────────┬────────────┤
│   Korean     │   Script     │  Animation   │   BGM      │
│  Subtitle    │  Generator   │   Engine     │  Service   │
│              │              │              │            │
│ • 자막 최적화 │ • GPT-4/3.5  │ • Canvas     │ • 저작권   │
│ • 타이밍     │ • 간소화     │ • 자막 동기  │   프리     │
│ • 스타일링   │ • 캐싱 강화  │ • 심플 효과  │ • 옵션     │
└──────────────┴──────────────┴──────────────┴────────────┘
                              ↓
❌ TTS Service (제거)
❌ Audio Mixing (제거)  
❌ Voice Sync (제거)
                              ↓
┌─────────────────────────────────────────────────────────┐
│              Storage & Delivery (20% 절감)                │
│      S3 (작은 파일) | CDN | 빠른 스트리밍              │
└─────────────────────────────────────────────────────────┘
```

---

## 📅 단축된 개발 일정 (3주 MVP!)

### Week 1: Core Foundation (5 days)
```yaml
Day 1-2: 프로젝트 설정 + 비용 통제
  ✅ Repository 설정
  ✅ 비용 모니터링 (여전히 중요!)
  ✅ 한도 설정 ($50/일로 하향)
  
Day 3: 한국어 자막 시스템
  ✅ 자막 분할 엔진
  ✅ 한글 폰트 시스템
  ✅ 조사 처리 (줄바꿈 최적화)
  
Day 4-5: 데이터베이스 + 에셋
  ✅ 간소화된 스키마 (audio 필드 제거)
  ✅ 비주얼 에셋 다운로드
  ✅ BGM 라이브러리 (5개)
```

### Week 2: AI + Animation (5 days)
```yaml  
Day 6-7: GPT Integration (간소화)
  ✅ 스크립트 생성 (자막 최적화)
  ✅ 타이밍 정보 생성
  ✅ 키워드 추출
  
Day 8-9: Animation Engine
  ✅ 자막-비주얼 동기화
  ✅ 인포그래픽 애니메이션
  ✅ 트랜지션 효과
  
Day 10: 품질 시스템
  ✅ 자막 가독성 체크
  ✅ 타이밍 검증
  ✅ 스타일 일관성
```

### Week 3: Integration + Launch (5 days)
```yaml
Day 11-12: Video Rendering
  ✅ Canvas to Video (심플)
  ✅ BGM 삽입 (옵션)
  ✅ 자막 번인 vs 별도 트랙
  
Day 13: Frontend MVP
  ✅ 주제 입력
  ✅ 자막 미리보기
  ✅ 다운로드
  
Day 14-15: Testing & Launch
  ✅ 10개 샘플 생성
  ✅ 베타 테스터 피드백
  ✅ 핫픽스 & 런칭
```

---

## 🎯 Phase 전략 (점진적 확장)

### Phase 1: 자막 MVP (Week 1-3) ✅
```yaml
핵심 기능:
  - 자막 자동 생성
  - 인포그래픽 애니메이션
  - BGM (5개 선택)
  - 720p/1080p 출력

목표:
  - 100명 베타 사용자
  - 생성 시간 < 3분
  - 비용 < $1/영상
  - 품질 점수 > 85
```

### Phase 2: 품질 향상 (Month 2)
```yaml
추가 기능:
  - 자막 스타일 커스터마이징
  - 다양한 애니메이션 템플릿
  - 4K 지원
  - 자막 다국어 (영어/일본어)
  
선택적 음성 (프리미엄):
  - 사용자 요청 시에만
  - +$5/영상 추가 과금
  - 고품질 한국어 TTS
```

### Phase 3: 확장 (Month 3)
```yaml
엔터프라이즈:
  - API 제공
  - 브랜드 커스터마이징
  - 대량 생성
  - 커스텀 음성 (옵션)
  
수익 다각화:
  - 자막 템플릿 마켓
  - BGM 프리미엄 라이브러리
  - 음성 추가 서비스
```

---

## 💡 자막 중심 UX 설계

### 사용자 워크플로우 (극도로 단순화)
```yaml
1. 주제 입력 (10초)
   "React Hooks 설명해줘"
   
2. 옵션 선택 (10초)
   - 길이: 1분 / 3분 / 5분
   - 스타일: 모던 / 클래식 / 미니멀
   - BGM: 있음 / 없음
   
3. 생성 (2분)
   - 실시간 미리보기
   - 자막 타이밍 확인
   
4. 편집 (옵션, 30초)
   - 자막 수정
   - 타이밍 조정
   
5. 다운로드
   - MP4 (자막 번인)
   - MP4 + SRT (분리)
```

### 자막 편집 인터페이스
```javascript
// 직관적인 자막 편집기
const SubtitleEditor = {
  features: [
    '드래그로 타이밍 조정',
    '실시간 미리보기',
    '단축키 지원',
    '자동 맞춤법 검사',
    '키워드 하이라이트'
  ],
  
  shortcuts: {
    'Space': '재생/정지',
    'Enter': '다음 자막',
    'Shift+Enter': '이전 자막',
    'Ctrl+S': '저장'
  }
};
```

---

## 📊 개선된 수익 모델

### 낮아진 가격으로 더 많은 사용자
```yaml
기존 가격 → 신규 가격:

Free: 3개/월 → 5개/월 (더 관대!)
Pro: $29 → $19 (34% 인하!)
Business: $99 → $39 (61% 인하!)
Enterprise: $299 → $99 (67% 인하!)

예상 효과:
- 가입 전환율: 15% → 35%
- 월 사용자: 1,000명 → 5,000명
- 월 매출: $29,000 → $45,000 (증가!)
```

### 추가 수익원
```yaml
옵션 서비스:
  - 음성 추가: +$5/영상
  - 4K 렌더링: +$2/영상
  - 우선 처리: +$3/영상
  - 커스텀 BGM: +$10/영상
  
템플릿 마켓:
  - 프리미엄 템플릿: $5-20
  - 수익 공유: 70% 제작자
  
API 사용:
  - $0.50/영상 생성
  - 대량 할인 적용
```

---

## ✅ 리스크 대폭 감소

### 해결된 문제들
```yaml
음성 관련 리스크 (모두 해결):
  ❌ TTS 비용 폭발 → ✅ TTS 없음
  ❌ 어색한 AI 음성 → ✅ 자막으로 해결  
  ❌ 한국어 억양 문제 → ✅ 문제 없음
  ❌ 음성 싱크 복잡도 → ✅ 불필요
  
남은 리스크 (관리 가능):
  ⚠️ GPT-4 비용 → 캐싱 + 3.5 폴백
  ⚠️ 자막 품질 → 에디터 제공
  ⚠️ 스토리지 → 작은 파일 크기
```

### 경쟁 우위 강화
```yaml
차별화 포인트:
  1. 가장 저렴한 가격 (경쟁사 대비 70% 저렴)
  2. 가장 빠른 생성 (3분 이내)
  3. 한국어 최적화 (조사, 폰트, 문화)
  4. 자막 중심 (85% 사용자 니즈 부합)
```

---

## 🚀 성공 지표 (현실적 목표)

### MVP Success Metrics (Week 3)
```yaml
필수 달성:
  ✅ 생성 성공률 > 95%
  ✅ 생성 시간 < 3분
  ✅ 비용 < $1/영상
  ✅ 100명 베타 사용자
  ✅ NPS > 60
  
기술 지표:
  ✅ 자막 정확도 > 98%
  ✅ 타이밍 정확도 > 95%
  ✅ 한글 렌더링 100% 정상
  ✅ 모바일 재생 원활
```

### 3개월 목표
```yaml
사용자:
  - MAU: 5,000명
  - 유료 전환: 35% (1,750명)
  - 일일 생성: 500개
  
수익:
  - MRR: $45,000
  - 영상당 비용: $0.50
  - 마진율: 74%
  
품질:
  - 생성 시간: 평균 2분
  - 재생성률: < 5%
  - 고객 만족도: > 85%
```

---

## 🎯 핵심 성공 전략

### 3가지 핵심 원칙
```yaml
1. Simple is Best:
   - 음성 없이 시작
   - 자막에 집중
   - 복잡도 최소화

2. Cost Efficiency:
   - TTS 비용 제로
   - 스토리지 최소화
   - 캐싱 극대화

3. User First:
   - 3분 내 생성
   - $19부터 시작
   - 모바일 최적화
```

### Do's and Don'ts
```yaml
DO's ✅:
  - 자막 품질에 집중
  - 비주얼 스토리텔링 강화
  - 한국어 최적화 우선
  - 가격 경쟁력 유지
  - 빠른 출시와 iteration

DON'Ts ❌:
  - 음성에 집착 금지
  - 완벽주의 금지
  - 과도한 기능 금지
  - 복잡한 UX 금지
  - 높은 가격 금지
```

---

## 💬 결론

### InfoGraphAI v4의 핵심
> **"자막과 비주얼로 완성되는 IT 교육 영상"**

**왜 성공할 수 밖에 없는가?**
1. **비용**: 월 $19로 무제한에 가까운 생성
2. **속도**: 3분 만에 완성
3. **품질**: 일관된 자막과 비주얼
4. **시장**: 85%가 원하는 자막 중심

**3주 후 목표**:
- ✅ MVP 런칭
- ✅ 100명 베타 사용자
- ✅ 50개 유료 전환
- ✅ 월 $1,000 매출 시작

> "음성이 없어서 더 좋다. 더 싸고, 더 빠르고, 더 실용적이다."

이것이 InfoGraphAI v4입니다.