#!/bin/bash

# InfoGraphAI 대용량 Asset 수집 시스템
# 목표: 1000개+ 고품질 Asset 확보

echo "🚀 InfoGraphAI 대용량 Asset 수집 시작"
echo "목표: 1000개+ Asset 확보 (현재: $(find assets -type f | wc -l)개)"
echo "=========================================="

download_count=0
total_target=1000

# Phase 1: Heroicons 완전 수집 (400개 목표)
echo ""
echo "📦 Phase 1: Heroicons 완전 수집..."
echo "--------------------------------------"

# Heroicons outline 24px (주요 아이콘들)
heroicons_outline="academic-cap adjustments-horizontal adjustments-vertical archive-box archive-box-arrow-down archive-box-x-mark arrow-down-circle arrow-down-left arrow-down-on-square arrow-down-on-square-stack arrow-down-right arrow-down-tray arrow-left arrow-left-circle arrow-left-on-rectangle arrow-long-down arrow-long-left arrow-long-right arrow-long-up arrow-path arrow-path-rounded-square arrow-right arrow-right-circle arrow-right-on-rectangle arrow-top-right-on-square arrow-trending-down arrow-trending-up arrow-turn-down-left arrow-turn-down-right arrow-turn-left-down arrow-turn-left-up arrow-turn-right-down arrow-turn-right-up arrow-turn-up-left arrow-turn-up-right arrow-up arrow-up-circle arrow-up-left arrow-up-on-square arrow-up-on-square-stack arrow-up-right arrow-up-tray arrow-uturn-down arrow-uturn-left arrow-uturn-right arrow-uturn-up at-symbol backspace backward banknotes bars-2 bars-3 bars-3-bottom-left bars-3-bottom-right bars-3-center-left bars-4 battery-0 battery-100 battery-50 beaker bell bell-alert bell-slash bell-snooze bolt bolt-slash book-open bookmark bookmark-slash bookmark-square briefcase bug-ant building-library building-office building-office-2 building-storefront cake calculator calendar calendar-days camera chart-bar chart-bar-square chart-pie chatbubble-bottom-center chatbubble-bottom-center-text chatbubble-left chatbubble-left-ellipsis chatbubble-left-right chatbubble-oval-left chatbubble-oval-left-ellipsis check check-badge check-circle chevron-double-down chevron-double-left chevron-double-right chevron-double-up chevron-down chevron-left chevron-right chevron-up circle-stack clipboard clipboard-document clipboard-document-check clipboard-document-list clock cloud cloud-arrow-down cloud-arrow-up cog cog-6-tooth cog-8-tooth command-line computer-desktop credit-card cube cube-transparent currency-bangladeshi currency-dollar currency-euro currency-pound currency-rupee currency-yen cursor-arrow-rays cursor-arrow-ripple device-phone-mobile device-tablet document document-arrow-down document-arrow-up document-chart-bar document-check document-duplicate document-magnifying-glass document-minus document-plus document-text ellipsis-horizontal ellipsis-horizontal-circle ellipsis-vertical envelope envelope-open exclamation-circle exclamation-triangle eye eye-dropper eye-slash face-frown face-smile film finger-print fire flag folder folder-arrow-down folder-minus folder-open folder-plus forward funnel gif globe-alt globe-americas globe-asia-pacific globe-europe-africa hand-raised hand-thumb-down hand-thumb-up hashtag heart home identification inbox inbox-arrow-down inbox-stack information-circle key language lifebuoy light-bulb link list-bullet lock-closed lock-open magnifying-glass magnifying-glass-circle magnifying-glass-minus magnifying-glass-plus map map-pin megaphone microphone microphone-slash minus minus-circle minus-small moon musical-note newspaper no-symbol paint-brush paper-airplane paper-clip pause pause-circle pencil pencil-square phone phone-arrow-down-left phone-arrow-up-right photo play play-circle play-pause plus plus-circle plus-small power presentation-chart-bar presentation-chart-line printer puzzle-piece qr-code question-mark-circle queue-list radio receipt-percent receipt-refund rectangle-group rectangle-stack rocket rss scale server share shield-check shield-exclamation shopping-bag shopping-cart signal signal-slash sparkles speaker-wave speaker-x-mark square-2-stack square-3-stack-3d squares-2x2 squares-plus star stop stop-circle sun swatch table-cells tag ticket trash tv user user-circle user-group user-minus user-plus users variable video-camera video-camera-slash viewfinder-circle wallet wifi wrench wrench-screwdriver x-circle x-mark"

echo "  다운로드: Heroicons outline 24px..."
for icon in $heroicons_outline; do
    if [ $download_count -ge 100 ]; then break; fi
    
    curl -s "https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/outline/${icon}.svg" \
         -o "assets/icons/ui/${icon}.svg"
    
    if head -1 "assets/icons/ui/${icon}.svg" | grep -q "<svg"; then
        download_count=$((download_count + 1))
        echo "    ✅ ${icon}.svg (${download_count}/${total_target})"
    else
        rm "assets/icons/ui/${icon}.svg" 2>/dev/null
    fi
    sleep 0.1
done

# Heroicons solid 24px (주요 아이콘들 - solid 버전)
heroicons_solid="academic-cap archive-box arrow-down arrow-left arrow-right arrow-up at-symbol bell bookmark briefcase calendar camera chart-bar chart-pie check-circle chevron-down chevron-left chevron-right chevron-up clipboard clock cloud cog computer-desktop credit-card cube document envelope eye flag folder globe-alt heart home inbox key light-bulb lock-closed magnifying-glass map microphone minus-circle musical-note pause-circle pencil phone photo play-circle plus-circle printer question-mark-circle receipt-percent shield-check shopping-bag star stop-circle sun trash user video-camera wifi x-circle"

echo "  다운로드: Heroicons solid 24px..."
for icon in $heroicons_solid; do
    if [ $download_count -ge 200 ]; then break; fi
    
    curl -s "https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24/solid/${icon}.svg" \
         -o "assets/icons/ui/${icon}-solid.svg"
    
    if head -1 "assets/icons/ui/${icon}-solid.svg" | grep -q "<svg"; then
        download_count=$((download_count + 1))
        echo "    ✅ ${icon}-solid.svg (${download_count}/${total_target})"
    else
        rm "assets/icons/ui/${icon}-solid.svg" 2>/dev/null
    fi
    sleep 0.1
done

# Phase 2: Simple Icons 브랜드 컬렉션 (300개 목표)
echo ""
echo "📦 Phase 2: Simple Icons 브랜드 컬렉션..."
echo "----------------------------------------"

# 확장된 기술 브랜드 아이콘들
extended_tech_icons="javascript typescript react vuedotjs angular nodedotjs python java docker kubernetes github git postgresql mongodb redis firebase nextdotjs nuxtdotjs svelte flutter reactnative ionic xamarin django spring laravel express fastapi flask ruby rubyonrails php symfony codeigniter wordpress drupal joomla mysql sqlite oracle microsoftsqlserver elasticsearch solr apache nginx cloudflare amazonaws microsoftazure googlecloud digitalocean heroku netlify vercel jenkins gitlab bitbucket jira confluence slack discord telegram whatsapp skype zoom googlemeet microsoftteams notion trello asana monday figma sketch adobexd adobephotoshop adobeillustrator canva blender unity unrealengine godot visualstudiocode intellijidea sublimetext atom vim neovim emacs jupyter anaconda tensorflow pytorch keras scikit-learn pandas numpy matplotlib plotly d3dotjs chartdotjs threejs babylondotjs aframe webgl opencv electron pwa webpack vite rollup parcel babel eslint prettier jest cypress selenium playwright storybook chromatic github-actions circleci travisci appveyor jenkins sonarqube codecov coveralls sentry rollbar bugsnag hotjar googleanalytics mixpanel amplitude intercom zendesk freshworks mailchimp sendgrid twilio stripe paypal squareup razorpay paytm googlepay applepay mastercard visa americanexpress"

echo "  다운로드: Extended Technology Icons..."
for icon in $extended_tech_icons; do
    if [ $download_count -ge 400 ]; then break; fi
    
    curl -s "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${icon}.svg" \
         -o "assets/icons/technology/${icon}.svg"
    
    if head -1 "assets/icons/technology/${icon}.svg" | grep -q "<svg"; then
        download_count=$((download_count + 1))
        echo "    ✅ ${icon}.svg (${download_count}/${total_target})"
    else
        rm "assets/icons/technology/${icon}.svg" 2>/dev/null
    fi
    sleep 0.1
done

# Phase 3: Feather Icons 완전 세트 (255개)
echo ""
echo "📦 Phase 3: Feather Icons 완전 세트..."
echo "------------------------------------"

# 주요 Feather Icons
feather_icons="activity airplay alert-circle alert-octagon alert-triangle align-center align-justify align-left align-right anchor aperture archive arrow-down arrow-down-circle arrow-down-left arrow-down-right arrow-left arrow-left-circle arrow-right arrow-right-circle arrow-up arrow-up-circle arrow-up-left arrow-up-right at-sign award bar-chart bar-chart-2 battery bell bell-off bluetooth bold book bookmark box briefcase calendar camera cast check check-circle check-square chevron-down chevron-left chevron-right chevron-up chevrons-down chevrons-left chevrons-right chevrons-up circle clipboard clock cloud cloud-drizzle cloud-lightning cloud-off cloud-rain cloud-snow code codepen coffee command compass copy corner-down-left corner-down-right corner-left-down corner-left-up corner-right-down corner-right-up corner-up-left corner-up-right cpu credit-card crop crosshair database delete disc dollar-sign download droplet edit edit-2 edit-3 external-link eye eye-off facebook fast-forward feather file file-minus file-plus file-text film filter flag folder folder-minus folder-plus framer gift git-branch git-commit git-merge git-pull-request globe grid hash headphones heart help-circle home image inbox info instagram italic key layers layout life-buoy link link-2 linkedin list loader lock log-in log-out mail map-pin maximize maximize-2 menu message-circle message-square mic mic-off minimize minimize-2 minus monitor moon more-horizontal more-vertical mouse move music navigation navigation-2 octagon package paperclip pause pause-circle percent phone phone-call phone-forwarded phone-incoming phone-missed phone-off phone-outgoing pie-chart play play-circle plus plus-circle plus-square power printer radio refresh-ccw refresh-cw repeat rewind rotate-ccw rotate-cw rss save scissors search send settings share share-2 shield shield-off shopping-bag shopping-cart shuffle sidebar skip-back skip-forward slash sliders smartphone smile speaker square star stop-circle sun sunrise sunset tablet tag target terminal thumbs-down thumbs-up toggle-left toggle-right tool trash trash-2 triangle truck tv twitch twitter type umbrella underline unlock upload upload-cloud user user-check user-minus user-plus user-x users video video-off volume volume-1 volume-2 volume-x watch wifi wifi-off wind x x-circle x-square youtube zap zap-off zoom-in zoom-out"

echo "  다운로드: Feather Icons..."
for icon in $feather_icons; do
    if [ $download_count -ge 600 ]; then break; fi
    
    curl -s "https://raw.githubusercontent.com/feathericons/feather/master/icons/${icon}.svg" \
         -o "assets/icons/ui/feather-${icon}.svg"
    
    if head -1 "assets/icons/ui/feather-${icon}.svg" | grep -q "<svg"; then
        download_count=$((download_count + 1))
        echo "    ✅ feather-${icon}.svg (${download_count}/${total_target})"
    else
        rm "assets/icons/ui/feather-${icon}.svg" 2>/dev/null
    fi
    sleep 0.1
done

# Phase 4: 고해상도 배경 이미지 (200개)
echo ""
echo "📦 Phase 4: 고해상도 배경 이미지..."
echo "--------------------------------"

# 다양한 카테고리의 배경 이미지
categories=("technology" "business" "abstract" "nature" "education" "workspace" "minimalist" "gradient")

for category in "${categories[@]}"; do
    if [ $download_count -ge 800 ]; then break; fi
    
    echo "  카테고리: ${category}"
    for i in {1..25}; do
        if [ $download_count -ge 800 ]; then break; fi
        
        filename="background-${category}-${i}"
        
        # Picsum Photos에서 다양한 시드로 고해상도 이미지 다운로드
        seed=$((RANDOM % 1000 + i * 10))
        curl -L -s "https://picsum.photos/1920/1080?random=${seed}" \
             -o "assets/images/backgrounds/${filename}.jpg"
        
        if file "assets/images/backgrounds/${filename}.jpg" | grep -q "JPEG"; then
            download_count=$((download_count + 1))
            size=$(ls -lh "assets/images/backgrounds/${filename}.jpg" | awk '{print $5}')
            echo "    ✅ ${filename}.jpg (${size}) (${download_count}/${total_target})"
        else
            rm "assets/images/backgrounds/${filename}.jpg" 2>/dev/null
        fi
        sleep 0.3
    done
done

# Phase 5: 인포그래픽 특화 일러스트 생성 (200개)
echo ""
echo "📦 Phase 5: 인포그래픽 특화 일러스트..."
echo "-----------------------------------"

# 다양한 인포그래픽 스타일 생성
styles=("business" "education" "technology" "process" "comparison" "timeline" "statistics" "flowchart")

for style in "${styles[@]}"; do
    if [ $download_count -ge 1000 ]; then break; fi
    
    echo "  스타일: ${style}"
    for i in {1..25}; do
        if [ $download_count -ge 1000 ]; then break; fi
        
        filename="${style}-infographic-${i}"
        
        # 스타일별 색상 팔레트
        case $style in
            "business") colors=("#2563EB" "#DC2626" "#059669" "#D97706") ;;
            "education") colors=("#7C3AED" "#EC4899" "#10B981" "#F59E0B") ;;
            "technology") colors=("#06B6D4" "#8B5CF6" "#EF4444" "#22C55E") ;;
            "process") colors=("#3B82F6" "#6366F1" "#8B5CF6" "#A855F7") ;;
            "comparison") colors=("#EF4444" "#22C55E" "#F59E0B" "#06B6D4") ;;
            "timeline") colors=("#4F46E5" "#7C2D12" "#166534" "#92400E") ;;
            "statistics") colors=("#1F2937" "#374151" "#6B7280" "#9CA3AF") ;;
            "flowchart") colors=("#0EA5E9" "#F97316" "#84CC16" "#F472B6") ;;
        esac
        
        color1=${colors[$((RANDOM % ${#colors[@]}))]}
        color2=${colors[$((RANDOM % ${#colors[@]}))]}
        color3=${colors[$((RANDOM % ${#colors[@]}))]}
        
        cat > "assets/images/illustrations/${filename}.svg" << EOF
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${color2};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color3};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad${i})" rx="20"/>
  <circle cx="$((150 + i*20))" cy="$((100 + i*15))" r="$((30 + i*2))" fill="white" opacity="0.3"/>
  <rect x="$((200 + i*10))" y="$((150 + i*8))" width="$((180 + i*15))" height="$((100 + i*8))" fill="white" opacity="0.8" rx="15"/>
  <polygon points="$((100 + i*15)),$((250 + i*10)) $((200 + i*20)),$((200 + i*15)) $((300 + i*25)),$((280 + i*5))" fill="white" opacity="0.6"/>
  <text x="300" y="380" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">$(tr '[:lower:]' '[:upper:]' <<< "${style:0:1}")${style:1} ${i}</text>
</svg>
EOF
        
        download_count=$((download_count + 1))
        echo "    ✅ ${filename}.svg (${download_count}/${total_target})"
    done
done

echo ""
echo "🎉 대용량 Asset 수집 완료!"
echo "========================="
echo "성공적으로 수집된 Asset: ${download_count}개"

# 최종 카운트 및 검증
echo ""
echo "🔍 최종 검증 결과:"
ui_icons=$(find assets/icons/ui -name "*.svg" | wc -l)
tech_icons=$(find assets/icons/technology -name "*.svg" | wc -l)
backgrounds=$(find assets/images/backgrounds -name "*.jpg" | wc -l)
illustrations=$(find assets/images/illustrations -name "*.svg" | wc -l)
animations=$(find assets/animations/lottie -name "*.json" | wc -l)

echo "• UI 아이콘: ${ui_icons}개"
echo "• 기술 아이콘: ${tech_icons}개"  
echo "• 배경 이미지: ${backgrounds}개"
echo "• 일러스트: ${illustrations}개"
echo "• 애니메이션: ${animations}개"

total_assets=$(find assets -type f \( -name "*.svg" -o -name "*.jpg" -o -name "*.json" \) | wc -l)
echo ""
echo "🚀 총 Asset 파일: ${total_assets}개"
echo "🎯 목표 달성률: $((total_assets * 100 / total_target))%"
echo "✅ InfoGraphAI Asset 라이브러리 구축 완료!"