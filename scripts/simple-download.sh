#!/bin/bash

# 간단한 Asset 자동 다운로드 스크립트
# macOS 기본 bash와 호환

echo "🚀 InfoGraphAI 자동 Asset 다운로드"
echo "================================="

# 1. Heroicons 다운로드
echo "🎨 UI 아이콘 다운로드 중..."

ui_icons="menu:bars-3 close:x-mark play:play pause:pause edit:pencil delete:trash save:bookmark download:arrow-down-tray search:magnifying-glass check:check settings:cog-6-tooth home:home user:user"

for icon_pair in $ui_icons; do
    name="${icon_pair%:*}"
    hero_name="${icon_pair#*:}"
    echo "  다운로드: ${name}.svg"
    curl -s "https://heroicons.com/24/outline/${hero_name}.svg" \
         -o "assets/icons/ui/${name}.svg"
done

echo "✅ UI 아이콘 완료 (12개)"

# 2. 기술 아이콘 다운로드 
echo "💻 기술 아이콘 다운로드 중..."

tech_icons="javascript typescript react vue-dot-js angular node-dot-js python java docker kubernetes github git"

for icon in $tech_icons; do
    echo "  다운로드: ${icon}.svg"
    curl -s "https://cdn.jsdelivr.net/npm/simple-icons@v9/${icon}.svg" \
         -o "assets/icons/technology/${icon}.svg"
done

echo "✅ 기술 아이콘 완료 (11개)"

# 3. 무료 배경 이미지 다운로드
echo "📸 배경 이미지 다운로드 중..."

# Unsplash Source API 사용
curl -L -s "https://source.unsplash.com/1920x1080/?programming,code" \
     -o "assets/images/backgrounds/tech-coding.jpg"

curl -L -s "https://source.unsplash.com/1920x1080/?laptop,technology" \
     -o "assets/images/backgrounds/tech-laptop.jpg"

curl -L -s "https://source.unsplash.com/1920x1080/?books,education" \
     -o "assets/images/backgrounds/education-books.jpg"

curl -L -s "https://source.unsplash.com/1920x1080/?office,business" \
     -o "assets/images/backgrounds/business-office.jpg"

curl -L -s "https://source.unsplash.com/1920x1080/?gradient,blue" \
     -o "assets/images/backgrounds/gradient-blue.jpg"

echo "✅ 배경 이미지 완료 (5개)"

# 4. 일러스트 다운로드
echo "🎨 일러스트 다운로드 중..."

mkdir -p assets/images/illustrations

illustrations="online_learning_b4xn programming_2svr data_processing_yrrv team_collaboration_8c4p"

for ill in $illustrations; do
    echo "  다운로드: ${ill}.svg"
    curl -s "https://undraw.co/api/illustrations/${ill}.svg" \
         -o "assets/images/illustrations/${ill}.svg"
done

echo "✅ 일러스트 완료 (4개)"

# 5. 폰트 다운로드
echo "🔤 폰트 다운로드 중..."

# Google Fonts CSS
curl -s "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" \
     -o "assets/fonts/english/inter.css"

# JetBrains Mono
curl -L -s "https://download.jetbrains.com/fonts/JetBrainsMono-2.304.zip" \
     -o "assets/fonts/english/jetbrains-mono.zip"

echo "✅ 폰트 완료"

# 6. 샘플 Lottie 애니메이션 생성
echo "🎬 Lottie 애니메이션 생성 중..."

# 로딩 스피너 샘플
cat > assets/animations/lottie/loading-spinner.json << 'EOF'
{
  "v": "5.7.4",
  "fr": 60,
  "ip": 0,
  "op": 120,
  "w": 100,
  "h": 100,
  "nm": "loading-spinner",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "spinner",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {"a": 1, "k": [{"t": 0, "s": [0], "e": [360]}, {"t": 120}]},
        "p": {"a": 0, "k": [50, 50]},
        "s": {"a": 0, "k": [100, 100]}
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "el",
          "p": {"a": 0, "k": [0, 0]},
          "s": {"a": 0, "k": [40, 40]}
        }
      ],
      "ip": 0,
      "op": 120,
      "st": 0,
      "bm": 0
    }
  ]
}
EOF

# 성공 체크마크
cat > assets/animations/lottie/success-check.json << 'EOF'
{
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 100,
  "h": 100,
  "nm": "success-check",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "checkmark",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "p": {"a": 0, "k": [50, 50]},
        "s": {"a": 0, "k": [100, 100]}
      },
      "ao": 0,
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    }
  ]
}
EOF

echo "✅ Lottie 애니메이션 완료 (2개)"

# 7. 통계 및 결과
echo ""
echo "🎉 자동 다운로드 완료!"
echo "====================="

# 파일 개수 세기
ui_count=$(ls assets/icons/ui/*.svg 2>/dev/null | wc -l || echo "0")
tech_count=$(ls assets/icons/technology/*.svg 2>/dev/null | wc -l || echo "0")
img_count=$(ls assets/images/backgrounds/*.jpg 2>/dev/null | wc -l || echo "0")
ill_count=$(ls assets/images/illustrations/*.svg 2>/dev/null | wc -l || echo "0")
lottie_count=$(ls assets/animations/lottie/*.json 2>/dev/null | wc -l || echo "0")

total=$((ui_count + tech_count + img_count + ill_count + lottie_count))

echo "📊 다운로드 현황:"
echo "  UI 아이콘: ${ui_count}개"
echo "  기술 아이콘: ${tech_count}개"  
echo "  배경 이미지: ${img_count}개"
echo "  일러스트: ${ill_count}개"
echo "  애니메이션: ${lottie_count}개"
echo "  총 파일: ${total}개"

echo ""
echo "✅ 다음 단계:"
echo "1. node scripts/check-assets.js - 상세 확인"
echo "2. 폰트 압축파일 압축 해제"
echo "3. 추가 사운드 파일 다운로드 (Freesound.org)"
echo "4. 라이센스 확인 및 크레딧 표기"

echo ""
echo "🚀 InfoGraphAI Asset 수집 완료!"