#!/bin/bash

# SceneCraft Studio 종료 스크립트
# 사용법: ./stop-scenecraft.sh

echo "🛑 ====================================="
echo "   SceneCraft Studio 종료하기"
echo "===================================== 🛑"
echo ""

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Node.js 프로세스 종료
echo "${YELLOW}🔍 실행 중인 Node.js 프로세스 찾는 중...${NC}"

# Next.js 서버 종료 (포트 3906)
lsof -ti:3906 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ 웹 서버 종료됨 (포트 3906)${NC}"
else
    echo "ℹ️  웹 서버가 실행 중이 아닙니다"
fi

# API 서버 종료 (포트 4906) - 혹시 실행 중일 경우
lsof -ti:4906 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ API 서버 종료됨 (포트 4906)${NC}"
else
    echo "ℹ️  API 서버가 실행 중이 아닙니다"
fi

# 2. Docker 컨테이너 종료
echo ""
echo "${YELLOW}🐳 Docker 컨테이너 종료 중...${NC}"
docker-compose down
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ PostgreSQL 데이터베이스 종료 완료${NC}"
else
    echo "${RED}⚠️  Docker 컨테이너 종료 중 문제가 있었습니다${NC}"
fi

echo ""
echo "${GREEN}✨ SceneCraft Studio가 완전히 종료되었습니다!${NC}"
echo ""