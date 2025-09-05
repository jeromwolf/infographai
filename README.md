# InfoGraphAI 🎬

> AI 기반 IT 교육 영상 자동 생성 플랫폼 (자막 중심 전략)

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- Docker & Docker Compose
- npm v10+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/infographai.git
cd infographai

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Start Docker containers (PostgreSQL, Redis)
docker compose up -d

# 5. Run development servers
npm run dev
```

## 📁 Project Structure

```
infographai/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express.js backend
├── packages/
│   ├── shared/       # Shared types and utilities
│   ├── ui/           # UI components library
│   ├── cost-monitor/ # 💰 Cost monitoring system (CRITICAL!)
│   └── config/       # Configuration files
├── docker-compose.yml
└── turbo.json
```

## 💰 Cost Monitoring (CRITICAL!)

**⚠️ WARNING: 비용 모니터링 시스템이 없으면 하루에 수백만원이 날아갈 수 있습니다!**

Daily limits are set to:
- Development: $10/day
- Production: $50/day

Check cost status:
```bash
npm run cost:status
```

## 🎯 Core Features

1. **자막 중심 영상 생성** - 음성 없이 자막과 비주얼로 완성
2. **한국어 최적화** - 완벽한 한글 자막 처리
3. **비용 효율** - TTS 제거로 60% 비용 절감
4. **빠른 생성** - 3분 내 영상 완성

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma
- **AI**: OpenAI GPT-3.5/4
- **Database**: PostgreSQL, Redis
- **Infrastructure**: Docker, AWS S3
- **Monitoring**: Cost Monitor, Winston

## 📊 Development Status

### Week 1 Progress
- ✅ Repository setup
- ✅ Monorepo structure (Turborepo)
- ✅ TypeScript & ESLint configuration  
- ✅ Docker environment
- ✅ Cost monitoring system

### Next Steps (Week 1, Day 2)
- [ ] Database schema & Prisma setup
- [ ] Korean subtitle processing module
- [ ] Basic API structure
- [ ] Frontend initialization

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific workspace tests
npm test --workspace=@infographai/api

# Run cost monitor tests (important!)
npm test --workspace=@infographai/cost-monitor
```

## 📈 Performance Goals

- Generation time: < 3 minutes
- Cost per video: < $0.50
- Success rate: > 95%
- Korean subtitle accuracy: > 98%

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## ⚠️ Important Notes

1. **Always monitor costs** - Check daily spending
2. **Test locally first** - Use Docker for local development
3. **Korean text priority** - All features must support Korean perfectly
4. **Subtitle quality** - Focus on readability and timing

---

**Remember: 비용 통제 실패 = 프로젝트 실패**