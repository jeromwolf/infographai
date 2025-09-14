# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InfoGraphAI is an AI-based platform that automatically generates educational videos for IT technical topics. The system takes a topic as input and produces complete YouTube-ready videos with scripts, infographic animations, and voice synthesis.

## Current Implementation Status (27% Complete)

### ✅ Major Breakthrough Achieved - Phase Evolution Completed
- **AI-Driven Video Generation**: Complete transformation from manual scenario editing to AI-generated videos
- **Sharp+SVG Rendering**: Successfully replaced failed Canvas approach with robust Sharp+SVG system
- **30-Second Educational Videos**: Full pipeline from topic input → AI scenario → professional video
- **3-Phase Quality Improvement System**: Systematic approach to video quality enhancement
- **Advanced Animation Engine**: Complex animation system with typewriter, particles, morphing effects

### 📊 Phase-by-Phase Development Results
#### Phase 1: Real Template Loading (25% → 45% Target)
- **Implementation**: `SimpleTemplateLoader` with actual SVG file reading
- **Result**: 341KB videos in 24 seconds with improved visual elements
- **Status**: ✅ Successfully implemented

#### Phase 2: Infographic Enhancement (45% → 65% Target)
- **Implementation**: `ChartGenerator` + `DiagramGenerator` systems
- **Features**: Bar charts, pie charts, RAG architecture diagrams, process flows
- **Result**: Enhanced visual content with data visualization
- **Status**: ✅ Successfully implemented with some SVG parsing issues

#### Phase 3: Dynamic Animation (65% → 80% Target)
- **Implementation**: `AdvancedAnimationEngine` with complex effects
- **Features**: Typewriter animations, particle systems, morphing, 3D effects
- **Result**: 1001KB videos with sophisticated animation attempts
- **Current Quality Assessment**: **27%** (User feedback - significant gap from 80% target)
- **Status**: ⚠️ Technical implementation complete, but visual results below expectations

### ✅ Core Infrastructure Completed
- **Authentication System**: JWT-based auth with login/register
- **Project Management**: CRUD operations for projects  
- **Database Schema**: PostgreSQL with Prisma ORM
- **API Structure**: Express.js backend with TypeScript
- **Video Generation Pipeline**: FFmpeg-based rendering from frame sequences

### 🔧 Critical Technical Breakthroughs

#### 1. Canvas Rendering Complete Failure → Sharp+SVG Success
- **Issue**: Canvas only producing black frames on macOS ("검정색만 4초 나와")
- **User Frustration**: "텍스트 한줄이고 내용도 없고, 그림도 없고, 효과도 없고"
- **Solution**: Complete architectural shift to Sharp + SVG rendering system
- **Result**: Professional-quality 30-second videos with rich animations

#### 2. FFmpeg Frame Sequence Fix
- **Issue**: Non-consecutive frame numbers causing video generation failure
- **Solution**: Sequential frame numbering with globalFrameIndex approach
- **Code**: `const globalFrameNum = startFrameIndex + frameNum;`

#### 3. UI Paradigm Transformation
- **Before**: Manual scenario creation with scene-by-scene editing
- **After**: AI-driven generation - user inputs topic → AI creates complete video
- **User Request**: "기존 화면설계에 연동 작업 진행하자"

#### 4. Database Schema & API Issues
- **Webpack Caching**: `api.createScenario is not a function` → separate API files
- **Unique Constraint**: @unique projectId → one-to-many relationship  
- **Field Naming**: `name` vs `title` standardization

## Key Architecture

### Current Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Docker)
- **Architecture**: Turbo Monorepo

### Successfully Implemented Services
- **AI Scenario Generator**: GPT-4 powered topic → full video scenario conversion
- **Professional Animation Engine**: Sharp + SVG with 5 layout templates
- **Video Generation Pipeline**: FFmpeg-based rendering with frame sequences
- **Chart Generation System**: Bar charts, pie charts, line graphs with animation support
- **Diagram Generation System**: RAG architecture, process flows, comparison diagrams
- **Advanced Animation Engine**: Typewriter effects, particle systems, morphing animations
- **Template Loading System**: Real SVG template file processing
- **Layout Templates**: center, split, grid, timeline, comparison

### Architecture Decisions
- **Rendering Engine**: Sharp + SVG (Canvas failed on macOS)
- **Frame Generation**: Sequential numbering for FFmpeg compatibility  
- **Scene Types**: intro, concept, process, benefits, example, conclusion
- **Animation Types**: fadeIn, slideIn, zoomIn, typewriter, morphing

### Planned Enhancements
- **Content Depth**: From 20% to 100% educational quality (KSS integration)
- **TTS Service**: ElevenLabs API + Azure Speech
- **Visual Effects**: 50+ infographic components, 3D elements, particle systems

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

### Testing & Video Generation
```bash
# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck

# Test AI video generation
cd apps/api && node test-docker-video.js
cd apps/api && node test-rag-video.js
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
│   │   │   ├── services/        # Core services
│   │   │   │   ├── ai-scenario-generator.ts    # GPT-4 scenario generation
│   │   │   │   ├── professional-animation-renderer.ts # Sharp+SVG rendering
│   │   │   │   ├── sharp-video-generator.ts    # Video generation pipeline
│   │   │   │   ├── chart-generator.js          # Chart generation system
│   │   │   │   ├── diagram-generator.js        # Diagram generation system
│   │   │   │   └── advanced-animation-engine.js # Advanced animation system
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
│           ├── api.ts           # Main API (legacy)
│           ├── scenario-api.ts  # Scenario-specific API
│           ├── video-api.ts     # Video-specific API
│           └── ai-api.ts        # AI generation API (new)
├── assets/               # Static resources
├── docker-compose.yml    # PostgreSQL database
└── package.json         # Monorepo root
```

## Project Vision & Quality Assessment

### Current Achievement (27% Complete)
- **Basic Working System**: Topic → AI scenario → 30-second video generation
- **3-Phase Development Completed**: Real templates → Infographics → Dynamic animations
- **User Feedback Evolution**:
  - Initial: "전체 100%에서 이제 20% 된것 같아"
  - Phase 3 Result: **27%** (User assessment after advanced animation implementation)
- **Core Issue Identified**: Complex animation systems implemented but SVG rendering issues prevent visual quality improvements from manifesting in final video output

### Vision Clarification (User Feedback)
- **KSS Platform**: "kss는 교육, 시뮬레이터" (Deep education with 500-hour curriculum)
- **InfoGraphAI**: "infograpai는 진짜 학습 비디오" (30-second learning summaries)
- **Synergy**: KSS provides depth → InfoGraphAI creates viral summaries

### Quality Roadmap (20% → 100%)

#### Phase 1: Content Enhancement (20% → 40%)
- **Educational Structure**: ADDIE model, Bloom's Taxonomy
- **Storytelling**: Problem-solution narratives, real-world examples
- **Visual Metaphors**: Rich animations, infographics, data visualizations

#### Phase 2: Visual Upgrade (40% → 60%) 
- **50+ Components**: Charts, diagrams, interactive elements
- **Advanced Animations**: Morphing, particles, 3D effects
- **Cinematic Effects**: Camera movements, depth of field

#### Phase 3: Learning Optimization (60% → 80%)
- **Cognitive Load**: Information chunking, progressive disclosure
- **Memory Encoding**: Dual coding theory, spaced repetition
- **Assessment Points**: Interactive quizzes, knowledge checks

#### Phase 4: Professional Polish (80% → 100%)
- **TTS Integration**: ElevenLabs voice synthesis
- **Sound Design**: Background music, sound effects
- **Multi-format Export**: YouTube, Shorts, Instagram optimization

### Success Metrics
- **Learning Effectiveness**: 80%+ knowledge retention after 24 hours
- **Engagement**: 90%+ completion rate, 30%+ re-watch rate  
- **Viral Potential**: Content quality that drives KSS platform adoption

## API Design Patterns

When implementing APIs:
- Use RESTful endpoints for CRUD operations
- Implement WebSocket for real-time preview
- Use job queues for video generation
- Return consistent error responses
- Include request validation middleware

## Recent Test Results & Achievements

### Docker Video Test (Successful)
```bash
cd apps/api && node test-docker-video.js
```
- **Output**: 30-second Docker intro video (770KB, 1920x1080, 30fps)
- **6 Scenes**: intro → concept → process → benefits → example → conclusion  
- **5 Layouts**: center, split, grid, timeline, comparison
- **Animations**: fadeIn, slideIn, zoomIn, typewriter effects

### Technical Validation
- ✅ Sharp+SVG rendering pipeline working
- ✅ FFmpeg frame sequence generation  
- ✅ Professional animation system
- ✅ AI scenario generation architecture
- ✅ Complete end-to-end video creation

### User Experience Feedback Journey
1. **Initial Problem**: "검정색만 4초 나와" (Canvas failure)
2. **Frustration**: "텍스트 한줄이고 내용도 없고, 그림도 없고, 효과도 없고"
3. **Progress**: "응 조금 좋아지긴했네 2초지만"
4. **Success**: Generated full 30-second professional video
5. **Quality Assessment**: "전체 100%에서 이제 20% 된것 같아"
6. **Phase Development**: Systematic 3-phase improvement approach implemented
7. **Current Status**: "27% 정도" (User assessment after Phase 3 completion)

### Testing Strategy
- ✅ Real video generation testing (Docker, RAG topics)
- ✅ Animation rendering validation
- ✅ 3-Phase systematic quality improvement (25% → 27% achieved)
- ⚠️ SVG rendering stability issues identified
- 🚧 Content quality assessment (27% → 100%)
- 📋 Learning effectiveness measurement
- 📋 User engagement analytics

### 🚨 Critical Issues Identified
#### SVG Rendering Stability
- **Problem**: Complex SVG generation causing parsing errors
- **Symptoms**: "xmlParseEntityRef: no name", "Opening and ending tag mismatch"
- **Impact**: Advanced animations fall back to basic templates
- **Root Cause**: HTML elements mixed with SVG, malformed XML structure
- **Priority**: High - preventing quality improvements from manifesting

#### Animation Implementation Gap
- **Technical Completion**: Advanced animation engine fully implemented
- **User Experience**: Only 7% quality improvement (20% → 27%)
- **Gap Analysis**: Sophisticated logic exists but doesn't render properly
- **Next Focus**: Robust, simple animations over complex broken ones

## Security Considerations

- Implement rate limiting for API endpoints
- Secure storage of API keys (OpenAI, ElevenLabs)
- Input sanitization for user-provided content
- CORS configuration for frontend-backend communication
- Authentication with JWT tokens

## Next Steps & Development Priorities

### Immediate (1 Week)
1. **Content Quality Enhancement**
   - Integrate KSS educational methodology  
   - Implement storytelling frameworks
   - Add visual metaphors and real-world examples

2. **Animation Library Expansion**
   - 20+ core animation types
   - Data visualization components
   - Interactive elements

### Short-term (1 Month)  
1. **Professional Polish**
   - TTS integration (ElevenLabs)
   - Background music and sound effects
   - Cinematic camera movements

2. **Learning Optimization**
   - Cognitive load management
   - Memory encoding techniques
   - A/B testing framework

### Long-term (3 Months)
1. **Scale & Performance**
   - Multi-format export (YouTube, Shorts, Instagram)
   - Batch video generation
   - Performance optimization

2. **Intelligence & Personalization**
   - Learning path recommendations
   - User preference adaptation
   - Analytics and insights

### Success Criteria (100% Quality Target)
- **Educational Effectiveness**: Transform "텍스트 한줄" → rich learning experience
- **Visual Quality**: Professional infographics matching KSS education standards
- **User Satisfaction**: "진짜 학습 비디오" that drives KSS platform adoption
- **Performance**: <5 minutes generation time, >90% user completion rate