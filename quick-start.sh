#!/bin/bash

# SceneCraft Studio 빠른 시작 (DB 없이)
# 사용법: ./quick-start.sh

echo "⚡ ====================================="
echo "   SceneCraft Studio 빠른 시작"
echo "   (데이터베이스 없이 UI만 실행)"
echo "===================================== ⚡"
echo ""

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 의존성 체크
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}📦 의존성 설치 중... (첫 실행시에만)${NC}"
    npm install
fi

echo ""
echo "${GREEN}🚀 웹 서버 시작 중...${NC}"
echo ""
echo "====================================="
echo "📍 브라우저에서 열기:"
echo "   ${BLUE}http://localhost:3906/dashboard${NC}"
echo "====================================="
echo ""
echo "🎨 주요 기능:"
echo "  • 씬 빌더: 드래그 앤 드롭으로 애니메이션 제작"
echo "  • 템플릿: KodeKloud 스타일 템플릿 5종"
echo "  • 애니메이션: 실시간 프리뷰"
echo ""
echo "${YELLOW}종료: Ctrl+C${NC}"
echo ""

# 웹 서버만 실행
cd apps/web && npm run dev