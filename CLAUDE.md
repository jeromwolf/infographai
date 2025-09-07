# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InfoGraphAI is an AI-based platform that automatically generates educational videos for IT technical topics. The system takes a topic as input and produces complete YouTube-ready videos with scripts, infographic animations, and voice synthesis.

## Current Implementation Status

### ✅ Completed
- **Authentication System**: JWT-based auth with login/register
- **Project Management**: CRUD operations for projects
- **Scenario System**: Create, edit, and manage video scenarios
- **Video Generation Interface**: UI for video configuration
- **Database Schema**: PostgreSQL with Prisma ORM
- **API Structure**: Express.js backend with TypeScript

### 🔧 Key Technical Issues Resolved

#### 1. Webpack Caching Problem
- **Issue**: `api.createScenario is not a function` error due to webpack caching singleton pattern
- **Solution**: Created separate API files (scenario-api.ts, video-api.ts) instead of using single api.ts

#### 2. Database Schema Issue  
- **Issue**: @unique constraint on projectId limited to 1 scenario per project
- **Solution**: Changed to one-to-many relationship

## Key Architecture

### Current Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Docker)
- **Architecture**: Turbo Monorepo

### Planned Services
- **Script Generation**: OpenAI GPT-4 integration
- **Animation Engine**: Node.js + Canvas + WebGL
- **Video Rendering**: FFmpeg with GPU acceleration
- **TTS Service**: ElevenLabs API + Azure Speech

## Development Commands

### Setup
```bash
# Install dependencies
npm install

# Setup database
docker-compose up -d

# Run database migrations
cd apps/api && npx prisma migrate dev

# Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

### Development
```bash
# Run all services (recommended)
npm run dev

# Run services individually
cd apps/api && npm run dev  # Backend on port 4906
cd apps/web && npm run dev  # Frontend on port 3000
```

### Database
```bash
# View database in Prisma Studio
cd apps/api && npx prisma studio

# Generate Prisma client
cd apps/api && npx prisma generate

# Create migration
cd apps/api && npx prisma migrate dev --name <migration-name>
```

### Testing
```bash
# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Project Structure (Current)

```
infographai/
├── apps/
│   ├── api/              # Express.js Backend
│   │   ├── src/
│   │   │   ├── routes/   # API endpoints
│   │   │   │   ├── auth.ts      # Authentication
│   │   │   │   ├── projects.ts  # Project management
│   │   │   │   ├── scenarios.ts # Scenario management
│   │   │   │   └── videos.ts    # Video generation
│   │   │   ├── middleware/       # Express middleware
│   │   │   └── lib/             # Utilities
│   │   └── prisma/
│   │       └── schema.prisma    # Database schema
│   └── web/              # Next.js Frontend
│       ├── app/          # App Router pages
│       │   ├── dashboard/        # Main application
│       │   │   ├── projects/    # Project pages
│       │   │   ├── scenarios/   # Scenario pages
│       │   │   └── videos/      # Video pages
│       │   ├── login/           # Authentication
│       │   └── register/
│       └── lib/          # API clients
│           ├── api.ts           # Main API (has caching issues)
│           ├── scenario-api.ts  # Scenario-specific API
│           └── video-api.ts     # Video-specific API
├── assets/               # Static resources
├── docker-compose.yml    # PostgreSQL database
└── package.json         # Monorepo root
```

## Core Features to Implement

1. **AI Content Generation Engine**
   - Topic analysis and structure design
   - Script generation with GPT-4
   - Visual element auto-design

2. **Infographic Animation Engine**
   - Template system (comparison, process, architecture, concept, trend)
   - Dynamic animation patterns
   - Smart layout engine

3. **Voice Synthesis & Sync**
   - Natural TTS integration
   - Animation-voice synchronization

4. **User Interface**
   - Simple input interface
   - Real-time preview
   - Editing interface

5. **Export & Optimization**
   - Multi-format support (YouTube, Shorts, Instagram)
   - SEO optimization

## API Design Patterns

When implementing APIs:
- Use RESTful endpoints for CRUD operations
- Implement WebSocket for real-time preview
- Use job queues for video generation
- Return consistent error responses
- Include request validation middleware

## Testing Strategy

- Unit tests for all utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance tests for rendering pipeline
- Visual regression tests for animations

## Security Considerations

- Implement rate limiting for API endpoints
- Secure storage of API keys (OpenAI, ElevenLabs)
- Input sanitization for user-provided content
- CORS configuration for frontend-backend communication
- Authentication with JWT tokens

## Performance Requirements

- Generation time: <15 minutes average
- API response time: <500ms p95
- System uptime: >99.5%
- Support for 4K video rendering
- 60fps animation preview