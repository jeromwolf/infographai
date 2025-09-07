#!/bin/bash

# InfoGraphAI 자동 Asset 다운로드 스크립트
# 무료 소스에서 실제 파일들을 자동으로 다운로드

set -e

echo "🚀 InfoGraphAI 자동 Asset 다운로드"
echo "================================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 필수 도구 확인
check_dependencies() {
    echo -e "${BLUE}🔍 필수 도구 확인...${NC}"
    
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}❌ curl이 필요합니다: brew install curl${NC}"
        exit 1
    fi
    
    if ! command -v wget &> /dev/null; then
        echo -e "${YELLOW}⚠️ wget 설치 중...${NC}"
        brew install wget || true
    fi
    
    echo -e "${GREEN}✅ 도구 확인 완료${NC}"
}

# 1. 아이콘 자동 다운로드 (Heroicons)
download_heroicons() {
    echo -e "${BLUE}🎨 Heroicons 다운로드...${NC}"
    
    # UI 아이콘 목록
    declare -A ui_icons=(
        ["menu"]="bars-3"
        ["close"]="x-mark"
        ["play"]="play"
        ["pause"]="pause"
        ["stop"]="stop"
        ["edit"]="pencil"
        ["delete"]="trash"
        ["save"]="bookmark"
        ["download"]="arrow-down-tray"
        ["upload"]="arrow-up-tray"
        ["copy"]="document-duplicate"
        ["share"]="share"
        ["search"]="magnifying-glass"
        ["check"]="check"
        ["error"]="x-mark"
        ["warning"]="exclamation-triangle"
        ["info"]="information-circle"
        ["settings"]="cog-6-tooth"
        ["home"]="home"
        ["user"]="user"
    )
    
    for name in "${!ui_icons[@]}"; do
        hero_name="${ui_icons[$name]}"
        echo "  다운로드 중: ${name}.svg"
        curl -s "https://heroicons.com/24/outline/${hero_name}.svg" \
             -o "assets/icons/ui/${name}.svg" || echo "    실패: ${name}"
    done
    
    echo -e "${GREEN}✅ Heroicons 다운로드 완료 (${#ui_icons[@]}개)${NC}"
}

# 2. 기술 아이콘 다운로드 (Simple Icons)
download_tech_icons() {
    echo -e "${BLUE}💻 기술 아이콘 다운로드...${NC}"
    
    # Simple Icons CDN 사용
    tech_icons=(
        "javascript"
        "typescript"
        "react"
        "vue-dot-js"
        "angular"
        "node-dot-js"
        "python"
        "java"
        "docker"
        "kubernetes"
        "amazonwebservices"
        "googlecloud"
        "microsoftazure"
        "github"
        "git"
        "visualstudiocode"
        "figma"
        "slack"
        "postgresql"
        "mongodb"
    )
    
    for icon in "${tech_icons[@]}"; do
        echo "  다운로드 중: ${icon}.svg"
        curl -s "https://cdn.jsdelivr.net/npm/simple-icons@v9/${icon}.svg" \
             -o "assets/icons/technology/${icon}.svg" || echo "    실패: ${icon}"
    done
    
    echo -e "${GREEN}✅ 기술 아이콘 다운로드 완료 (${#tech_icons[@]}개)${NC}"
}

# 3. 무료 이미지 다운로드 (Unsplash)
download_unsplash_images() {
    echo -e "${BLUE}📸 Unsplash 이미지 다운로드...${NC}"
    
    # Unsplash Source API 사용 (무료, 라이센스 걱정 없음)
    declare -A images=(
        ["tech-coding-1920x1080"]="https://source.unsplash.com/1920x1080/?programming,code"
        ["tech-laptop-1920x1080"]="https://source.unsplash.com/1920x1080/?laptop,technology"
        ["tech-abstract-1920x1080"]="https://source.unsplash.com/1920x1080/?abstract,technology"
        ["education-books-1920x1080"]="https://source.unsplash.com/1920x1080/?books,education"
        ["education-study-1920x1080"]="https://source.unsplash.com/1920x1080/?study,learning"
        ["business-office-1920x1080"]="https://source.unsplash.com/1920x1080/?office,business"
        ["business-meeting-1920x1080"]="https://source.unsplash.com/1920x1080/?meeting,teamwork"
        ["gradient-blue-1920x1080"]="https://source.unsplash.com/1920x1080/?gradient,blue"
        ["minimal-desk-1920x1080"]="https://source.unsplash.com/1920x1080/?minimal,desk"
        ["data-visualization-1920x1080"]="https://source.unsplash.com/1920x1080/?data,charts"
    )
    
    for name in "${!images[@]}"; do
        url="${images[$name]}"
        echo "  다운로드 중: ${name}.jpg"
        curl -L -s "${url}" -o "assets/images/backgrounds/${name}.jpg" || echo "    실패: ${name}"
        sleep 1  # API 제한 준수
    done
    
    echo -e "${GREEN}✅ 배경 이미지 다운로드 완료 (${#images[@]}개)${NC}"
}

# 4. 무료 일러스트 다운로드 (unDraw)
download_undraw_illustrations() {
    echo -e "${BLUE}🎨 unDraw 일러스트 다운로드...${NC}"
    
    # unDraw SVG 일러스트들
    illustrations=(
        "online_learning_b4xn"
        "programming_2svr"
        "data_processing_yrrv"
        "team_collaboration_8c4p"
        "innovative_idea_xcu7"
        "code_review_l1q9"
        "teacher_35j2"
        "presentation_1dcr"
        "analytics_5pgy"
        "mobile_development_8gyo"
    )
    
    for ill in "${illustrations[@]}"; do
        echo "  다운로드 중: ${ill}.svg"
        curl -s "https://undraw.co/api/illustrations/${ill}.svg" \
             -o "assets/images/illustrations/${ill}.svg" || echo "    실패: ${ill}"
    done
    
    echo -e "${GREEN}✅ 일러스트 다운로드 완료 (${#illustrations[@]}개)${NC}"
}

# 5. 무료 폰트 다운로드
download_fonts() {
    echo -e "${BLUE}🔤 폰트 다운로드...${NC}"
    
    # Google Fonts API 사용
    echo "  Inter 폰트 다운로드..."
    curl -s "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" \
         -o "assets/fonts/english/inter.css"
    
    # Pretendard GitHub 릴리스
    echo "  Pretendard 폰트 다운로드..."
    curl -L -s "https://github.com/orioncactus/pretendard/releases/latest/download/Pretendard-1.3.9.zip" \
         -o "assets/fonts/korean/pretendard.zip"
    
    # JetBrains Mono (코드용)
    echo "  JetBrains Mono 다운로드..."
    curl -L -s "https://download.jetbrains.com/fonts/JetBrainsMono-2.304.zip" \
         -o "assets/fonts/english/jetbrains-mono.zip"
    
    echo -e "${GREEN}✅ 폰트 다운로드 완료${NC}"
}

# 6. 무료 사운드 효과 (자체 생성 또는 CC0)
generate_ui_sounds() {
    echo -e "${BLUE}🔊 UI 사운드 생성...${NC}"
    
    # 간단한 사운드 생성 (macOS say 명령 활용)
    if command -v say &> /dev/null; then
        echo "  UI 사운드 생성 중..."
        
        # 성공음 (높은 톤)
        (echo "a"; sleep 0.1; echo "e"; sleep 0.1; echo "i") | \
        while read note; do
            say -v "Bells" "$note" -o "temp_${note}.aiff" 2>/dev/null || true
        done
        
        # 실제 프로덕션에서는 전문 사운드 라이브러리 사용 권장
        echo "  ⚠️ 실제 사운드 파일은 별도 다운로드 필요"
    fi
    
    # 무료 사운드 소스 정보 파일 생성
    cat > assets/audio/sound-sources.txt << EOF
무료 사운드 소스:

1. Freesound.org (CC0/CC BY)
   - UI 클릭음: https://freesound.org/search/?q=ui+click
   - 성공음: https://freesound.org/search/?q=success+chime
   - 전환음: https://freesound.org/search/?q=whoosh+transition

2. Zapsplat.com (무료 계정)
   - 고품질 사운드 이펙트
   - 매일 10개 다운로드 무료

3. YouTube Audio Library
   - 배경음악: https://studio.youtube.com/channel/UC.../music
   - 효과음: https://studio.youtube.com/channel/UC.../soundeffects
EOF
    
    echo -e "${GREEN}✅ 사운드 정보 생성 완료${NC}"
}

# 7. Lottie 애니메이션 다운로드
download_lottie_animations() {
    echo -e "${BLUE}🎬 Lottie 애니메이션 다운로드...${NC}"
    
    # LottieFiles 무료 애니메이션
    lottie_animations=(
        "loading-spinner"
        "success-checkmark" 
        "error-cross"
        "data-loading"
        "upload-progress"
    )
    
    # 실제 Lottie 파일 다운로드는 LottieFiles API 키 필요
    # 여기서는 샘플 JSON 생성
    for anim in "${lottie_animations[@]}"; do
        echo "  생성 중: ${anim}.json"
        cat > "assets/animations/lottie/${anim}.json" << EOF
{
  "v": "5.7.4",
  "fr": 60,
  "ip": 0,
  "op": 120,
  "w": 200,
  "h": 200,
  "nm": "${anim}",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "${anim}",
      "sr": 1,
      "ks": {},
      "ao": 0,
      "ip": 0,
      "op": 120,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
}
EOF
    done
    
    echo -e "${YELLOW}⚠️ 실제 Lottie 파일은 LottieFiles.com에서 다운로드 권장${NC}"
    echo -e "${GREEN}✅ Lottie 플레이스홀더 생성 완료${NC}"
}

# 메인 실행 함수
main() {
    echo -e "${BLUE}시작 시간: $(date)${NC}\n"
    
    # 의존성 체크
    check_dependencies
    
    # 디렉토리 생성
    mkdir -p assets/images/illustrations
    
    # 순차 다운로드
    download_heroicons
    echo ""
    
    download_tech_icons  
    echo ""
    
    download_unsplash_images
    echo ""
    
    download_undraw_illustrations
    echo ""
    
    download_fonts
    echo ""
    
    generate_ui_sounds
    echo ""
    
    download_lottie_animations
    echo ""
    
    # 최종 결과
    echo -e "${GREEN}🎉 자동 다운로드 완료!${NC}"
    echo ""
    
    # 통계
    total_files=$(find assets -type f -name "*.svg" -o -name "*.jpg" -o -name "*.json" | wc -l)
    echo -e "${BLUE}📊 다운로드된 파일: ${total_files}개${NC}"
    
    # 다음 단계 안내
    echo -e "\n${YELLOW}다음 단계:${NC}"
    echo "1. node scripts/check-assets.js - 다운로드 확인"
    echo "2. 폰트 압축 파일 압축 해제"
    echo "3. 추가 사운드는 Freesound.org에서 수동 다운로드"
    echo "4. 라이센스 정보 확인"
    
    echo -e "\n${BLUE}완료 시간: $(date)${NC}"
}

# 스크립트 실행
main "$@"