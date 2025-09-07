# 아이콘 소스 가이드

InfoGraphAI에서 사용할 아이콘들의 소스와 다운로드 가이드입니다.

## 🎯 추천 아이콘 소스

### 1. Heroicons
- **URL**: https://heroicons.com/
- **라이센스**: MIT License (무료, 상업적 사용 가능)
- **특징**: Tailwind 제작진이 만든 깔끔한 아이콘 세트
- **포맷**: SVG
- **추천 사용**: UI 네비게이션, 액션 버튼

### 2. Lucide Icons  
- **URL**: https://lucide.dev/
- **라이센스**: ISC License (완전 무료)
- **특징**: 일관성 있는 디자인, 다양한 스타일
- **포맷**: SVG, React/Vue 컴포넌트
- **추천 사용**: 일반적인 UI 아이콘

### 3. Feather Icons
- **URL**: https://feathericons.com/
- **라이센스**: MIT License  
- **특징**: 미니멀한 24x24 아이콘
- **포맷**: SVG
- **추천 사용**: 깔끔한 인터페이스

### 4. Phosphor Icons
- **URL**: https://phosphoricons.com/
- **라이센스**: MIT License
- **특징**: 6가지 스타일 (Thin, Light, Regular, Bold, Fill, Duotone)
- **포맷**: SVG, 웹폰트
- **추천 사용**: 다양한 스타일이 필요한 경우

### 5. Simple Icons (브랜드)
- **URL**: https://simpleicons.org/
- **라이센스**: CC0 1.0 (퍼블릭 도메인)
- **특징**: 2400+ 브랜드 아이콘
- **포맷**: SVG
- **추천 사용**: 기술 스택, 소셜 미디어 아이콘

## 📱 카테고리별 필수 아이콘

### UI/UX 아이콘
```
Navigation:
- menu (hamburger)
- close (x)
- arrow-left, arrow-right
- chevron-down, chevron-up
- home

Actions:
- play, pause, stop
- edit (pencil)
- delete (trash)
- save (disk)
- download, upload
- copy, share
- search (magnifying-glass)

Status:
- check (checkmark)
- x-mark (error)
- exclamation-triangle (warning)
- information-circle (info)
- loading (spinner)
```

### 교육 관련 아이콘
```
Learning:
- book-open
- academic-cap
- light-bulb
- puzzle-piece
- chart-bar
- presentation-chart-line

Interaction:
- hand-raised
- chat-bubble
- video-camera
- microphone
- speaker-wave
```

### 기술 관련 아이콘  
```
Development:
- code-bracket
- command-line
- cpu-chip
- server
- database
- cloud

Tools:
- wrench
- cog (settings)
- bug
- beaker (testing)
- rocket (deployment)
```

### 비즈니스 아이콘
```
Analytics:
- chart-pie
- chart-bar
- trending-up
- calculator
- banknotes
- briefcase

Communication:
- envelope (email)
- phone
- users (team)
- building-office
```

## 🎨 브랜드/기술 아이콘

### 프로그래밍 언어
- JavaScript, TypeScript
- Python, Java, C++
- React, Vue, Angular
- Node.js, Express

### 개발 도구
- VS Code, Git, GitHub
- Docker, Kubernetes  
- AWS, Google Cloud, Azure
- Figma, Slack

### 데이터베이스
- PostgreSQL, MongoDB
- Redis, MySQL
- Prisma, Supabase

## 📥 다운로드 가이드

### 1. 개별 다운로드
```bash
# Heroicons 예시
curl -o assets/icons/ui/menu.svg "https://heroicons.com/24/outline/bars-3.svg"
curl -o assets/icons/ui/close.svg "https://heroicons.com/24/outline/x-mark.svg"
```

### 2. 패키지 설치 (개발용)
```bash
# npm으로 설치
npm install @heroicons/react lucide-react
npm install simple-icons
```

### 3. 일괄 다운로드 스크립트
```bash
# 스크립트 작성 예시
#!/bin/bash
mkdir -p assets/icons/{ui,tech,education,business}

# UI 아이콘들
icons_ui=(
  "menu:bars-3"
  "close:x-mark" 
  "edit:pencil"
  "delete:trash"
  "save:bookmark"
)

for icon in "${icons_ui[@]}"; do
  name="${icon%%:*}"
  hero_name="${icon##*:}"
  curl -o "assets/icons/ui/${name}.svg" \
    "https://heroicons.com/24/outline/${hero_name}.svg"
done
```

## 🎯 아이콘 최적화

### SVG 최적화
- **도구**: SVGO (npm install -g svgo)
- **명령어**: `svgo assets/icons/ui/*.svg`
- **효과**: 파일 크기 30-70% 감소

### 일관성 유지
- **크기**: 24x24px 기본
- **스트로크**: 1.5px 통일
- **컬러**: currentColor 사용 (CSS로 제어)
- **네이밍**: kebab-case 통일

## 📋 다운로드 체크리스트

### Phase 1: 기본 UI (필수)
- [ ] 네비게이션 아이콘 (5개)
- [ ] 액션 아이콘 (10개)  
- [ ] 상태 아이콘 (5개)

### Phase 2: 도메인 특화
- [ ] 교육 아이콘 (8개)
- [ ] 기술 아이콘 (10개)
- [ ] 비즈니스 아이콘 (8개)

### Phase 3: 브랜드 아이콘
- [ ] 프로그래밍 언어 (10개)
- [ ] 개발 도구 (15개)
- [ ] 클라우드/인프라 (8개)

## 🔧 사용 가이드

### React/Next.js에서 사용
```jsx
import { PlayIcon } from '@heroicons/react/24/outline'

function VideoControls() {
  return (
    <button>
      <PlayIcon className="w-6 h-6" />
      재생
    </button>
  )
}
```

### CSS에서 사용
```css
.icon {
  width: 24px;
  height: 24px;
  color: currentColor;
}

.icon-primary {
  color: #3b82f6;
}
```

이 가이드를 따라 일관성 있고 고품질의 아이콘 세트를 구축할 수 있습니다.