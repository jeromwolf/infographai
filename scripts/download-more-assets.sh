#!/bin/bash

# InfoGraphAI 에셋 대량 다운로드 스크립트
# 무료 아이콘/SVG 리소스 다운로드

echo "🎨 InfoGraphAI 에셋 다운로드 시작..."

# 디렉토리 생성
ASSETS_DIR="../../assets"
ICONS_DIR="$ASSETS_DIR/icons"
TECH_ICONS="$ICONS_DIR/technology"
UI_ICONS="$ICONS_DIR/ui"
EDUCATION_ICONS="$ICONS_DIR/education"
BUSINESS_ICONS="$ICONS_DIR/business"
DATA_VIZ_ICONS="$ICONS_DIR/data-viz"

mkdir -p "$TECH_ICONS"
mkdir -p "$UI_ICONS"
mkdir -p "$EDUCATION_ICONS"
mkdir -p "$BUSINESS_ICONS"
mkdir -p "$DATA_VIZ_ICONS"

# 1. Heroicons (MIT License - 무료)
echo "📦 Heroicons 다운로드 중..."
if [ ! -d "/tmp/heroicons" ]; then
    git clone https://github.com/tailwindlabs/heroicons.git /tmp/heroicons
fi
cp /tmp/heroicons/src/24/outline/*.svg "$UI_ICONS/" 2>/dev/null || true
echo "✅ Heroicons 완료"

# 2. Feather Icons (MIT License - 무료)
echo "📦 Feather Icons 다운로드 중..."
if [ ! -d "/tmp/feather" ]; then
    git clone https://github.com/feathericons/feather.git /tmp/feather
fi
cp /tmp/feather/icons/*.svg "$UI_ICONS/" 2>/dev/null || true
echo "✅ Feather Icons 완료"

# 3. Simple Icons (CC0 - 기술 브랜드 로고)
echo "📦 Simple Icons (Tech Brands) 다운로드 중..."
if [ ! -d "/tmp/simple-icons" ]; then
    git clone https://github.com/simple-icons/simple-icons.git /tmp/simple-icons
fi
# 주요 기술 아이콘만 선택적으로 복사
for icon in docker kubernetes react vue angular nodejs python javascript typescript aws googlecloud azure mongodb postgresql mysql redis nginx apache git github gitlab bitbucket; do
    cp "/tmp/simple-icons/icons/$icon.svg" "$TECH_ICONS/" 2>/dev/null || true
done
echo "✅ Simple Icons 완료"

# 4. Tabler Icons (MIT License - 3000+ 아이콘)
echo "📦 Tabler Icons 다운로드 중..."
if [ ! -d "/tmp/tabler-icons" ]; then
    git clone https://github.com/tabler/tabler-icons.git /tmp/tabler-icons
fi
cp /tmp/tabler-icons/icons/*.svg "$UI_ICONS/" 2>/dev/null || true
echo "✅ Tabler Icons 완료"

# 5. 교육 관련 커스텀 SVG 생성
echo "🎓 교육 아이콘 생성 중..."

# Book 아이콘
cat > "$EDUCATION_ICONS/book.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
</svg>
EOF

# Graduation Cap
cat > "$EDUCATION_ICONS/graduation.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
</svg>
EOF

# Video Play
cat > "$EDUCATION_ICONS/video-play.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
  <polygon points="10 8 16 12 10 16 10 8"></polygon>
</svg>
EOF

# Learning Path
cat > "$EDUCATION_ICONS/learning-path.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="5" cy="6" r="3"></circle>
  <circle cx="19" cy="6" r="3"></circle>
  <circle cx="12" cy="18" r="3"></circle>
  <line x1="8" y1="8" x2="10" y2="15"></line>
  <line x1="16" y1="8" x2="14" y2="15"></line>
</svg>
EOF

# 6. 데이터 시각화 아이콘 생성
echo "📊 데이터 시각화 아이콘 생성 중..."

# Bar Chart
cat > "$DATA_VIZ_ICONS/bar-chart.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="3" y="10" width="4" height="11"></rect>
  <rect x="10" y="3" width="4" height="18"></rect>
  <rect x="17" y="8" width="4" height="13"></rect>
</svg>
EOF

# Pie Chart
cat > "$DATA_VIZ_ICONS/pie-chart.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
</svg>
EOF

# Line Chart
cat > "$DATA_VIZ_ICONS/line-chart.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
</svg>
EOF

# Network Graph
cat > "$DATA_VIZ_ICONS/network.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="5" r="2"></circle>
  <circle cx="5" cy="19" r="2"></circle>
  <circle cx="19" cy="19" r="2"></circle>
  <path d="M10.5 6.5L6.5 17.5M13.5 6.5L17.5 17.5M6.5 18H17.5"></path>
</svg>
EOF

# 7. 비즈니스 아이콘 생성
echo "💼 비즈니스 아이콘 생성 중..."

# Target
cat > "$BUSINESS_ICONS/target.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"></circle>
  <circle cx="12" cy="12" r="6"></circle>
  <circle cx="12" cy="12" r="2"></circle>
</svg>
EOF

# Growth
cat > "$BUSINESS_ICONS/growth.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
  <polyline points="17 6 23 6 23 12"></polyline>
</svg>
EOF

# Strategy
cat > "$BUSINESS_ICONS/strategy.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
</svg>
EOF

# 8. 애니메이션 관련 아이콘
echo "🎬 애니메이션 아이콘 생성 중..."

ANIM_ICONS="$ICONS_DIR/animation"
mkdir -p "$ANIM_ICONS"

# Fade In
cat > "$ANIM_ICONS/fade-in.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="4" y="4" width="16" height="16" rx="2" opacity="0.3"></rect>
  <rect x="8" y="8" width="8" height="8" rx="1" opacity="0.6"></rect>
  <rect x="10" y="10" width="4" height="4" rx="0.5"></rect>
</svg>
EOF

# Slide In
cat > "$ANIM_ICONS/slide-in.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M14 2l6 6-6 6"></path>
  <path d="M20 8H3"></path>
  <rect x="3" y="14" width="18" height="6" rx="1"></rect>
</svg>
EOF

# Zoom In
cat > "$ANIM_ICONS/zoom-in.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="11" cy="11" r="8"></circle>
  <path d="m21 21-4.35-4.35"></path>
  <line x1="11" y1="8" x2="11" y2="14"></line>
  <line x1="8" y1="11" x2="14" y2="11"></line>
</svg>
EOF

# 9. 통계 생성
echo ""
echo "📊 다운로드 완료 통계:"
echo "------------------------"
echo "UI 아이콘: $(ls -1 $UI_ICONS/*.svg 2>/dev/null | wc -l)개"
echo "기술 아이콘: $(ls -1 $TECH_ICONS/*.svg 2>/dev/null | wc -l)개"
echo "교육 아이콘: $(ls -1 $EDUCATION_ICONS/*.svg 2>/dev/null | wc -l)개"
echo "비즈니스 아이콘: $(ls -1 $BUSINESS_ICONS/*.svg 2>/dev/null | wc -l)개"
echo "데이터 시각화: $(ls -1 $DATA_VIZ_ICONS/*.svg 2>/dev/null | wc -l)개"
echo "애니메이션: $(ls -1 $ANIM_ICONS/*.svg 2>/dev/null | wc -l)개"
echo "------------------------"
echo "총 아이콘: $(find $ICONS_DIR -name "*.svg" 2>/dev/null | wc -l)개"
echo ""
echo "✅ 모든 에셋 다운로드 완료!"
echo ""
echo "💡 추가로 필요한 에셋:"
echo "   - Font Awesome (npm install --save @fortawesome/fontawesome-free)"
echo "   - Material Icons (npm install material-icons)"
echo "   - Lucide Icons (npm install lucide-react)"
echo "   - Phosphor Icons (npm install phosphor-icons)"