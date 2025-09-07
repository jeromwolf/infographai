#!/bin/bash

# InfoGraphAI 프로젝트 종료 스크립트
# 사용법: ./stop.sh

echo "🛑 InfoGraphAI 프로젝트를 종료합니다..."
echo "==========================================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Node 프로세스 종료
echo -e "${YELLOW}실행 중인 프로세스를 종료합니다...${NC}"

# InfoGraphAI 관련 프로세스 찾기 및 종료
pkill -f "node.*infographai" 2>/dev/null
pkill -f "npm.*dev" 2>/dev/null
pkill -f "nodemon" 2>/dev/null
pkill -f "tsx.*src/index.ts" 2>/dev/null
pkill -f "next dev" 2>/dev/null

# 포트 확인 및 정리
echo -e "${YELLOW}포트 정리 중...${NC}"

# 포트 4906 사용 프로세스 종료
lsof -ti:4906 | xargs kill -9 2>/dev/null

# 포트 3906 사용 프로세스 종료  
lsof -ti:3906 | xargs kill -9 2>/dev/null

# 기존 포트도 정리 (이전 프로세스가 있을 수 있음)
lsof -ti:4000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

sleep 2

# 종료 확인
if ! lsof -ti:4906 >/dev/null 2>&1 && ! lsof -ti:3906 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 모든 프로세스가 정상적으로 종료되었습니다.${NC}"
else
    echo -e "${RED}⚠️  일부 프로세스가 아직 실행 중일 수 있습니다.${NC}"
    echo "실행 중인 프로세스:"
    lsof -ti:4906,3906 2>/dev/null
fi

# Docker 컨테이너 자동 종료
echo -e "${YELLOW}Docker 컨테이너 종료 중...${NC}"
docker-compose down
echo -e "${GREEN}✅ Docker 컨테이너가 종료되었습니다.${NC}"

echo ""
echo "==========================================="
echo -e "${GREEN}종료 완료!${NC}"
echo "다시 시작하려면 ./start.sh를 실행하세요."
echo "==========================================="