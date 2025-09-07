#!/bin/bash

# InfoGraphAI 개발 모드 실행 스크립트 (Turbo 사용)
# 사용법: ./dev.sh

echo "🚀 InfoGraphAI 개발 환경을 시작합니다 (Turbo)..."
echo "==========================================="

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 프로세스 정리
echo -e "${YELLOW}기존 프로세스 정리 중...${NC}"
pkill -f "turbo run dev" 2>/dev/null
pkill -f "node.*infographai" 2>/dev/null
sleep 2

# 데이터베이스 확인
echo -e "${GREEN}데이터베이스 연결 확인...${NC}"
if PGPASSWORD=infograph123 psql -h localhost -U infograph -d infographai -c "SELECT 1" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 데이터베이스 연결 성공${NC}"
else
    echo -e "${YELLOW}⚠️  데이터베이스 연결 실패 - 계속 진행합니다${NC}"
fi

# Turbo로 전체 프로젝트 실행
echo -e "${BLUE}🎯 Turbo로 모든 패키지 실행...${NC}"
echo ""
echo "실행될 패키지:"
echo "  • @infographai/api (포트 4000)"
echo "  • @infographai/web (포트 3000)"
echo "  • @infographai/scenario-manager"
echo "  • @infographai/cost-monitor"
echo "  • 기타 모든 패키지..."
echo ""

# Turbo 실행 (높은 동시성 설정)
npx turbo run dev --concurrency=20

# 종료 시 메시지
echo ""
echo "==========================================="
echo -e "${YELLOW}개발 서버가 종료되었습니다.${NC}"
echo "==========================================="