#!/bin/bash

# API 테스트 스크립트
echo "🚀 InfoGraphAI API 통합 테스트 시작"
echo "========================================"

# 테스트 데이터
EMAIL="test@example.com"
PASSWORD="test123456"

# 1. 로그인
echo -e "\n📝 1. 로그인 테스트"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4906/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ 로그인 실패. 테스트 계정을 먼저 생성합니다."
  
  # 회원가입
  REGISTER_RESPONSE=$(curl -s -X POST http://localhost:4906/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"Test User\"}")
  
  TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
  
  if [ -z "$TOKEN" ]; then
    echo "❌ 회원가입도 실패했습니다."
    echo $REGISTER_RESPONSE
    exit 1
  fi
  echo "✅ 회원가입 성공"
fi

echo "✅ 로그인 성공"
echo "   토큰: ${TOKEN:0:20}..."

# 2. 프로젝트 생성
echo -e "\n📝 2. 프로젝트 생성"
PROJECT_RESPONSE=$(curl -s -X POST http://localhost:4906/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "RAG 교육 비디오 프로젝트",
    "description": "RAG 기술에 대한 교육용 비디오",
    "topic": "RAG",
    "targetAudience": "개발자"
  }')

PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')

if [ -z "$PROJECT_ID" ]; then
  echo "❌ 프로젝트 생성 실패"
  echo $PROJECT_RESPONSE
  exit 1
fi

echo "✅ 프로젝트 생성 성공"
echo "   프로젝트 ID: $PROJECT_ID"

# 3. 자동 시나리오 생성
echo -e "\n📝 3. 자동 시나리오 생성 (토픽: RAG)"
SCENARIO_RESPONSE=$(curl -s -X POST http://localhost:4906/api/scenarios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"projectId\": \"$PROJECT_ID\",
    \"type\": \"auto\",
    \"generationOptions\": {
      \"topic\": \"RAG\"
    }
  }")

SCENARIO_ID=$(echo $SCENARIO_RESPONSE | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')

if [ -z "$SCENARIO_ID" ]; then
  echo "❌ 시나리오 생성 실패"
  echo $SCENARIO_RESPONSE
  exit 1
fi

echo "✅ 시나리오 생성 성공"
echo "   시나리오 ID: $SCENARIO_ID"

# 시나리오 상세 정보 출력
echo -e "\n📊 시나리오 상세 정보:"
SCENARIO_DETAIL=$(curl -s -X GET "http://localhost:4906/api/scenarios/$SCENARIO_ID" \
  -H "Authorization: Bearer $TOKEN")

echo $SCENARIO_DETAIL | python3 -m json.tool 2>/dev/null || echo $SCENARIO_DETAIL

# 4. 비디오 생성
echo -e "\n📝 4. 비디오 생성 시작"
VIDEO_RESPONSE=$(curl -s -X POST http://localhost:4906/api/videos/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"projectId\": \"$PROJECT_ID\",
    \"scenarioId\": \"$SCENARIO_ID\"
  }")

VIDEO_ID=$(echo $VIDEO_RESPONSE | grep -o '"video":{"id":"[^"]*' | sed 's/"video":{"id":"//')

if [ -z "$VIDEO_ID" ]; then
  echo "❌ 비디오 생성 시작 실패"
  echo $VIDEO_RESPONSE
  exit 1
fi

echo "✅ 비디오 생성 시작됨"
echo "   비디오 ID: $VIDEO_ID"

# 5. 비디오 상태 확인 (3번 체크)
echo -e "\n📝 5. 비디오 생성 상태 확인"
for i in 1 2 3; do
  sleep 2
  VIDEO_STATUS=$(curl -s -X GET "http://localhost:4906/api/videos/$VIDEO_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  STATUS=$(echo $VIDEO_STATUS | grep -o '"status":"[^"]*' | sed 's/"status":"//')
  PROGRESS=$(echo $VIDEO_STATUS | grep -o '"progress":[0-9]*' | sed 's/"progress"://')
  
  echo "   상태 #$i: $STATUS (진행률: ${PROGRESS}%)"
  
  if [ "$STATUS" == "COMPLETED" ]; then
    echo "✅ 비디오 생성 완료!"
    URL=$(echo $VIDEO_STATUS | grep -o '"url":"[^"]*' | sed 's/"url":"//')
    echo "   비디오 URL: $URL"
    break
  fi
done

echo -e "\n✨ 테스트 완료!"
echo "========================================"
echo "프로젝트 ID: $PROJECT_ID"
echo "시나리오 ID: $SCENARIO_ID" 
echo "비디오 ID: $VIDEO_ID"