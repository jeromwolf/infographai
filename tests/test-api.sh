#!/bin/bash

echo "================================================"
echo "InfoGraphAI API 통합 테스트"
echo "================================================"

API_URL="http://localhost:4000"
TEST_EMAIL="test$(date +%s)@example.com"
TEST_PASSWORD="testpassword123"

# 색상 코드
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 테스트 결과 확인 함수
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        return 1
    fi
}

echo ""
echo "1. 서비스 상태 확인"
echo "------------------------"

# API 헬스체크
HEALTH=$(curl -s $API_URL/health | jq -r '.status')
[ "$HEALTH" == "healthy" ]
check_result $? "API 서버 상태"

# Next.js 체크
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
[ "$HTTP_CODE" == "200" ]
check_result $? "Next.js 프론트엔드"

echo ""
echo "2. 인증 테스트"
echo "------------------------"

# 회원가입
REGISTER_RESULT=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"테스트 사용자\"}")

USER_ID=$(echo $REGISTER_RESULT | jq -r '.user.id')
[ "$USER_ID" != "null" ]
check_result $? "회원가입"

# 로그인
LOGIN_RESULT=$(curl -s -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESULT | jq -r '.token')
[ "$TOKEN" != "null" ]
check_result $? "로그인"

# 사용자 정보 조회
USER_INFO=$(curl -s $API_URL/api/users/me \
  -H "Authorization: Bearer $TOKEN" | jq -r '.email')
[ "$USER_INFO" == "$TEST_EMAIL" ]
check_result $? "인증된 사용자 정보 조회"

echo ""
echo "3. 프로젝트 CRUD 테스트"
echo "------------------------"

# 프로젝트 생성
PROJECT_RESULT=$(curl -s -X POST $API_URL/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트 프로젝트","description":"테스트 설명","topic":"JavaScript"}')

PROJECT_ID=$(echo $PROJECT_RESULT | jq -r '.id // .projectId // .project')
[ "$PROJECT_ID" != "null" ]
check_result $? "프로젝트 생성"

# 프로젝트 목록 조회
PROJECTS=$(curl -s $API_URL/api/projects \
  -H "Authorization: Bearer $TOKEN" | jq '. | length')
[ "$PROJECTS" -gt 0 ]
check_result $? "프로젝트 목록 조회"

# 프로젝트 업데이트
UPDATE_RESULT=$(curl -s -X PATCH $API_URL/api/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"업데이트된 프로젝트"}' | jq -r '.title')
[ "$UPDATE_RESULT" == "업데이트된 프로젝트" ]
check_result $? "프로젝트 업데이트"

echo ""
echo "4. 비디오 테스트"
echo "------------------------"

# 비디오 생성
VIDEO_RESULT=$(curl -s -X POST $API_URL/api/videos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"projectId\":\"$PROJECT_ID\",\"topic\":\"React Hooks\",\"duration\":120}")

VIDEO_ID=$(echo $VIDEO_RESULT | jq -r '.id')
[ "$VIDEO_ID" != "null" ]
check_result $? "비디오 생성"

# 비디오 목록 조회
VIDEOS=$(curl -s $API_URL/api/videos \
  -H "Authorization: Bearer $TOKEN" | jq '. | length')
[ "$VIDEOS" -gt 0 ]
check_result $? "비디오 목록 조회"

echo ""
echo "5. 비용 모니터링 테스트"
echo "------------------------"

# 비용 요약 조회
COST_SUMMARY=$(curl -s $API_URL/api/costs/summary \
  -H "Authorization: Bearer $TOKEN" | jq -r '.today')
[ "$COST_SUMMARY" != "null" ]
check_result $? "비용 요약 조회"

# 비용 이력 조회
COST_HISTORY=$(curl -s $API_URL/api/costs/history \
  -H "Authorization: Bearer $TOKEN" | jq -r '.records')
[ "$COST_HISTORY" != "null" ]
check_result $? "비용 이력 조회"

echo ""
echo "================================================"
echo "테스트 완료!"
echo "================================================"