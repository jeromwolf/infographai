#!/bin/bash

# 다양한 스타일의 AI/ML 아이콘 생성 스크립트
# 각 도구별로 고유한 디자인 적용

echo "🎨 다양한 AI/ML 아이콘 재생성"
echo "========================="

# 기존 ml-tools 폴더 백업 후 새로 생성
mv assets/icons/ml-tools assets/icons/ml-tools-backup 2>/dev/null
mkdir -p assets/icons/ml-tools

count=0

# RAG System - 문서 + 검색 형태
echo "생성: rag-system-tool.svg"
cat > "assets/icons/ml-tools/rag-system-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="4" width="10" height="14" rx="2" fill="#059669" opacity="0.2"/>
  <rect x="4" y="6" width="8" height="1" fill="#059669"/>
  <rect x="4" y="8" width="8" height="1" fill="#059669"/>
  <rect x="4" y="10" width="6" height="1" fill="#059669"/>
  <circle cx="18" cy="8" r="3" stroke="#059669" stroke-width="2" fill="none"/>
  <path d="20 10l2 2" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
  <path d="13 12l3 3" stroke="#059669" stroke-width="1.5" stroke-linecap="round"/>
</svg>
EOF
count=$((count + 1))

# Prompt Template - 템플릿 형태
echo "생성: prompt-template-tool.svg"
cat > "assets/icons/ml-tools/prompt-template-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="3" width="16" height="18" rx="2" fill="#F59E0B" opacity="0.1" stroke="#F59E0B" stroke-width="1.5"/>
  <rect x="6" y="6" width="4" height="1" fill="#F59E0B"/>
  <rect x="12" y="6" width="6" height="1" fill="#F59E0B" opacity="0.5"/>
  <rect x="6" y="9" width="12" height="1" fill="#F59E0B"/>
  <rect x="6" y="12" width="8" height="1" fill="#F59E0B"/>
  <rect x="6" y="15" width="10" height="1" fill="#F59E0B" opacity="0.7"/>
  <circle cx="8" cy="18" r="1" fill="#F59E0B"/>
  <circle cx="12" cy="18" r="1" fill="#F59E0B"/>
  <circle cx="16" cy="18" r="1" fill="#F59E0B"/>
</svg>
EOF
count=$((count + 1))

# Model Training - 뇌 + 학습 곡선
echo "생성: model-training-tool.svg"
cat > "assets/icons/ml-tools/model-training-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C8.5 2 6 4.5 6 8c0 2 1 3.5 2.5 4.5L8 14h8l-.5-1.5C17 11.5 18 10 18 8c0-3.5-2.5-6-6-6z" fill="#3B82F6" opacity="0.3"/>
  <circle cx="10" cy="7" r="1" fill="#3B82F6"/>
  <circle cx="14" cy="7" r="1" fill="#3B82F6"/>
  <path d="M10 10c1 1 3 1 4 0" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M3 15l2 2 2-3 3 4 2-2 3 3 2-1" stroke="#3B82F6" stroke-width="2" fill="none" stroke-linecap="round"/>
  <rect x="2" y="20" width="20" height="1" fill="#3B82F6" opacity="0.3"/>
</svg>
EOF
count=$((count + 1))

# Embedding Vector - 화살표 벡터 
echo "생성: embedding-vector-tool.svg"
cat > "assets/icons/ml-tools/embedding-vector-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="11" width="20" height="2" fill="#8B5CF6" opacity="0.3"/>
  <path d="M6 8l6 4-6 4" stroke="#8B5CF6" stroke-width="2" fill="none" stroke-linejoin="round"/>
  <circle cx="16" cy="6" r="2" fill="#8B5CF6"/>
  <circle cx="19" cy="9" r="1.5" fill="#8B5CF6" opacity="0.7"/>
  <circle cx="17" cy="17" r="1.5" fill="#8B5CF6" opacity="0.7"/>
  <circle cx="20" cy="15" r="1" fill="#8B5CF6" opacity="0.5"/>
  <path d="M15 12h7" stroke="#8B5CF6" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M20 10l2 2-2 2" stroke="#8B5CF6" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
</svg>
EOF
count=$((count + 1))

# Agent Framework - 로봇 형태
echo "생성: agent-framework-tool.svg"
cat > "assets/icons/ml-tools/agent-framework-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="6" width="8" height="10" rx="3" fill="#DC2626" opacity="0.2" stroke="#DC2626" stroke-width="1.5"/>
  <circle cx="10" cy="9" r="1" fill="#DC2626"/>
  <circle cx="14" cy="9" r="1" fill="#DC2626"/>
  <rect x="10" y="12" width="4" height="1" fill="#DC2626"/>
  <rect x="6" y="10" width="2" height="4" rx="1" fill="#DC2626" opacity="0.7"/>
  <rect x="16" y="10" width="2" height="4" rx="1" fill="#DC2626" opacity="0.7"/>
  <circle cx="5" cy="12" r="1" fill="#DC2626"/>
  <circle cx="19" cy="12" r="1" fill="#DC2626"/>
  <rect x="10" y="16" width="4" height="2" rx="1" fill="#DC2626" opacity="0.5"/>
  <path d="M12 4v2M8 5l1 1M16 5l-1 1" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round"/>
</svg>
EOF
count=$((count + 1))

# Data Pipeline - 파이프 형태
echo "생성: data-pipeline-tool.svg"
cat > "assets/icons/ml-tools/data-pipeline-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="11" width="4" height="2" rx="1" fill="#0891B2"/>
  <rect x="8" y="11" width="4" height="2" rx="1" fill="#0891B2"/>
  <rect x="14" y="11" width="4" height="2" rx="1" fill="#0891B2"/>
  <rect x="20" y="11" width="2" height="2" rx="1" fill="#0891B2"/>
  <path d="M6 12h2M12 12h2M18 12h2" stroke="#0891B2" stroke-width="1.5"/>
  <rect x="3" y="6" width="2" height="4" fill="#0891B2" opacity="0.3"/>
  <rect x="9" y="8" width="2" height="2" fill="#0891B2" opacity="0.5"/>
  <rect x="15" y="5" width="2" height="6" fill="#0891B2" opacity="0.4"/>
  <path d="M4 10v1M10 10v1M16 11v1" stroke="#0891B2" stroke-width="1"/>
  <circle cx="4" cy="18" r="2" fill="#0891B2" opacity="0.3"/>
  <circle cx="10" cy="17" r="1.5" fill="#0891B2" opacity="0.4"/>
  <circle cx="16" cy="18" r="1.5" fill="#0891B2" opacity="0.4"/>
</svg>
EOF
count=$((count + 1))

# Model Optimization - 기어 형태
echo "생성: model-optimization-tool.svg"
cat > "assets/icons/ml-tools/model-optimization-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="8" fill="none" stroke="#BE185D" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="3" fill="#BE185D" opacity="0.3"/>
  <rect x="11" y="2" width="2" height="4" rx="1" fill="#BE185D"/>
  <rect x="11" y="18" width="2" height="4" rx="1" fill="#BE185D"/>
  <rect x="18" y="11" width="4" height="2" rx="1" fill="#BE185D"/>
  <rect x="2" y="11" width="4" height="2" rx="1" fill="#BE185D"/>
  <rect x="17.5" y="5.5" width="2" height="2" rx="0.5" fill="#BE185D" opacity="0.7" transform="rotate(45 18.5 6.5)"/>
  <rect x="4.5" y="16.5" width="2" height="2" rx="0.5" fill="#BE185D" opacity="0.7" transform="rotate(45 5.5 17.5)"/>
  <rect x="17.5" y="16.5" width="2" height="2" rx="0.5" fill="#BE185D" opacity="0.7" transform="rotate(45 18.5 17.5)"/>
  <rect x="4.5" y="5.5" width="2" height="2" rx="0.5" fill="#BE185D" opacity="0.7" transform="rotate(45 5.5 6.5)"/>
</svg>
EOF
count=$((count + 1))

# Experiment Tracking - 차트 형태
echo "생성: experiment-tracking-tool.svg"
cat > "assets/icons/ml-tools/experiment-tracking-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="#7C2D12" stroke-width="1.5"/>
  <path d="M3 18l3-3 2 2 3-4 2 1 3-3 2 2 3-1" stroke="#7C2D12" stroke-width="2" fill="none" stroke-linecap="round"/>
  <rect x="6" y="6" width="2" height="1" fill="#7C2D12"/>
  <rect x="10" y="6" width="3" height="1" fill="#7C2D12" opacity="0.7"/>
  <rect x="15" y="6" width="2" height="1" fill="#7C2D12" opacity="0.5"/>
  <circle cx="6" cy="15" r="1" fill="#7C2D12"/>
  <circle cx="9" cy="13" r="1" fill="#7C2D12"/>
  <circle cx="12" cy="11" r="1" fill="#7C2D12"/>
  <circle cx="15" cy="10" r="1" fill="#7C2D12"/>
  <circle cx="18" cy="9" r="1" fill="#7C2D12"/>
</svg>
EOF
count=$((count + 1))

# Few-shot Prompting - 타겟 형태
echo "생성: few-shot-prompting-tool.svg"
cat > "assets/icons/ml-tools/few-shot-prompting-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="8" fill="none" stroke="#EA580C" stroke-width="2"/>
  <circle cx="12" cy="12" r="5" fill="none" stroke="#EA580C" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="2" fill="#EA580C"/>
  <rect x="11" y="2" width="2" height="3" fill="#EA580C" opacity="0.7"/>
  <rect x="11" y="19" width="2" height="3" fill="#EA580C" opacity="0.7"/>
  <rect x="19" y="11" width="3" height="2" fill="#EA580C" opacity="0.7"/>
  <rect x="2" y="11" width="3" height="2" fill="#EA580C" opacity="0.7"/>
  <circle cx="7" cy="7" r="1" fill="#EA580C" opacity="0.5"/>
  <circle cx="17" cy="7" r="1" fill="#EA580C" opacity="0.5"/>
  <circle cx="7" cy="17" r="1" fill="#EA580C" opacity="0.5"/>
  <circle cx="17" cy="17" r="1" fill="#EA580C" opacity="0.5"/>
</svg>
EOF
count=$((count + 1))

# GPU Acceleration - GPU 칩 형태
echo "생성: gpu-acceleration-tool.svg"
cat > "assets/icons/ml-tools/gpu-acceleration-tool.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="6" width="16" height="12" rx="2" fill="#6B7280" opacity="0.2" stroke="#6B7280" stroke-width="1.5"/>
  <rect x="6" y="8" width="4" height="3" fill="#6B7280"/>
  <rect x="14" y="8" width="4" height="3" fill="#6B7280"/>
  <rect x="6" y="13" width="4" height="3" fill="#6B7280" opacity="0.7"/>
  <rect x="14" y="13" width="4" height="3" fill="#6B7280" opacity="0.7"/>
  <rect x="11" y="10" width="2" height="4" fill="#6B7280" opacity="0.5"/>
  <path d="M2 10h2M20 10h2M2 14h2M20 14h2" stroke="#6B7280" stroke-width="1.5"/>
  <path d="M8 4v2M12 4v2M16 4v2" stroke="#6B7280" stroke-width="1"/>
  <path d="M12 18v2" stroke="#6B7280" stroke-width="2"/>
  <circle cx="8" cy="20" r="1" fill="#6B7280"/>
  <circle cx="16" cy="20" r="1" fill="#6B7280"/>
</svg>
EOF
count=$((count + 1))

echo ""
echo "🎨 다양한 AI/ML 아이콘 생성 완료!"
echo "================================"
echo "생성된 아이콘: ${count}개"
echo "✅ 각 도구별 고유한 디자인 적용"
echo "✅ RAG, 프롬프트, 모델 훈련, 벡터, 에이전트 등 차별화"