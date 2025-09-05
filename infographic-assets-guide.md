# InfoGraphAI 인포그래픽 에셋 가이드

## 🎨 인포그래픽 에셋 소싱 전략

### 1. 무료 아이콘/일러스트 라이브러리

#### 🌟 **최우선 추천 (IT 기술 특화)**

##### **1. Devicon**
- **URL**: https://devicon.dev/
- **특징**: 프로그래밍 언어, 프레임워크 로고 특화
- **포맷**: SVG, Font
- **라이센스**: MIT
- **다운로드 방법**:
```bash
# NPM으로 설치
npm install devicon

# 또는 CDN 직접 사용
https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css
```
- **포함 아이콘**: React, Vue, Node.js, Python, Docker, K8s 등 200+

##### **2. Simple Icons**
- **URL**: https://simpleicons.org/
- **특징**: 브랜드/기술 로고 2,400개+
- **포맷**: SVG
- **라이센스**: CC0 (저작권 없음)
- **다운로드 방법**:
```bash
npm install simple-icons
# 또는 개별 다운로드
```
- **장점**: 깔끔한 단색 디자인, 일관된 스타일

##### **3. Tabler Icons**
- **URL**: https://tabler-icons.io/
- **특징**: 3,400+ 무료 SVG 아이콘
- **포맷**: SVG, React/Vue 컴포넌트
- **라이센스**: MIT
- **다운로드 방법**:
```bash
npm install @tabler/icons
# React: @tabler/icons-react
# Vue: @tabler/icons-vue
```
- **장점**: 일관된 stroke 스타일, 커스터마이징 용이

#### 🎯 **일반 용도 아이콘 세트**

##### **4. Heroicons**
- **URL**: https://heroicons.com/
- **제작사**: Tailwind CSS 팀
- **특징**: 292개 정교한 아이콘, Outline/Solid 스타일
- **라이센스**: MIT
```bash
npm install @heroicons/react
```

##### **5. Feather Icons**
- **URL**: https://feathericons.com/
- **특징**: 287개 미니멀 아이콘
- **포맷**: SVG, React/Vue
- **라이센스**: MIT
```bash
npm install feather-icons
```

##### **6. Phosphor Icons**
- **URL**: https://phosphoricons.com/
- **특징**: 6,000+ 아이콘, 6가지 스타일
- **라이센스**: MIT
```bash
npm install phosphor-icons
```

---

### 2. 인포그래픽 템플릿/요소

#### 📊 **다이어그램 & 차트**

##### **1. unDraw**
- **URL**: https://undraw.co/illustrations
- **특징**: 커스터마이징 가능한 일러스트
- **포맷**: SVG, PNG
- **라이센스**: 완전 무료
- **용도**: 컨셉 설명, 빈 화면 일러스트
- **색상**: 실시간 색상 변경 가능

##### **2. DrawKit**
- **URL**: https://drawkit.com/
- **특징**: 일러스트 + 아이콘 세트
- **무료 범위**: 100+ 일러스트
- **포맷**: SVG, PNG
- **용도**: 프로세스 설명, 사람 일러스트

##### **3. Storyset**
- **URL**: https://storyset.com/
- **제작사**: Freepik
- **특징**: 애니메이션 가능한 일러스트
- **커스터마이징**: 색상, 스타일 변경
- **라이센스**: 출처 표기 필요

#### 🎭 **애니메이션 에셋**

##### **1. LottieFiles**
- **URL**: https://lottiefiles.com/featured
- **특징**: JSON 기반 애니메이션
- **무료 에셋**: 수천 개
- **사용법**:
```javascript
// Lottie 애니메이션 사용
import Lottie from 'lottie-react';
import animationData from './animation.json';

<Lottie animationData={animationData} />
```

##### **2. Rive**
- **URL**: https://rive.app/community/
- **특징**: 인터랙티브 애니메이션
- **포맷**: .riv 파일
- **무료 에셋**: 커뮤니티 제작

---

### 3. 사운드 & 음향효과 에셋

#### 🎵 **무료 사운드 라이브러리**

##### **1. Freesound.org**
- **URL**: https://freesound.org/
- **특징**: 50만개+ 사운드, 커뮤니티 제작
- **라이센스**: CC0, CC-BY 등 다양
- **카테고리**: 
  - UI 사운드 (클릭, 호버, 알림)
  - 트랜지션 효과음 (swoosh, whoosh)
  - 배경 앰비언트
- **다운로드**: 무료 계정 필요

##### **2. Zapsplat**
- **URL**: https://www.zapsplat.com/
- **특징**: 10만개+ 고품질 사운드
- **라이센스**: 무료 (계정 필요)
- **IT 관련 사운드**:
  - 키보드 타이핑
  - 마우스 클릭
  - 서버룸 앰비언트
  - 디지털 비프음

##### **3. Mixkit**
- **URL**: https://mixkit.co/free-sound-effects/
- **특징**: 큐레이션된 고품질 효과음
- **라이센스**: 완전 무료, 출처표기 불필요
- **추천 카테고리**:
  - Tech UI sounds
  - Transitions
  - Notifications

##### **4. YouTube Audio Library**
- **URL**: https://studio.youtube.com/channel/UC/music
- **특징**: YouTube 공식 무료 음원
- **카테고리**:
  - 배경음악 (Genre별)
  - 효과음
- **라이센스**: YouTube 영상용 무료

#### 🎼 **배경음악 (BGM)**

##### **1. Epidemic Sound (무료 체험)**
- **URL**: https://www.epidemicsound.com/
- **특징**: 40,000+ 트랙, 90,000+ 효과음
- **체험**: 30일 무료
- **장르**: Corporate, Technology, Ambient

##### **2. Artlist.io (유료 추천)**
- **URL**: https://artlist.io/
- **특징**: 무제한 다운로드
- **가격**: $199/년
- **장점**: 상업적 사용 무제한

##### **3. Incompetech**
- **URL**: https://incompetech.com/
- **제작자**: Kevin MacLeod
- **라이센스**: CC-BY (출처표기)
- **특징**: 다양한 분위기의 BGM

##### **4. Bensound**
- **URL**: https://www.bensound.com/
- **무료 범위**: 출처표기 시 무료
- **장르**: Corporate, Technology, Cinematic

### 4. 배경 패턴 & 텍스처

#### 🌈 **패턴 생성기**

##### **1. Hero Patterns**
- **URL**: https://heropatterns.com/
- **특징**: SVG 배경 패턴
- **커스터마이징**: 색상, 투명도
- **통합**: Tailwind CSS 친화적

##### **2. SVG Backgrounds**
- **URL**: https://www.svgbackgrounds.com/
- **특징**: 커스터마이징 가능한 배경
- **포맷**: SVG, CSS
- **용도**: 섹션 구분, 배경 장식

##### **3. Haikei**
- **URL**: https://haikei.app/
- **특징**: 웨이브, 블롭, 그라디언트 생성
- **포맷**: SVG, PNG
- **용도**: 모던한 배경 효과

---

### 4. 구현 전략

#### 📦 **에셋 관리 시스템**

```javascript
// assets/config.js
export const ASSET_SOURCES = {
  icons: {
    devicon: {
      path: '/assets/icons/devicon/',
      cdn: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/',
      categories: ['languages', 'frameworks', 'tools']
    },
    simpleicons: {
      path: '/assets/icons/simpleicons/',
      npm: 'simple-icons',
      categories: ['brands', 'services']
    },
    tabler: {
      path: '/assets/icons/tabler/',
      npm: '@tabler/icons',
      categories: ['ui', 'general', 'arrows']
    }
  },
  illustrations: {
    undraw: {
      baseUrl: 'https://undraw.co/api/',
      categories: ['tech', 'business', 'education']
    },
    custom: {
      path: '/assets/illustrations/custom/'
    }
  },
  patterns: {
    hero: {
      generator: 'https://heropatterns.com/',
      saved: '/assets/patterns/'
    }
  }
};
```

#### 🎯 **프로젝트 구조**

```
/assets
├── /icons
│   ├── /tech        # 기술 스택 아이콘
│   ├── /ui          # UI 요소 아이콘
│   └── /custom      # 커스텀 제작
├── /illustrations
│   ├── /concepts    # 개념 설명용
│   ├── /processes   # 프로세스 다이어그램
│   └── /characters  # 캐릭터/아바타
├── /patterns
│   ├── /backgrounds # 배경 패턴
│   └── /textures    # 텍스처
├── /animations
│   ├── /lottie      # Lottie JSON
│   └── /rive        # Rive 파일
└── /templates
    ├── /comparison  # 비교 템플릿
    ├── /process     # 프로세스 템플릿
    └── /architecture # 아키텍처 템플릿
```

#### ⚡ **자동화 다운로드 스크립트**

```javascript
// scripts/download-assets.js
const fs = require('fs');
const https = require('https');
const path = require('path');

const ASSETS_TO_DOWNLOAD = {
  // Devicon 주요 아이콘
  devicon: [
    'react/react-original.svg',
    'nodejs/nodejs-original.svg',
    'docker/docker-original.svg',
    'kubernetes/kubernetes-plain.svg',
    'python/python-original.svg',
    'javascript/javascript-original.svg',
    // ... 더 추가
  ],
  
  // Simple Icons
  simpleicons: [
    'github',
    'gitlab',
    'aws',
    'googlecloud',
    'azure',
    // ... 더 추가
  ]
};

async function downloadAssets() {
  for (const [source, assets] of Object.entries(ASSETS_TO_DOWNLOAD)) {
    for (const asset of assets) {
      // 다운로드 로직
      await downloadFile(getUrl(source, asset), getPath(source, asset));
    }
  }
}

// 실행
downloadAssets();
```

---

### 5. 라이센스 & 법적 고려사항

#### ⚖️ **라이센스 체크리스트**

| 소스 | 라이센스 | 상업적 사용 | 출처 표기 | 수정 가능 |
|------|----------|------------|----------|----------|
| Devicon | MIT | ✅ | ❌ | ✅ |
| Simple Icons | CC0 | ✅ | ❌ | ✅ |
| Tabler Icons | MIT | ✅ | ❌ | ✅ |
| Heroicons | MIT | ✅ | ❌ | ✅ |
| unDraw | Open | ✅ | ❌ | ✅ |
| Freepik | Freemium | ⚠️ | ✅ | ✅ |
| LottieFiles | Various | ⚠️ | ✅ | ⚠️ |

#### 📝 **라이센스 관리**

```javascript
// assets/licenses.json
{
  "dependencies": {
    "devicon": {
      "license": "MIT",
      "attribution": false,
      "commercial": true,
      "modification": true
    },
    "simple-icons": {
      "license": "CC0-1.0",
      "attribution": false,
      "commercial": true,
      "modification": true
    }
  }
}
```

---

### 6. 성능 최적화 전략

#### 🚀 **에셋 최적화**

```javascript
// 1. SVG 최적화 (SVGO)
npm install -g svgo
svgo -f ./assets/icons --recursive

// 2. 스프라이트 시트 생성
npm install svg-sprite

// 3. 런타임 최적화
const loadIcon = async (name) => {
  // Dynamic import
  const icon = await import(`@/assets/icons/${name}.svg`);
  return icon.default;
};

// 4. CDN 전략
const getAssetUrl = (asset) => {
  if (process.env.NODE_ENV === 'production') {
    return `${CDN_URL}/assets/${asset}`;
  }
  return `/assets/${asset}`;
};
```

---

### 7. MVP를 위한 최소 에셋 세트

#### 🎯 **Week 1-4 필수 다운로드**

```yaml
Essential Icons (50개):
  Tech Stack:
    - React, Vue, Angular
    - Node.js, Python, Java
    - Docker, Kubernetes
    - AWS, GCP, Azure
    - Git, GitHub, GitLab
    
  UI Elements:
    - Arrows (8방향)
    - Check, X, Warning
    - Play, Pause, Stop
    - File, Folder, Code
    
  Diagrams:
    - Box, Circle, Diamond
    - Line, Arrow, Connector
    - Database, Server, Cloud

Illustrations (10개):
  - Developer working
  - Server architecture
  - Cloud services
  - Data flow
  - Team collaboration

Backgrounds (5개):
  - Gradient mesh
  - Dot pattern
  - Wave pattern
  - Circuit pattern
  - Abstract shapes
```

---

### 8. 커스텀 에셋 제작 도구

#### 🎨 **무료 제작 도구**

1. **Figma** (무료)
   - 벡터 그래픽 제작
   - SVG 내보내기
   - 컴포넌트 시스템

2. **Inkscape** (오픈소스)
   - 전문 벡터 편집
   - SVG 네이티브

3. **Excalidraw**
   - 손그림 스타일 다이어그램
   - 기술 다이어그램 특화

4. **draw.io**
   - 플로우차트/다이어그램
   - 무료 온라인 툴

---

### 📋 실행 계획

#### Phase 1 (Week 1)
```bash
# 1. 패키지 설치
npm install --save \
  devicon \
  simple-icons \
  @tabler/icons \
  @heroicons/react \
  lottie-react

# 2. 에셋 폴더 구조 생성
mkdir -p assets/{icons,illustrations,patterns,animations}

# 3. 기본 아이콘 다운로드 (스크립트 실행)
node scripts/download-assets.js

# 4. 에셋 관리 컴포넌트 생성
touch components/AssetManager.jsx
```

이 가이드를 따라 단계별로 에셋을 준비하면, InfoGraphAI의 고품질 인포그래픽 생성에 필요한 모든 시각적 요소를 효율적으로 확보할 수 있습니다.