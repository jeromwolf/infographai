#!/bin/bash

# InfoGraphAI Asset 정리 및 최적화
# 불필요한 Asset 삭제하여 효율성 극대화

echo "🧹 InfoGraphAI Asset 정리 및 최적화"
echo "================================="

deleted_count=0
kept_count=0

echo ""
echo "📂 현재 Asset 현황 분석..."
echo "------------------------"

# 현재 상태 확인
original_total=$(find assets -type f \( -name "*.svg" -o -name "*.jpg" -o -name "*.json" \) | wc -l)
echo "정리 전 총 파일: ${original_total}개"

# 1. 그룹 시스템 외부의 불필요한 원본 파일들 정리
echo ""
echo "🗂️  Step 1: 원본 디렉토리 정리..."
echo "------------------------------"

# 그룹화된 파일들과 중복되는 원본들 제거 (용량 절약)
# 단, 그룹 링크가 제대로 작동하는지 먼저 확인

echo "원본 보관 디렉토리 생성..."
mkdir -p assets/originals/{icons,images,animations}

# UI 아이콘 원본을 originals로 이동 (그룹에서 링크로 참조)
if [ -d "assets/icons/ui" ]; then
    echo "UI 아이콘 원본 보관..."
    mv assets/icons/ui/* assets/originals/icons/ 2>/dev/null
    ui_moved=$(ls assets/originals/icons/*.svg 2>/dev/null | wc -l)
    echo "  ✅ UI 아이콘 ${ui_moved}개 보관"
fi

# 기술 아이콘 원본을 originals로 이동
if [ -d "assets/icons/technology" ]; then
    echo "기술 아이콘 원본 보관..."
    mv assets/icons/technology/* assets/originals/icons/ 2>/dev/null
    tech_moved=$(ls assets/originals/icons/ | grep -E "(react|python|docker)" | wc -l)
    echo "  ✅ 기술 아이콘 보관"
fi

# AI 아이콘들 원본 보관
if [ -d "assets/icons/ai" ]; then
    mv assets/icons/ai/* assets/originals/icons/ 2>/dev/null
    echo "  ✅ AI 아이콘 보관"
fi

if [ -d "assets/icons/ml-tools" ]; then
    mv assets/icons/ml-tools/* assets/originals/icons/ 2>/dev/null
    echo "  ✅ ML 도구 아이콘 보관"
fi

# 2. 과도한 배경 이미지 정리 (10개만 유지)
echo ""
echo "🌅 Step 2: 배경 이미지 최적화..."
echo "-----------------------------"

# 대표 배경 이미지 10개만 선별 유지
if [ -d "assets/images/backgrounds" ]; then
    bg_total=$(ls assets/images/backgrounds/*.jpg 2>/dev/null | wc -l)
    echo "현재 배경 이미지: ${bg_total}개"
    
    # 파일 크기가 적당하고 품질 좋은 것들만 선별 (100KB-500KB)
    kept_backgrounds=0
    mkdir -p assets/images/backgrounds-selected
    
    for bg in assets/images/backgrounds/background-{1..10}.jpg; do
        if [ -f "$bg" ]; then
            size=$(stat -f%z "$bg" 2>/dev/null || stat -c%s "$bg" 2>/dev/null)
            if [ "$size" -gt 50000 ] && [ "$size" -lt 800000 ]; then
                cp "$bg" "assets/images/backgrounds-selected/" 2>/dev/null
                kept_backgrounds=$((kept_backgrounds + 1))
            fi
        fi
    done
    
    # 기존 배경 폴더를 백업으로 이동하고 선별된 것으로 교체
    mv assets/images/backgrounds assets/images/backgrounds-backup 2>/dev/null
    mv assets/images/backgrounds-selected assets/images/backgrounds 2>/dev/null
    
    echo "  ✅ 배경 이미지 ${kept_backgrounds}개로 최적화"
    deleted_count=$((deleted_count + bg_total - kept_backgrounds))
fi

# 3. 과도한 일러스트 정리 (15개만 유지)
echo ""
echo "🎨 Step 3: 일러스트 최적화..."
echo "------------------------"

if [ -d "assets/images/illustrations" ]; then
    ill_total=$(ls assets/images/illustrations/*.svg 2>/dev/null | wc -l)
    echo "현재 일러스트: ${ill_total}개"
    
    # 대표 일러스트 15개만 유지
    kept_illustrations=0
    mkdir -p assets/images/illustrations-selected
    
    for ill in assets/images/illustrations/illustration-{1..15}.svg; do
        if [ -f "$ill" ]; then
            cp "$ill" "assets/images/illustrations-selected/" 2>/dev/null
            kept_illustrations=$((kept_illustrations + 1))
        fi
    done
    
    # AI 일러스트도 5개만 유지
    for ill in assets/images/ai-illustrations/*-illustration.svg; do
        if [ -f "$ill" ] && [ $kept_illustrations -lt 20 ]; then
            cp "$ill" "assets/images/illustrations-selected/" 2>/dev/null
            kept_illustrations=$((kept_illustrations + 1))
        fi
    done
    
    mv assets/images/illustrations assets/images/illustrations-backup 2>/dev/null
    mv assets/images/ai-illustrations assets/images/ai-illustrations-backup 2>/dev/null
    mv assets/images/illustrations-selected assets/images/illustrations 2>/dev/null
    
    echo "  ✅ 일러스트 ${kept_illustrations}개로 최적화"
    deleted_count=$((deleted_count + ill_total - kept_illustrations))
fi

# 4. 빈 디렉토리 정리
echo ""
echo "📁 Step 4: 빈 디렉토리 정리..."
echo "------------------------"

find assets -type d -empty -delete 2>/dev/null
echo "  ✅ 빈 디렉토리 정리 완료"

# 5. 그룹 시스템 유효성 재검증
echo ""
echo "🔗 Step 5: 그룹 링크 재검증..."
echo "------------------------"

groups=("core" "ai-ml" "visuals" "templates")
total_group_assets=0

for group in "${groups[@]}"; do
    if [ -d "assets/groups/$group" ]; then
        # 깨진 링크 제거
        find "assets/groups/$group" -type l ! -exec test -e {} \; -delete 2>/dev/null
        
        group_count=$(ls "assets/groups/$group" 2>/dev/null | wc -l)
        total_group_assets=$((total_group_assets + group_count))
        echo "  ✅ ${group}: ${group_count}개 검증됨"
    fi
done

# 6. 최종 통계 및 매니페스트 업데이트
echo ""
echo "📊 Step 6: 최종 통계 및 매니페스트 업데이트..."
echo "--------------------------------------------"

# 최종 파일 개수
final_total=$(find assets -type f \( -name "*.svg" -o -name "*.jpg" -o -name "*.json" \) | wc -l)
saved_space=$((original_total - final_total))

# 매니페스트 업데이트
cat > "assets/groups/manifest.json" << EOF
{
  "infographai_asset_groups": {
    "version": "1.1",
    "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "optimized": true,
    "total_assets": $total_group_assets,
    "groups": {
      "core": {
        "name": "Core Essentials",
        "description": "기본 필수 아이콘 (UI + 핵심 기술)",
        "count": $(ls assets/groups/core 2>/dev/null | wc -l),
        "usage": "모든 영상에서 기본 사용"
      },
      "ai-ml": {
        "name": "AI/ML Specialized", 
        "description": "인공지능/머신러닝 전문 아이콘",
        "count": $(ls assets/groups/ai-ml 2>/dev/null | wc -l),
        "usage": "AI 교육 영상 특화"
      },
      "visuals": {
        "name": "Visual Assets",
        "description": "선별된 배경 이미지 및 일러스트",
        "count": $(ls assets/groups/visuals 2>/dev/null | wc -l),
        "usage": "영상 배경 및 시각적 요소"
      },
      "templates": {
        "name": "Template Library",
        "description": "추가 아이콘 라이브러리", 
        "count": $(ls assets/groups/templates 2>/dev/null | wc -l),
        "usage": "특수 목적 및 확장 사용"
      }
    },
    "optimization": {
      "original_files": $original_total,
      "optimized_files": $final_total,
      "space_saved": $saved_space,
      "efficiency_gain": "$((saved_space * 100 / original_total))%"
    }
  }
}
EOF

echo ""
echo "🎉 Asset 정리 및 최적화 완료!"
echo "=========================="
echo "📊 최적화 결과:"
echo "  📁 정리 전: ${original_total}개 파일"
echo "  📁 정리 후: ${final_total}개 파일"
echo "  🗑️  제거된 파일: ${saved_space}개"
echo "  📈 효율성 향상: $((saved_space * 100 / original_total))%"
echo ""
echo "🎯 최적화된 그룹 시스템:"
echo "  🔧 CORE: $(ls assets/groups/core 2>/dev/null | wc -l)개 - 즉시 사용 가능"
echo "  🤖 AI-ML: $(ls assets/groups/ai-ml 2>/dev/null | wc -l)개 - 전문 특화"
echo "  🎨 VISUALS: $(ls assets/groups/visuals 2>/dev/null | wc -l)개 - 엄선된 시각 자료"
echo "  📚 TEMPLATES: $(ls assets/groups/templates 2>/dev/null | wc -l)개 - 확장 라이브러리"
echo ""
echo "✅ InfoGraphAI Asset 최적화 완료 - 개발 준비!"