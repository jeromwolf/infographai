#!/bin/bash

# SceneCraft Studio - 바로 실행하기
# 포트 충돌 자동 해결 포함

echo "🎨 ====================================="
echo "   SceneCraft Studio 시작"
echo "===================================== 🎨"
echo ""

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 기존 포트 정리
echo "${YELLOW}🧹 기존 서버 정리 중...${NC}"
lsof -ti:3906 | xargs kill -9 2>/dev/null
lsof -ti:4906 | xargs kill -9 2>/dev/null
sleep 1

# 2. 의존성 체크
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}📦 의존성 설치 중...${NC}"
    npm install
fi

# 3. 서버 시작
echo ""
echo "${GREEN}🚀 서버 시작 중...${NC}"
echo ""
echo "┌─────────────────────────────────────┐"
echo "│  브라우저에서 열기:                   │"
echo "│  ${BLUE}http://localhost:3906/dashboard${NC}    │"
echo "└─────────────────────────────────────┘"
echo ""
echo "🎨 주요 페이지:"
echo "  • 메인: /dashboard"
echo "  • 빌더: /dashboard/builder"
echo "  • 템플릿: /dashboard/templates"
echo "  • 애니메이션: /dashboard/animation"
echo ""
echo "${RED}종료: Ctrl+C${NC}"
echo ""

# 웹 서버 실행
cd apps/web && npm run dev