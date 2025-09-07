#!/bin/bash

# InfoGraphAI Asset 그룹 체계 재정의
# 효율성 중심의 실용적 분류

echo "📂 InfoGraphAI Asset 그룹 체계 재정의"
echo "=================================="

# 새로운 그룹 구조 생성
mkdir -p assets/groups/{core,ai-ml,visuals,templates}

echo ""
echo "🎯 핵심 그룹 4개로 재구성:"
echo "------------------------"

# 1. Core Group - 기본 필수 아이콘들
echo "📦 1. CORE - 기본 필수 (UI + 기술)"
core_count=0

# UI 필수 아이콘만 선별 (20개 정도)
essential_ui="arrow-right arrow-left arrow-up arrow-down plus minus check x-mark home user settings play pause search menu close edit delete save upload download"

for icon in $essential_ui; do
    if [ -f "assets/icons/ui/${icon}.svg" ]; then
        ln -sf "../../icons/ui/${icon}.svg" "assets/groups/core/${icon}.svg" 2>/dev/null
        core_count=$((core_count + 1))
    fi
done

# 핵심 기술 아이콘 (10개)
essential_tech="react javascript typescript python nodejs docker kubernetes github git postgresql"

for icon in $essential_tech; do
    if [ -f "assets/icons/technology/${icon}.svg" ]; then
        ln -sf "../../icons/technology/${icon}.svg" "assets/groups/core/${icon}.svg" 2>/dev/null
        core_count=$((core_count + 1))
    fi
done

echo "  ✅ 핵심 필수: ${core_count}개"

# 2. AI-ML Group - AI/ML 통합
echo "📦 2. AI-ML - 인공지능/머신러닝"
ai_count=0

# AI 아이콘들 통합
if [ -d "assets/icons/ai" ]; then
    for file in assets/icons/ai/*.svg; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            ln -sf "../../icons/ai/${filename}" "assets/groups/ai-ml/${filename}" 2>/dev/null
            ai_count=$((ai_count + 1))
        fi
    done
fi

# ML 도구들 통합
if [ -d "assets/icons/ml-tools" ]; then
    for file in assets/icons/ml-tools/*.svg; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            ln -sf "../../icons/ml-tools/${filename}" "assets/groups/ai-ml/ml-${filename}" 2>/dev/null
            ai_count=$((ai_count + 1))
        fi
    done
fi

echo "  ✅ AI/ML 통합: ${ai_count}개"

# 3. Visuals Group - 시각 자료 통합
echo "📦 3. VISUALS - 시각 자료"
visual_count=0

# 배경 이미지 (대표 10개만)
bg_count=0
for file in assets/images/backgrounds/*.jpg; do
    if [ -f "$file" ] && [ $bg_count -lt 10 ]; then
        filename=$(basename "$file")
        ln -sf "../../images/backgrounds/${filename}" "assets/groups/visuals/${filename}" 2>/dev/null
        visual_count=$((visual_count + 1))
        bg_count=$((bg_count + 1))
    fi
done

# 일러스트 (대표 10개만)
ill_count=0
for file in assets/images/illustrations/*.svg; do
    if [ -f "$file" ] && [ $ill_count -lt 10 ]; then
        filename=$(basename "$file")
        ln -sf "../../images/illustrations/${filename}" "assets/groups/visuals/${filename}" 2>/dev/null
        visual_count=$((visual_count + 1))
        ill_count=$((ill_count + 1))
    fi
done

echo "  ✅ 시각 자료: ${visual_count}개 (배경 ${bg_count}개, 일러스트 ${ill_count}개)"

# 4. Templates Group - 템플릿용
echo "📦 4. TEMPLATES - 템플릿용"
template_count=0

# 나머지 UI 아이콘들
for file in assets/icons/ui/*.svg; do
    filename=$(basename "$file" .svg)
    if [[ ! " $essential_ui " =~ " $filename " ]]; then
        ln -sf "../../icons/ui/${filename}.svg" "assets/groups/templates/${filename}.svg" 2>/dev/null
        template_count=$((template_count + 1))
    fi
done

# 나머지 기술 아이콘들  
for file in assets/icons/technology/*.svg; do
    filename=$(basename "$file" .svg)
    if [[ ! " $essential_tech " =~ " $filename " ]]; then
        ln -sf "../../icons/technology/${filename}.svg" "assets/groups/templates/tech-${filename}.svg" 2>/dev/null
        template_count=$((template_count + 1))
    fi
done

echo "  ✅ 템플릿용: ${template_count}개"

# 그룹 매니페스트 생성
cat > "assets/groups/manifest.json" << EOF
{
  "infographai_asset_groups": {
    "version": "1.0",
    "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "total_assets": $((core_count + ai_count + visual_count + template_count)),
    "groups": {
      "core": {
        "name": "Core Essentials",
        "description": "기본 필수 아이콘 (UI + 핵심 기술)",
        "count": $core_count,
        "usage": "모든 영상에서 기본 사용"
      },
      "ai-ml": {
        "name": "AI/ML Specialized", 
        "description": "인공지능/머신러닝 전문 아이콘",
        "count": $ai_count,
        "usage": "AI 교육 영상 특화"
      },
      "visuals": {
        "name": "Visual Assets",
        "description": "배경 이미지 및 일러스트",
        "count": $visual_count,
        "usage": "영상 배경 및 시각적 요소"
      },
      "templates": {
        "name": "Template Library",
        "description": "추가 아이콘 라이브러리", 
        "count": $template_count,
        "usage": "특수 목적 및 확장 사용"
      }
    }
  }
}
EOF

echo ""
echo "🎉 Asset 그룹 재정의 완료!"
echo "========================"
echo "📊 효율적 4-그룹 체계:"
echo "  🎯 CORE: ${core_count}개 - 필수 기본"
echo "  🤖 AI-ML: ${ai_count}개 - 전문 특화" 
echo "  🎨 VISUALS: ${visual_count}개 - 시각 자료"
echo "  📚 TEMPLATES: ${template_count}개 - 확장 라이브러리"
echo ""
echo "총 $(($core_count + $ai_count + $visual_count + $template_count))개 Asset을 4개 그룹으로 효율적 관리"
echo "✅ 개발자 친화적 구조 완성!"