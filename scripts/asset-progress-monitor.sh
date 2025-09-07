#!/bin/bash

# Asset 다운로드 진행 상황 실시간 모니터링

echo "📊 InfoGraphAI Asset 수집 모니터링"
echo "================================="

# 30초마다 진행 상황 체크
while true; do
    clear
    echo "📊 InfoGraphAI Asset 수집 모니터링 - $(date '+%H:%M:%S')"
    echo "=================================================="
    echo ""
    
    # 현재 Asset 개수 세기
    ui_icons=$(find assets/icons/ui -name "*.svg" 2>/dev/null | wc -l)
    tech_icons=$(find assets/icons/technology -name "*.svg" 2>/dev/null | wc -l)
    backgrounds=$(find assets/images/backgrounds -name "*.jpg" 2>/dev/null | wc -l)
    illustrations=$(find assets/images/illustrations -name "*.svg" 2>/dev/null | wc -l)
    animations=$(find assets/animations/lottie -name "*.json" 2>/dev/null | wc -l)
    
    total=$((ui_icons + tech_icons + backgrounds + illustrations + animations))
    progress=$((total * 100 / 1000))
    
    echo "🎯 목표: 1000개 Asset | 현재: ${total}개 | 진행률: ${progress}%"
    echo ""
    
    # 프로그레스 바 생성
    bar_length=50
    filled_length=$((progress * bar_length / 100))
    
    printf "["
    for ((i=0; i<filled_length; i++)); do printf "█"; done
    for ((i=filled_length; i<bar_length; i++)); do printf "░"; done
    printf "] %d%%\n\n" "$progress"
    
    # 카테고리별 상세 현황
    echo "📁 카테고리별 현황:"
    echo "  🖼️  UI 아이콘:        ${ui_icons}개"
    echo "  ⚙️  기술 아이콘:      ${tech_icons}개"
    echo "  🌅 배경 이미지:       ${backgrounds}개"
    echo "  🎨 일러스트:         ${illustrations}개"
    echo "  🎬 애니메이션:        ${animations}개"
    echo ""
    
    # 품질 체크
    if [ $total -gt 200 ]; then
        echo "🔍 품질 검증 중..."
        fake_svgs=$(find assets -name "*.svg" -exec head -1 {} \; | grep -c -v "<svg" || true)
        fake_jpgs=$(find assets -name "*.jpg" -exec file {} \; | grep -c -v "JPEG" || true)
        
        if [ $fake_svgs -gt 0 ] || [ $fake_jpgs -gt 0 ]; then
            echo "⚠️  품질 이슈 발견: 가짜 SVG ${fake_svgs}개, 가짜 JPG ${fake_jpgs}개"
        else
            echo "✅ 모든 파일이 검증됨"
        fi
        echo ""
    fi
    
    # 속도 계산 (간단한 추정)
    if [ $total -gt 138 ]; then
        new_assets=$((total - 138))
        speed=$(echo "scale=1; $new_assets / 1" | bc -l 2>/dev/null || echo "N/A")
        echo "📈 다운로드 속도: ~${speed} 파일/분"
        
        if [ $progress -lt 100 ] && [ "$speed" != "N/A" ] && [ $(echo "$speed > 0" | bc -l) ]; then
            remaining=$((1000 - total))
            eta=$(echo "scale=0; $remaining / $speed" | bc -l 2>/dev/null || echo "N/A")
            echo "⏰ 예상 완료: ~${eta}분 후"
        fi
    fi
    
    echo ""
    echo "마지막 업데이트: $(date)"
    echo "Ctrl+C로 모니터링 종료"
    
    sleep 30
done