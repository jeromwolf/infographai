# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InfoGraphAI is an AI-based platform that automatically generates educational videos for IT technical topics. The system takes a topic as input and produces complete YouTube-ready videos with scripts, infographic animations, and voice synthesis.

## Key Architecture

The project will follow a microservices architecture:

### Frontend
- **Framework**: React 18 + Next.js 14
- **UI**: Tailwind CSS + Radix UI
- **Animation**: Framer Motion + Lottie
- **Canvas**: Fabric.js + Three.js
- **State Management**: Zustand + React Query

### Backend Services
- **API Gateway**: Node.js/Express
- **Content Analysis**: Python/FastAPI + Transformers
- **Script Generation**: OpenAI GPT-4 integration
- **Animation Engine**: Node.js + Canvas + WebGL
- **Video Rendering**: FFmpeg with GPU acceleration
- **TTS Service**: ElevenLabs API + Azure Speech

### Infrastructure
- **Cloud**: AWS (primary) + Vercel (frontend)
- **Database**: PostgreSQL + Redis
- **Storage**: S3 + CloudFront CDN
- **Queue**: Redis Bull Queue
- **Monitoring**: DataDog + Sentry

## Development Commands

Since this is a new project, commands will be established as the codebase develops. Expected commands based on the tech stack:

### Frontend (when implemented)
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

### Backend Services (when implemented)
```bash
# Python services
pip install -r requirements.txt
python -m pytest
python -m uvicorn main:app --reload

# Node.js services
npm install
npm run dev
npm test
```

## Project Structure (planned)

```
/
├── frontend/               # Next.js application
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities and API clients
├── backend/
│   ├── api-gateway/      # Express API gateway
│   ├── content-service/  # Python content analysis
│   ├── script-service/   # GPT-4 script generation
│   ├── animation-service/# Animation engine
│   ├── tts-service/      # Text-to-speech
│   └── render-service/   # Video rendering
├── shared/               # Shared types and utilities
└── infrastructure/       # AWS CDK or Terraform configs
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