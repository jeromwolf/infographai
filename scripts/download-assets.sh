#!/bin/bash

# InfoGraphAI Asset Download Script
# 필수 자산들을 자동으로 다운로드하는 스크립트

set -e

echo "🎯 InfoGraphAI Asset Download Script"
echo "=================================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 디렉토리 생성
echo -e "${BLUE}📁 디렉토리 구조 생성...${NC}"
mkdir -p assets/{audio/{background-music,sound-effects,ui-sounds},images/{backgrounds,logos,stock-images},templates/{education,business,tech},icons/{ui,technology,education},animations/{lottie,gif},fonts/{korean,english}}

# 기본 플레이스홀더 파일들 생성
echo -e "${BLUE}📄 플레이스홀더 파일 생성...${NC}"

# 오디오 플레이스홀더
cat > assets/audio/background-music/.gitkeep << EOF
# 배경음악 파일들이 위치할 디렉토리
# 실제 MP3/OGG 파일로 교체 필요
EOF

cat > assets/audio/sound-effects/.gitkeep << EOF
# 효과음 파일들이 위치할 디렉토리  
# WAV/MP3 파일로 교체 필요
EOF

cat > assets/audio/ui-sounds/.gitkeep << EOF
# UI 사운드 파일들이 위치할 디렉토리
# 짧은 WAV 파일들로 교체 필요
EOF

# 이미지 플레이스홀더
cat > assets/images/backgrounds/.gitkeep << EOF
# 배경 이미지들이 위치할 디렉토리
# 1920x1080 JPG/PNG 파일로 교체 필요
EOF

cat > assets/images/logos/.gitkeep << EOF
# 로고 및 브랜딩 자산 디렉토리
# SVG/PNG 형태의 로고 파일들
EOF

cat > assets/images/stock-images/.gitkeep << EOF
# 스톡 이미지 디렉토리
# 교육/기술/비즈니스 관련 이미지들
EOF

# 아이콘 플레이스홀더
cat > assets/icons/ui/.gitkeep << EOF
# UI 아이콘들이 위치할 디렉토리
# 24x24 SVG 아이콘들
EOF

cat > assets/icons/technology/.gitkeep << EOF
# 기술 관련 아이콘 디렉토리
# 프로그래밍 언어, 도구 등의 아이콘
EOF

# 애니메이션 플레이스홀더
cat > assets/animations/lottie/.gitkeep << EOF
# Lottie 애니메이션 파일 디렉토리
# JSON 형태의 애니메이션 파일들
EOF

# 폰트 플레이스홀더
cat > assets/fonts/korean/.gitkeep << EOF
# 한국어 폰트 디렉토리
# TTF/OTF/WOFF2 폰트 파일들
EOF

cat > assets/fonts/english/.gitkeep << EOF
# 영어 폰트 디렉토리  
# TTF/OTF/WOFF2 폰트 파일들
EOF

echo -e "${GREEN}✅ 기본 디렉토리 구조 생성 완료${NC}"

# 폰트 다운로드 (Google Fonts)
echo -e "${BLUE}🔤 폰트 다운로드...${NC}"

# Pretendard (한국어 폰트)
if command -v curl &> /dev/null; then
  echo "  Pretendard 폰트 다운로드 중..."
  curl -L -o assets/fonts/korean/Pretendard.zip \
    "https://github.com/orioncactus/pretendard/releases/latest/download/Pretendard-GOV.zip" \
    2>/dev/null || echo "    ⚠️ Pretendard 다운로드 실패 - 수동으로 다운로드해주세요"
fi

# Inter (영어 폰트) - Google Fonts
echo "  Inter 폰트 정보..."
cat > assets/fonts/english/inter-info.txt << EOF
Inter 폰트 다운로드 방법:
1. https://fonts.google.com/specimen/Inter 방문
2. Download family 클릭
3. 압축 해제 후 이 디렉토리에 복사

또는 웹폰트 사용:
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
EOF

echo -e "${GREEN}✅ 폰트 설정 완료${NC}"

# 샘플 템플릿 확인
echo -e "${BLUE}📋 템플릿 파일 확인...${NC}"
template_count=$(find assets/templates -name "*.json" | wc -l)
echo "  템플릿 파일: ${template_count}개"

# 다운로드 가이드 생성
echo -e "${BLUE}📖 다운로드 가이드 생성...${NC}"
cat > assets/DOWNLOAD_GUIDE.md << EOF
# Asset 다운로드 가이드

이 스크립트 실행 후 수동으로 다운로드해야 하는 항목들입니다.

## 🎵 오디오 자산

### 배경음악 (4곡)
- [ ] corporate-upbeat.mp3 (YouTube Audio Library)
- [ ] educational-calm.mp3 (YouTube Audio Library)  
- [ ] tech-ambient.mp3 (Freesound)
- [ ] focus-minimal.mp3 (YouTube Audio Library)

### UI 효과음 (5개)
- [ ] click-soft.wav (UI-sounds.com)
- [ ] whoosh-transition.wav (Zapsplat)
- [ ] success-chime.wav (Freesound)
- [ ] error-beep.wav (Freesound)
- [ ] pop-notification.wav (Freesound)

## 🖼️ 이미지 자산

### 배경 이미지 (12장)
- [ ] tech-abstract-01.jpg (Unsplash)
- [ ] tech-coding-02.jpg (Pexels)  
- [ ] education-books-01.jpg (Unsplash)
- [ ] education-classroom-02.jpg (Pexels)
- [ ] business-office-01.jpg (Unsplash)
- [ ] business-meeting-02.jpg (Pexels)
- 기타 6장...

### 로고 생성 (6개)
- [ ] InfoGraphAI 로고 전체 버전
- [ ] 심볼 마크만
- [ ] 흰색/검은색 버전
- [ ] 워터마크용 투명 PNG

## 🎨 아이콘 다운로드 (30개)

### Heroicons에서 다운로드
\`\`\`bash
# UI 기본 아이콘들
curl -o assets/icons/ui/menu.svg "https://heroicons.com/24/outline/bars-3.svg"
curl -o assets/icons/ui/close.svg "https://heroicons.com/24/outline/x-mark.svg"
curl -o assets/icons/ui/play.svg "https://heroicons.com/24/outline/play.svg"
curl -o assets/icons/ui/pause.svg "https://heroicons.com/24/outline/pause.svg"
# ... 추가 아이콘들
\`\`\`

### Simple Icons에서 기술 아이콘들
- React, Vue, Angular
- JavaScript, TypeScript, Python
- Docker, Kubernetes, AWS
- 등등...

## 📱 완료 확인

모든 다운로드 완료 후:
\`\`\`bash
npm run asset-check
\`\`\`

이 명령으로 누락된 자산이 있는지 확인할 수 있습니다.
EOF

# Asset 체크 스크립트 생성
cat > scripts/check-assets.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Asset 체크 시작...\n');

const assetDirs = [
  'assets/audio/background-music',
  'assets/audio/sound-effects', 
  'assets/audio/ui-sounds',
  'assets/images/backgrounds',
  'assets/images/logos',
  'assets/icons/ui',
  'assets/icons/technology',
  'assets/templates/education',
  'assets/templates/tech',
  'assets/templates/business',
  'assets/fonts/korean',
  'assets/fonts/english'
];

let totalFiles = 0;
let missingDirs = 0;

assetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
    console.log(`✅ ${dir}: ${files.length}개 파일`);
    totalFiles += files.length;
  } else {
    console.log(`❌ ${dir}: 디렉토리 없음`);
    missingDirs++;
  }
});

console.log(`\n📊 요약:`);
console.log(`  총 파일: ${totalFiles}개`);
console.log(`  누락 디렉토리: ${missingDirs}개`);

if (totalFiles < 20) {
  console.log(`\n⚠️ 권장사항: 최소 20개 이상의 asset이 필요합니다.`);
  console.log(`   DOWNLOAD_GUIDE.md를 참고하여 추가 다운로드해주세요.`);
}
EOF

chmod +x scripts/check-assets.js

# package.json에 스크립트 추가 (있다면)
if [ -f "package.json" ]; then
  echo -e "${BLUE}📦 package.json 업데이트...${NC}"
  # npm script 추가 로직은 수동으로 처리
  echo "  asset-check 스크립트를 package.json에 수동으로 추가해주세요:"
  echo '  "scripts": { "asset-check": "node scripts/check-assets.js" }'
fi

echo ""
echo -e "${GREEN}🎉 Asset 다운로드 스크립트 완료!${NC}"
echo ""
echo -e "${YELLOW}다음 단계:${NC}"
echo "1. assets/DOWNLOAD_GUIDE.md 참고하여 실제 파일들 다운로드"
echo "2. npm run asset-check로 완료 상황 확인"  
echo "3. 라이센스 정보 확인 및 크레딧 표기"
echo ""
echo -e "${BLUE}Happy asset collecting! 🚀${NC}"
EOF