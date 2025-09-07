#!/bin/bash

# InfoGraphAI 프로젝트 시작 스크립트
# 사용법: ./start.sh

echo "🚀 InfoGraphAI 프로젝트를 시작합니다..."
echo "==========================================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 프로세스 정리
echo -e "${YELLOW}기존 프로세스 정리 중...${NC}"
pkill -f "node.*infographai" 2>/dev/null
pkill -f "npm.*dev" 2>/dev/null
sleep 2

# Node 모듈 확인
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Dependencies 설치 중...${NC}"
    npm install
fi

# Docker 컨테이너 시작
echo -e "${GREEN}🐳 Docker 컨테이너를 시작합니다...${NC}"
docker-compose up -d postgres redis

# 데이터베이스가 준비될 때까지 대기
echo -e "${YELLOW}데이터베이스 초기화 대기중 (10초)...${NC}"
sleep 10

# 데이터베이스 확인
echo -e "${GREEN}데이터베이스 상태 확인...${NC}"
if ! docker exec infographai-postgres psql -U postgres -d infographai_dev -c "SELECT 1" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  데이터베이스가 아직 준비되지 않았습니다. 10초 더 대기...${NC}"
    sleep 10
    
    if ! docker exec infographai-postgres psql -U postgres -d infographai_dev -c "SELECT 1" >/dev/null 2>&1; then
        echo -e "${RED}⚠️  데이터베이스 연결 실패!${NC}"
        echo ""
        echo "Docker 컨테이너 상태를 확인하세요:"
        echo "  docker-compose ps"
        echo ""
        echo "수동으로 Docker 컨테이너를 시작하려면:"
        echo "  docker-compose up -d"
        echo ""
        echo "데이터베이스 설정:"
        echo "  host: localhost"
        echo "  user: postgres"
        echo "  password: postgres"
        echo "  database: infographai_dev"
        exit 1
    fi
fi

echo -e "${GREEN}✅ 데이터베이스 연결 성공!${NC}"

# API 서버 시작
echo -e "${GREEN}✅ API 서버 시작 (포트 4906)...${NC}"
(cd apps/api && npm run dev) &
API_PID=$!

# 웹 서버 시작
echo -e "${GREEN}✅ 웹 서버 시작 (포트 3906)...${NC}"
(cd apps/web && npm run dev) &
WEB_PID=$!

# 서버 시작 대기
echo -e "${YELLOW}서버 시작 대기 중...${NC}"
sleep 5

# 헬스 체크
echo -e "${GREEN}서버 상태 확인 중...${NC}"
if curl -s http://localhost:4906/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ API 서버 정상 작동!${NC}"
else
    echo -e "${RED}⚠️  API 서버 응답 없음${NC}"
fi

echo ""
echo "==========================================="
echo -e "${GREEN}🎉 InfoGraphAI 실행 완료!${NC}"
echo ""
echo "📍 접속 주소:"
echo "   • 웹 애플리케이션: http://localhost:3906"
echo "   • API 서버: http://localhost:4906"
echo "   • API 헬스체크: http://localhost:4906/health"
echo ""
echo "📊 실행된 프로세스:"
echo "   • API 서버 PID: $API_PID"
echo "   • 웹 서버 PID: $WEB_PID"
echo ""
echo "🛑 종료하려면 Ctrl+C를 누르거나 ./stop.sh를 실행하세요."
echo "==========================================="

# 프로세스 모니터링
trap "echo '종료 중...'; kill $API_PID $WEB_PID 2>/dev/null; exit" INT TERM

# 프로세스가 실행 중인 동안 대기
while kill -0 $API_PID 2>/dev/null || kill -0 $WEB_PID 2>/dev/null; do
    sleep 1
done