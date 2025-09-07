#!/bin/bash

# AI 관련 Asset 전용 수집 스크립트
# InfoGraphAI를 위한 AI/ML 특화 아이콘 및 일러스트

echo "🤖 AI 관련 Asset 전용 수집"
echo "========================="

download_count=0
mkdir -p assets/icons/ai
mkdir -p assets/images/ai-illustrations
mkdir -p assets/icons/ml-tools

# Phase 1: AI/ML 기술 브랜드 아이콘
echo ""
echo "🧠 Phase 1: AI/ML 기술 브랜드..."
echo "------------------------------"

# AI/ML 플랫폼 및 도구
ai_brands="openai anthropic google-gemini microsoft-copilot huggingface tensorflow pytorch keras scikit-learn jupyter anaconda nvidia cuda-x streamlit gradio wandb mlflow dvc airflow kubeflow ray apache-spark databricks snowflake opencv langchain llamaindex pinecone weaviate chroma qdrant milvus faiss elasticsearch opensearch vector-database"

for icon in $ai_brands; do
    echo "  다운로드: ${icon}.svg"
    
    curl -s "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${icon}.svg" \
         -o "assets/icons/ai/${icon}.svg"
    
    if head -1 "assets/icons/ai/${icon}.svg" | grep -q "<svg"; then
        download_count=$((download_count + 1))
        echo "    ✅ 성공 (${download_count}개)"
    else
        # simple-icons에 없는 경우 대체 소스 시도
        rm "assets/icons/ai/${icon}.svg" 2>/dev/null
        echo "    ⚠️  대체 소스 시도..."
        
        # 대체 소스로 직접 생성
        case $icon in
            "google-gemini")
                cat > "assets/icons/ai/${icon}.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9L8.91 8.26L12 2Z" fill="#4285F4"/>
  <circle cx="12" cy="12" r="3" fill="white"/>
</svg>
EOF
                download_count=$((download_count + 1))
                echo "    ✅ 생성 완료 (${download_count}개)"
                ;;
            "microsoft-copilot")
                cat > "assets/icons/ai/${icon}.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="6" width="18" height="12" rx="2" fill="#0078D4"/>
  <path d="M8 10h8v1H8v-1zm0 2h8v1H8v-1zm0 2h5v1H8v-1z" fill="white"/>
  <circle cx="19" cy="5" r="2" fill="#FF6B6B"/>
</svg>
EOF
                download_count=$((download_count + 1))
                echo "    ✅ 생성 완료 (${download_count}개)"
                ;;
            "vector-database")
                cat > "assets/icons/ai/${icon}.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="4" width="20" height="3" rx="1" fill="#8B5CF6"/>
  <rect x="2" y="9" width="20" height="3" rx="1" fill="#A78BFA"/>
  <rect x="2" y="14" width="20" height="3" rx="1" fill="#C4B5FD"/>
  <path d="M18 2l2 2-2 2-2-2 2-2z" fill="#F59E0B"/>
</svg>
EOF
                download_count=$((download_count + 1))
                echo "    ✅ 생성 완료 (${download_count}개)"
                ;;
        esac
    fi
    sleep 0.2
done

# Phase 2: AI 개념 아이콘 생성
echo ""
echo "🧠 Phase 2: AI 개념 아이콘 생성..."
echo "--------------------------------"

ai_concepts="neural-network machine-learning deep-learning artificial-intelligence robot chatbot automation algorithm data-science natural-language-processing computer-vision reinforcement-learning generative-ai large-language-model transformer attention-mechanism gradient-descent backpropagation convolutional-network recurrent-network gan-network decision-tree random-forest support-vector-machine clustering classification regression feature-engineering model-training model-validation cross-validation hyperparameter-tuning ensemble-learning transfer-learning fine-tuning prompt-engineering chain-of-thought few-shot-learning zero-shot-learning multimodal-ai edge-ai federated-learning explainable-ai responsible-ai ai-ethics ai-safety"

for concept in $ai_concepts; do
    filename="${concept}-icon"
    echo "  생성: ${filename}.svg"
    
    # 컨셉별 색상 설정
    case $concept in
        *"neural"*|*"network"*) color="#8B5CF6" ;;
        *"machine"*|*"learning"*) color="#3B82F6" ;;
        *"deep"*|*"ai"*) color="#1D4ED8" ;;
        *"robot"*|*"chatbot"*) color="#059669" ;;
        *"data"*|*"algorithm"*) color="#DC2626" ;;
        *"vision"*|*"language"*) color="#EA580C" ;;
        *"model"*|*"training"*) color="#7C2D12" ;;
        *"prompt"*|*"chat"*) color="#BE185D" ;;
        *"edge"*|*"federated"*) color="#0891B2" ;;
        *"ethics"*|*"safety"*) color="#166534" ;;
        *) color="#6B7280" ;;
    esac
    
    # 기본 AI 아이콘 템플릿
    cat > "assets/icons/ai/${filename}.svg" << EOF
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="8" r="3" fill="${color}" opacity="0.3"/>
  <circle cx="6" cy="14" r="2" fill="${color}" opacity="0.5"/>
  <circle cx="18" cy="14" r="2" fill="${color}" opacity="0.5"/>
  <circle cx="12" cy="18" r="2" fill="${color}" opacity="0.7"/>
  <path d="M12 11L12 15M9 14L15 14M8 12L16 12" stroke="${color}" stroke-width="1.5"/>
  <circle cx="12" cy="8" r="1" fill="${color}"/>
</svg>
EOF
    
    download_count=$((download_count + 1))
    echo "    ✅ 완료 (${download_count}개)"
done

# Phase 3: AI 일러스트 생성
echo ""
echo "🎨 Phase 3: AI 일러스트 생성..."
echo "-----------------------------"

ai_scenes="ai-assistant ai-workflow data-pipeline ml-pipeline neural-network-visualization ai-brain robot-interaction human-ai-collaboration ai-automation ai-analytics predictive-modeling ai-dashboard ai-monitoring ai-deployment model-serving ai-research ai-development ai-testing ai-optimization"

for scene in $ai_scenes; do
    filename="${scene}-illustration"
    echo "  생성: ${filename}.svg"
    
    # 랜덤 그라데이션 색상
    colors=("#667eea,#764ba2" "#f093fb,#f5576c" "#4facfe,#00f2fe" "#43e97b,#38f9d7" "#fa709a,#fee140" "#a8edea,#fed6e3" "#ffecd2,#fcb69f" "#ff8a80,#ff5722")
    gradient=${colors[$((RANDOM % ${#colors[@]}))]}
    IFS=',' read -ra COLORS <<< "$gradient"
    
    cat > "assets/images/ai-illustrations/${filename}.svg" << EOF
<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${scene}Grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS[1]};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${scene}Grad)" rx="20"/>
  
  <!-- AI Brain/Network -->
  <circle cx="250" cy="100" r="40" fill="white" opacity="0.2"/>
  <circle cx="200" cy="150" r="25" fill="white" opacity="0.3"/>
  <circle cx="300" cy="150" r="25" fill="white" opacity="0.3"/>
  <circle cx="250" cy="200" r="30" fill="white" opacity="0.4"/>
  
  <!-- Connecting Lines -->
  <path d="M220 120 L220 135 M280 120 L280 135 M225 170 L225 185 M275 170 L275 185" 
        stroke="white" stroke-width="2" opacity="0.6"/>
  
  <!-- Central AI Node -->
  <circle cx="250" cy="100" r="15" fill="white" opacity="0.8"/>
  <text x="250" y="105" text-anchor="middle" fill="${COLORS[1]}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">AI</text>
  
  <!-- Title -->
  <text x="250" y="280" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${scene^}</text>
</svg>
EOF
    
    download_count=$((download_count + 1))
    echo "    ✅ 완료 (${download_count}개)"
done

# Phase 4: AI 도구별 특화 아이콘
echo ""
echo "🛠️  Phase 4: AI 도구별 특화 아이콘..."
echo "-----------------------------------"

ai_tools="prompt-template embedding-vector similarity-search rag-system agent-framework multi-agent-system tool-calling function-calling api-integration model-fine-tuning dataset-preparation data-augmentation model-quantization model-optimization inference-engine batch-processing real-time-inference gpu-acceleration distributed-training model-registry experiment-tracking performance-monitoring bias-detection fairness-testing model-interpretability feature-importance gradient-visualization attention-visualization layer-analysis model-compression knowledge-distillation continual-learning meta-learning few-shot-prompting chain-of-thought-prompting tree-of-thought self-consistency constitutional-ai"

for tool in $ai_tools; do
    filename="${tool}-tool"
    echo "  생성: ${filename}.svg"
    
    # 도구별 색상 팔레트
    case $tool in
        *"prompt"*|*"template"*) color="#F59E0B" bg="#FEF3C7" ;;
        *"embedding"*|*"vector"*) color="#8B5CF6" bg="#F3E8FF" ;;
        *"rag"*|*"search"*) color="#059669" bg="#D1FAE5" ;;
        *"agent"*|*"multi"*) color="#DC2626" bg="#FEE2E2" ;;
        *"model"*|*"training"*) color="#3B82F6" bg="#DBEAFE" ;;
        *"data"*|*"dataset"*) color="#0891B2" bg="#CFFAFE" ;;
        *"monitoring"*|*"tracking"*) color="#7C2D12" bg="#FECACA" ;;
        *"bias"*|*"fairness"*) color="#166534" bg="#DCFCE7" ;;
        *"optimization"*|*"compression"*) color="#BE185D" bg="#FCE7F3" ;;
        *"prompting"*|*"thought"*) color="#EA580C" bg="#FED7AA" ;;
        *) color="#6B7280" bg="#F3F4F6" ;;
    esac
    
    cat > "assets/icons/ml-tools/${filename}.svg" << EOF
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="20" height="20" rx="4" fill="${bg}"/>
  <rect x="4" y="4" width="16" height="16" rx="2" fill="${color}" opacity="0.1"/>
  <circle cx="8" cy="8" r="1.5" fill="${color}"/>
  <circle cx="16" cy="8" r="1.5" fill="${color}"/>
  <circle cx="12" cy="12" r="2" fill="${color}"/>
  <circle cx="8" cy="16" r="1.5" fill="${color}"/>
  <circle cx="16" cy="16" r="1.5" fill="${color}"/>
  <path d="M8 8L12 10M16 8L12 10M12 14L8 16M12 14L16 16" stroke="${color}" stroke-width="1" opacity="0.7"/>
</svg>
EOF
    
    download_count=$((download_count + 1))
    echo "    ✅ 완료 (${download_count}개)"
done

echo ""
echo "🎉 AI Asset 수집 완료!"
echo "==================="
echo "성공적으로 수집된 AI Asset: ${download_count}개"

# 최종 검증
echo ""
echo "🔍 AI Asset 검증 결과:"
ai_icons=$(find assets/icons/ai -name "*.svg" | wc -l)
ml_tools=$(find assets/icons/ml-tools -name "*.svg" | wc -l) 
ai_illustrations=$(find assets/images/ai-illustrations -name "*.svg" | wc -l)

echo "• AI 브랜드 아이콘: ${ai_icons}개"
echo "• ML 도구 아이콘: ${ml_tools}개"
echo "• AI 일러스트: ${ai_illustrations}개"

total_ai_assets=$((ai_icons + ml_tools + ai_illustrations))
echo ""
echo "🤖 총 AI Asset: ${total_ai_assets}개"
echo "✅ InfoGraphAI AI 특화 라이브러리 구축 완료!"