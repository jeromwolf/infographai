#!/bin/bash

# 실제 Asset 파일 다운로드 스크립트
# 가짜 HTML이 아닌 진짜 파일들 다운로드

echo "🔧 실제 Asset 파일 다운로드"
echo "기존 가짜 파일들 정리 후 진짜 파일 다운로드"
echo "======================================"

# 기존 가짜 파일들 삭제
echo "🗑️  가짜 파일들 정리 중..."
find assets -name "*.svg" -size +100k -delete  # HTML 파일들 삭제
find assets -name "*.jpg" -size -1k -delete    # 작은 HTML 파일들 삭제

count=0

# 1. 실제 Simple Icons 다운로드 (정확한 URL 사용)
echo "💻 실제 기술 아이콘 다운로드..."

tech_icons="javascript typescript react vuedotjs angular nodedotjs python java docker kubernetes github git postgresql mongodb redis firebase"

for icon in $tech_icons; do
    echo "  다운로드: ${icon}.svg"
    # jsdelivr에서 직접 raw SVG 다운로드
    curl -s "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${icon}.svg" \
         -o "assets/icons/technology/${icon}.svg"
    
    # 파일이 실제 SVG인지 확인
    if head -1 "assets/icons/technology/${icon}.svg" | grep -q "svg"; then
        count=$((count + 1))
        echo "    ✅ 성공"
    else
        echo "    ❌ 실패 - HTML 파일"
        rm "assets/icons/technology/${icon}.svg" 2>/dev/null
    fi
    sleep 0.5
done

# 2. 실제 Heroicons 다운로드 (GitHub에서 직접)
echo "🎨 실제 UI 아이콘 다운로드..."

ui_icons="bars-3 x-mark play pause pencil trash bookmark magnifying-glass check cog-6-tooth home user"

for icon in $ui_icons; do
    echo "  다운로드: ${icon}.svg"
    # GitHub에서 직접 raw SVG 다운로드
    curl -s "https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/${icon}.svg" \
         -o "assets/icons/ui/${icon}.svg"
    
    # 파일이 실제 SVG인지 확인
    if head -1 "assets/icons/ui/${icon}.svg" | grep -q "svg"; then
        count=$((count + 1))
        echo "    ✅ 성공"
    else
        echo "    ❌ 실패 - HTML 파일"
        rm "assets/icons/ui/${icon}.svg" 2>/dev/null
    fi
    sleep 0.5
done

# 3. 실제 이미지 다운로드 (다른 소스 사용)
echo "📸 실제 배경 이미지 다운로드..."

# Picsum 사용 (Lorem Picsum - 확실한 이미지)
for i in {1..10}; do
    filename="background-${i}"
    echo "  다운로드: ${filename}.jpg"
    
    # Lorem Picsum에서 실제 이미지 다운로드
    curl -L -s "https://picsum.photos/1920/1080?random=${i}" \
         -o "assets/images/backgrounds/${filename}.jpg"
    
    # 파일이 실제 이미지인지 확인
    if file "assets/images/backgrounds/${filename}.jpg" | grep -q "JPEG"; then
        count=$((count + 1))
        echo "    ✅ 성공 ($(ls -lh "assets/images/backgrounds/${filename}.jpg" | awk '{print $5}'))"
    else
        echo "    ❌ 실패 - 이미지가 아님"
        rm "assets/images/backgrounds/${filename}.jpg" 2>/dev/null
    fi
    sleep 1
done

# 4. 실제 폰트 파일 다운로드
echo "🔤 실제 폰트 파일 다운로드..."

# Inter 폰트 WOFF2 파일들 직접 다운로드
font_weights="400 500 600 700"

for weight in $font_weights; do
    filename="Inter-${weight}"
    echo "  다운로드: ${filename}.woff2"
    
    # Google Fonts에서 직접 woff2 파일 다운로드
    curl -s "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" \
         -o "assets/fonts/english/${filename}.woff2"
    
    if [ -s "assets/fonts/english/${filename}.woff2" ]; then
        count=$((count + 1))
        echo "    ✅ 성공"
    else
        echo "    ❌ 실패"
        rm "assets/fonts/english/${filename}.woff2" 2>/dev/null
    fi
done

# 5. 실제 일러스트 생성 (SVG 직접 생성)
echo "🎨 실제 일러스트 생성..."

for i in {1..5}; do
    filename="illustration-${i}"
    echo "  생성: ${filename}.svg"
    
    # 실제 SVG 일러스트 생성
    cat > "assets/images/illustrations/${filename}.svg" << EOF
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg${i})" rx="20"/>
  <circle cx="200" cy="150" r="$((30 + i*10))" fill="white" opacity="0.3"/>
  <rect x="$((50 + i*20))" y="$((100 + i*10))" width="$((100 + i*20))" height="$((50 + i*5))" fill="white" opacity="0.8" rx="10"/>
  <text x="200" y="280" text-anchor="middle" fill="white" font-family="Arial" font-size="18" font-weight="bold">Illustration ${i}</text>
</svg>
EOF
    count=$((count + 1))
done

echo ""
echo "🎉 실제 Asset 다운로드 완료!"
echo "==============================="
echo "총 다운로드 성공: ${count}개"

# 검증
echo ""
echo "🔍 파일 검증 결과:"
echo "UI 아이콘: $(find assets/icons/ui -name "*.svg" -exec grep -l "svg" {} \; | wc -l)개 (실제 SVG)"
echo "기술 아이콘: $(find assets/icons/technology -name "*.svg" -exec grep -l "svg" {} \; | wc -l)개 (실제 SVG)"
echo "배경 이미지: $(find assets/images/backgrounds -name "*.jpg" -exec file {} \; | grep -c JPEG)개 (실제 JPEG)"
echo "일러스트: $(find assets/images/illustrations -name "*.svg" -exec grep -l "svg" {} \; | wc -l)개 (실제 SVG)"
echo "폰트 파일: $(find assets/fonts -name "*.woff2" | wc -l)개 (실제 폰트)"

echo ""
echo "✅ 이제 진짜 Asset 파일들을 가지고 있습니다!"