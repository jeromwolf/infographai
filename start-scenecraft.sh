#!/bin/bash

# SceneCraft Studio 시작 스크립트
# 사용법: ./start-scenecraft.sh

echo "🎨 ====================================="
echo "   SceneCraft Studio 시작하기"
echo "   KodeKloud Style Animation Builder"
echo "===================================== 🎨"
echo ""

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Docker 체크 및 시작 (PostgreSQL용)
echo "${YELLOW}📦 Docker 상태 확인 중...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo "${RED}❌ Docker가 실행되지 않았습니다.${NC}"
    echo "Docker Desktop을 먼저 실행해주세요!"
    exit 1
fi

# 2. PostgreSQL 컨테이너 시작
echo "${BLUE}🗄️  PostgreSQL 데이터베이스 시작 중...${NC}"
docker-compose up -d
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ 데이터베이스 시작 완료${NC}"
else
    echo "${YELLOW}⚠️  데이터베이스가 이미 실행 중이거나 오류가 있습니다${NC}"
fi

# 3. 잠시 대기 (DB 초기화 시간)
echo "⏳ 데이터베이스 초기화 대기 중..."
sleep 3

# 4. 의존성 설치 체크
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}📦 의존성 설치가 필요합니다...${NC}"
    npm install
    echo "${GREEN}✅ 의존성 설치 완료${NC}"
fi

# 5. 웹 서버만 실행 (간단 모드)
echo ""
echo "${GREEN}🚀 SceneCraft Studio 웹 서버 시작 중...${NC}"
echo "-----------------------------------"
echo "📍 접속 주소: ${BLUE}http://localhost:3906${NC}"
echo "-----------------------------------"
echo ""
echo "주요 페이지:"
echo "  📊 메인 대시보드: ${BLUE}http://localhost:3906/dashboard${NC}"
echo "  🎨 씬 빌더: ${BLUE}http://localhost:3906/dashboard/builder${NC}"
echo "  📋 템플릿: ${BLUE}http://localhost:3906/dashboard/templates${NC}"
echo "  🎬 애니메이션: ${BLUE}http://localhost:3906/dashboard/animation${NC}"
echo ""
echo "${YELLOW}종료하려면 Ctrl+C를 누르세요${NC}"
echo ""

# 웹 서버 실행
cd apps/web
npm run dev