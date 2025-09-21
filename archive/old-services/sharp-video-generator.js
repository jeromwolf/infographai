"use strict";
/**
 * Sharp + SVG 기반 비디오 생성기
 * Canvas 대신 Sharp와 SVG를 사용하여 인포그래픽 생성
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharpVideoGenerator = void 0;
exports.startSharpVideoGeneration = startSharpVideoGeneration;
const sharp_1 = __importDefault(require("sharp"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const database_1 = require("../lib/database");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class SharpVideoGenerator {
    videoId;
    projectId;
    scenarioId;
    outputDir;
    fps = 30;
    width = 1920;
    height = 1080;
    constructor(videoId, projectId, scenarioId) {
        this.videoId = videoId;
        this.projectId = projectId;
        this.scenarioId = scenarioId;
        this.outputDir = path.join(process.cwd(), 'public', 'videos');
    }
    async generate() {
        try {
            console.log(`[SharpVideoGen] Starting generation for ${this.videoId}`);
            // 1. Get scenario data
            const scenario = await this.getScenario();
            if (!scenario) {
                throw new Error('Scenario not found');
            }
            // 2. Parse scenes
            const scenes = this.parseScenes(scenario.scenes);
            // 3. Generate frames for each scene
            let globalFrameIndex = 0;
            const allFramePaths = [];
            for (let i = 0; i < scenes.length; i++) {
                const framePaths = await this.createSceneFrames(scenes[i], i, globalFrameIndex);
                allFramePaths.push(...framePaths);
                globalFrameIndex += Math.floor(scenes[i].duration * this.fps);
            }
            // 4. Create video from frames
            const videoPath = await this.createVideo(allFramePaths);
            // 5. Update video status
            await this.updateVideoStatus('COMPLETED', videoPath);
            console.log(`[SharpVideoGen] Video generated successfully: ${videoPath}`);
        }
        catch (error) {
            console.error('[SharpVideoGen] Error:', error);
            await this.updateVideoStatus('FAILED', undefined, error.message);
            throw error;
        }
    }
    async createSceneFrames(scene, sceneIndex, startFrameIndex) {
        const framePaths = [];
        const frameCount = Math.floor(scene.duration * this.fps);
        console.log(`[SharpVideoGen] Creating ${frameCount} frames for scene ${sceneIndex + 1}: ${scene.type}`);
        for (let frameNum = 0; frameNum < frameCount; frameNum++) {
            const progress = frameNum / frameCount;
            // Create SVG based on scene type
            let svg = '';
            if (scene.type === 'intro') {
                svg = this.createIntroSVG(scene, progress);
            }
            else if (scene.type === 'definition' || scene.type === 'concept') {
                svg = this.createConceptSVG(scene, progress);
            }
            else if (scene.type === 'process' || scene.type === 'workflow') {
                svg = this.createProcessSVG(scene, progress);
            }
            else if (scene.type === 'example' || scene.type === 'applications') {
                svg = this.createExampleSVG(scene, progress);
            }
            else if (scene.type === 'benefits' || scene.type === 'features') {
                svg = this.createBenefitsSVG(scene, progress);
            }
            else if (scene.type === 'conclusion') {
                svg = this.createConclusionSVG(scene, progress);
            }
            else {
                svg = this.createDefaultSVG(scene, progress);
            }
            // Use consecutive frame numbering
            const globalFrameNum = startFrameIndex + frameNum;
            const framePath = path.join(this.outputDir, `${this.videoId}_frame_${globalFrameNum.toString().padStart(8, '0')}.png`);
            await (0, sharp_1.default)(Buffer.from(svg))
                .png()
                .toFile(framePath);
            framePaths.push(framePath);
        }
        return framePaths;
    }
    createIntroSVG(scene, progress) {
        const opacity = Math.min(progress * 2, 1);
        const scale = 0.8 + progress * 0.2;
        const rotation = progress * 360;
        return `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Gradient Background -->
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
          <radialGradient id="circleGradient">
            <stop offset="0%" style="stop-color:#4fd1c7;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#4fd1c7;stop-opacity:0.2" />
          </radialGradient>
        </defs>
        
        <rect width="${this.width}" height="${this.height}" fill="url(#bgGradient)"/>
        
        <!-- Animated Circles -->
        <g transform="translate(${this.width / 2}, ${this.height / 2})">
          <circle cx="0" cy="0" r="${100 + progress * 50}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
          <circle cx="0" cy="0" r="${150 + progress * 50}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
          <circle cx="0" cy="0" r="${200 + progress * 50}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
        </g>
        
        <!-- Tech Icons Animation -->
        <g transform="translate(${this.width / 2}, ${this.height / 2}) rotate(${rotation})">
          <rect x="-200" y="-200" width="60" height="60" fill="rgba(79,209,199,0.6)" rx="10" transform="scale(${scale})"/>
          <rect x="140" y="-200" width="60" height="60" fill="rgba(79,209,199,0.6)" rx="10" transform="scale(${scale})"/>
          <rect x="-200" y="140" width="60" height="60" fill="rgba(79,209,199,0.6)" rx="10" transform="scale(${scale})"/>
          <rect x="140" y="140" width="60" height="60" fill="rgba(79,209,199,0.6)" rx="10" transform="scale(${scale})"/>
        </g>
        
        <!-- Title -->
        <text x="${this.width / 2}" y="${this.height / 2 - 50}" 
              font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
              fill="white" text-anchor="middle" opacity="${opacity}">
          ${scene.title}
        </text>
        
        <!-- Subtitle -->
        <text x="${this.width / 2}" y="${this.height / 2 + 50}" 
              font-family="Arial, sans-serif" font-size="36" 
              fill="rgba(255,255,255,0.8)" text-anchor="middle" opacity="${opacity * 0.8}">
          ${scene.narration.substring(0, 60)}...
        </text>
        
        <!-- Progress Bar -->
        <rect x="${this.width / 2 - 200}" y="${this.height - 100}" 
              width="400" height="4" fill="rgba(255,255,255,0.3)" rx="2"/>
        <rect x="${this.width / 2 - 200}" y="${this.height - 100}" 
              width="${400 * progress}" height="4" fill="#4fd1c7" rx="2"/>
      </svg>
    `;
    }
    createConceptSVG(scene, progress) {
        const slideIn = Math.min(progress * 3, 1);
        const fadeIn = Math.min(progress * 2, 1);
        return `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Dark Background -->
        <rect width="${this.width}" height="${this.height}" fill="#1e293b"/>
        
        <!-- Grid Pattern -->
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="none" stroke="rgba(79,209,199,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="${this.width}" height="${this.height}" fill="url(#grid)"/>
        
        <!-- RAG Components -->
        <g opacity="${fadeIn}">
          <!-- Retrieval Component -->
          <g transform="translate(${300 - (1 - slideIn) * 200}, ${this.height / 2})">
            <circle cx="0" cy="0" r="120" fill="#3b82f6" opacity="0.8"/>
            <text x="0" y="0" font-family="Arial" font-size="32" font-weight="bold" 
                  fill="white" text-anchor="middle" dy="5">
              Retrieval
            </text>
            <text x="0" y="35" font-family="Arial" font-size="20" 
                  fill="white" text-anchor="middle" opacity="0.8">
              검색 시스템
            </text>
          </g>
          
          <!-- Augmented Component -->
          <g transform="translate(${this.width / 2}, ${this.height / 2})">
            <circle cx="0" cy="0" r="120" fill="#10b981" opacity="0.8"/>
            <text x="0" y="0" font-family="Arial" font-size="32" font-weight="bold" 
                  fill="white" text-anchor="middle" dy="5">
              Augmented
            </text>
            <text x="0" y="35" font-family="Arial" font-size="20" 
                  fill="white" text-anchor="middle" opacity="0.8">
              정보 보강
            </text>
          </g>
          
          <!-- Generation Component -->
          <g transform="translate(${this.width - 300 + (1 - slideIn) * 200}, ${this.height / 2})">
            <circle cx="0" cy="0" r="120" fill="#f59e0b" opacity="0.8"/>
            <text x="0" y="0" font-family="Arial" font-size="32" font-weight="bold" 
                  fill="white" text-anchor="middle" dy="5">
              Generation
            </text>
            <text x="0" y="35" font-family="Arial" font-size="20" 
                  fill="white" text-anchor="middle" opacity="0.8">
              응답 생성
            </text>
          </g>
          
          <!-- Connection Lines -->
          <line x1="420" y1="${this.height / 2}" x2="${this.width / 2 - 120}" y2="${this.height / 2}" 
                stroke="white" stroke-width="3" stroke-dasharray="10,5" opacity="${slideIn * 0.5}"/>
          <line x1="${this.width / 2 + 120}" y1="${this.height / 2}" x2="${this.width - 420}" y2="${this.height / 2}" 
                stroke="white" stroke-width="3" stroke-dasharray="10,5" opacity="${slideIn * 0.5}"/>
        </g>
        
        <!-- Title -->
        <text x="${this.width / 2}" y="100" font-family="Arial" font-size="64" font-weight="bold" 
              fill="white" text-anchor="middle">
          ${scene.title}
        </text>
      </svg>
    `;
    }
    createProcessSVG(scene, progress) {
        const step = Math.floor(progress * 4) + 1;
        return `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Gradient Background -->
        <defs>
          <linearGradient id="processBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${this.width}" height="${this.height}" fill="url(#processBg)"/>
        
        <!-- Process Steps -->
        <g transform="translate(${this.width / 2}, ${this.height / 2})">
          <!-- Step 1: Query -->
          <g transform="translate(-600, 0)" opacity="${step >= 1 ? 1 : 0.3}">
            <rect x="-100" y="-60" width="200" height="120" fill="#3b82f6" rx="10"/>
            <text x="0" y="-10" font-family="Arial" font-size="28" font-weight="bold" 
                  fill="white" text-anchor="middle">
              1. Query
            </text>
            <text x="0" y="20" font-family="Arial" font-size="20" 
                  fill="white" text-anchor="middle">
              사용자 질문
            </text>
          </g>
          
          <!-- Arrow 1 -->
          <path d="M -400 0 L -250 0" stroke="white" stroke-width="3" 
                fill="none" marker-end="url(#arrowhead)" opacity="${step >= 2 ? 1 : 0.3}"/>
          
          <!-- Step 2: Search -->
          <g transform="translate(-200, 0)" opacity="${step >= 2 ? 1 : 0.3}">
            <rect x="-100" y="-60" width="200" height="120" fill="#10b981" rx="10"/>
            <text x="0" y="-10" font-family="Arial" font-size="28" font-weight="bold" 
                  fill="white" text-anchor="middle">
              2. Search
            </text>
            <text x="0" y="20" font-family="Arial" font-size="20" 
                  fill="white" text-anchor="middle">
              정보 검색
            </text>
          </g>
          
          <!-- Arrow 2 -->
          <path d="M 0 0 L 150 0" stroke="white" stroke-width="3" 
                fill="none" marker-end="url(#arrowhead)" opacity="${step >= 3 ? 1 : 0.3}"/>
          
          <!-- Step 3: Augment -->
          <g transform="translate(200, 0)" opacity="${step >= 3 ? 1 : 0.3}">
            <rect x="-100" y="-60" width="200" height="120" fill="#f59e0b" rx="10"/>
            <text x="0" y="-10" font-family="Arial" font-size="28" font-weight="bold" 
                  fill="white" text-anchor="middle">
              3. Augment
            </text>
            <text x="0" y="20" font-family="Arial" font-size="20" 
                  fill="white" text-anchor="middle">
              컨텍스트 추가
            </text>
          </g>
          
          <!-- Arrow 3 -->
          <path d="M 400 0 L 550 0" stroke="white" stroke-width="3" 
                fill="none" marker-end="url(#arrowhead)" opacity="${step >= 4 ? 1 : 0.3}"/>
          
          <!-- Step 4: Generate -->
          <g transform="translate(600, 0)" opacity="${step >= 4 ? 1 : 0.3}">
            <rect x="-100" y="-60" width="200" height="120" fill="#ef4444" rx="10"/>
            <text x="0" y="-10" font-family="Arial" font-size="28" font-weight="bold" 
                  fill="white" text-anchor="middle">
              4. Generate
            </text>
            <text x="0" y="20" font-family="Arial" font-size="20" 
                  fill="white" text-anchor="middle">
              응답 생성
            </text>
          </g>
        </g>
        
        <!-- Arrow marker definition -->
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" 
                  refX="10" refY="5" orient="auto">
            <polygon points="0 0, 10 5, 0 10" fill="white"/>
          </marker>
        </defs>
        
        <!-- Title -->
        <text x="${this.width / 2}" y="100" font-family="Arial" font-size="56" font-weight="bold" 
              fill="white" text-anchor="middle">
          RAG 프로세스
        </text>
      </svg>
    `;
    }
    createBenefitsSVG(scene, progress) {
        const fadeIn = Math.min(progress * 3, 1);
        return `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Gradient Background -->
        <defs>
          <radialGradient id="benefitsBg">
            <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
          </radialGradient>
        </defs>
        <rect width="${this.width}" height="${this.height}" fill="url(#benefitsBg)"/>
        
        <!-- Benefits Cards -->
        <g opacity="${fadeIn}">
          <!-- Benefit 1: Accuracy -->
          <g transform="translate(400, 300)">
            <rect x="-150" y="-80" width="300" height="160" fill="rgba(59,130,246,0.8)" rx="15"/>
            <text x="0" y="-20" font-family="Arial" font-size="32" font-weight="bold" 
                  fill="white" text-anchor="middle">
              ✓ 정확성 향상
            </text>
            <text x="0" y="20" font-family="Arial" font-size="20" 
                  fill="rgba(255,255,255,0.9)" text-anchor="middle">
              실시간 정보 반영
            </text>
          </g>
          
          <!-- Benefit 2: Reliability -->
          <g transform="translate(${this.width / 2}, 300)">
            <rect x="-150" y="-80" width="300" height="160" fill="rgba(16,185,129,0.8)" rx="15"/>
            <text x="0" y="-20" font-family="Arial" font-size="32" font-weight="bold" 
                  fill="white" text-anchor="middle">
              ✓ 신뢰성 증가
            </text>
            <text x="0" y="20" font-family="Arial" font-size="20" 
                  fill="rgba(255,255,255,0.9)" text-anchor="middle">
              출처 기반 응답
            </text>
          </g>
          
          <!-- Benefit 3: Flexibility -->
          <g transform="translate(${this.width - 400}, 300)">
            <rect x="-150" y="-80" width="300" height="160" fill="rgba(245,158,11,0.8)" rx="15"/>
            <text x="0" y="-20" font-family="Arial" font-size="32" font-weight="bold" 
                  fill="white" text-anchor="middle">
              ✓ 유연성 확보
            </text>
            <text x="0" y="20" font-family="Arial" font-size="20" 
                  fill="rgba(255,255,255,0.9)" text-anchor="middle">
              도메인 특화 가능
            </text>
          </g>
          
          <!-- Benefit 4: Cost Efficiency -->
          <g transform="translate(${this.width / 2}, 550)">
            <rect x="-150" y="-80" width="300" height="160" fill="rgba(239,68,68,0.8)" rx="15"/>
            <text x="0" y="-20" font-family="Arial" font-size="32" font-weight="bold" 
                  fill="white" text-anchor="middle">
              ✓ 비용 효율성
            </text>
            <text x="0" y="20" font-family="Arial" font-size="20" 
                  fill="rgba(255,255,255,0.9)" text-anchor="middle">
              재학습 불필요
            </text>
          </g>
        </g>
        
        <!-- Title -->
        <text x="${this.width / 2}" y="100" font-family="Arial" font-size="64" font-weight="bold" 
              fill="white" text-anchor="middle">
          RAG의 장점
        </text>
      </svg>
    `;
    }
    createExampleSVG(scene, progress) {
        const codeProgress = Math.min(progress * 20, 1);
        const lines = Math.floor(codeProgress * 10);
        return `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Dark Background -->
        <rect width="${this.width}" height="${this.height}" fill="#0f172a"/>
        
        <!-- Code Editor Style -->
        <rect x="100" y="200" width="${this.width - 200}" height="600" 
              fill="#1e293b" rx="10" stroke="rgba(79,209,199,0.3)" stroke-width="2"/>
        
        <!-- Code Example -->
        <g transform="translate(150, 250)">
          ${lines > 0 ? `<text x="0" y="0" font-family="monospace" font-size="24" fill="#f59e0b">import</text>
          <text x="80" y="0" font-family="monospace" font-size="24" fill="white"> { RAG } </text>
          <text x="180" y="0" font-family="monospace" font-size="24" fill="#f59e0b">from</text>
          <text x="240" y="0" font-family="monospace" font-size="24" fill="#10b981">'langchain'</text>` : ''}
          
          ${lines > 1 ? `<text x="0" y="40" font-family="monospace" font-size="24" fill="#3b82f6">const</text>
          <text x="80" y="40" font-family="monospace" font-size="24" fill="white"> rag = </text>
          <text x="180" y="40" font-family="monospace" font-size="24" fill="#f59e0b">new</text>
          <text x="240" y="40" font-family="monospace" font-size="24" fill="#10b981"> RAG()</text>` : ''}
          
          ${lines > 3 ? `<text x="0" y="120" font-family="monospace" font-size="24" fill="#888">// 문서 로드</text>` : ''}
          
          ${lines > 4 ? `<text x="0" y="160" font-family="monospace" font-size="24" fill="white">rag.</text>
          <text x="50" y="160" font-family="monospace" font-size="24" fill="#f59e0b">loadDocuments</text>
          <text x="220" y="160" font-family="monospace" font-size="24" fill="white">(</text>
          <text x="240" y="160" font-family="monospace" font-size="24" fill="#10b981">'./data'</text>
          <text x="340" y="160" font-family="monospace" font-size="24" fill="white">)</text>` : ''}
          
          ${lines > 6 ? `<text x="0" y="240" font-family="monospace" font-size="24" fill="#888">// 질문하기</text>` : ''}
          
          ${lines > 7 ? `<text x="0" y="280" font-family="monospace" font-size="24" fill="#3b82f6">const</text>
          <text x="80" y="280" font-family="monospace" font-size="24" fill="white"> answer = </text>
          <text x="200" y="280" font-family="monospace" font-size="24" fill="#f59e0b">await</text>
          <text x="280" y="280" font-family="monospace" font-size="24" fill="white"> rag.</text>
          <text x="350" y="280" font-family="monospace" font-size="24" fill="#f59e0b">query</text>
          <text x="430" y="280" font-family="monospace" font-size="24" fill="white">(</text>` : ''}
          
          ${lines > 8 ? `<text x="40" y="320" font-family="monospace" font-size="24" fill="#10b981">'RAG란 무엇인가요?'</text>` : ''}
          
          ${lines > 9 ? `<text x="0" y="360" font-family="monospace" font-size="24" fill="white">)</text>` : ''}
        </g>
        
        <!-- Output Section -->
        ${progress > 0.5 ? `
        <rect x="100" y="850" width="${this.width - 200}" height="150" 
              fill="rgba(16,185,129,0.1)" rx="10" stroke="rgba(16,185,129,0.3)" stroke-width="2"/>
        <text x="150" y="900" font-family="monospace" font-size="20" fill="#10b981">Output:</text>
        <text x="150" y="940" font-family="Arial" font-size="22" fill="white">
          "RAG는 Retrieval-Augmented Generation의 약자로..."
        </text>` : ''}
        
        <!-- Title -->
        <text x="${this.width / 2}" y="100" font-family="Arial" font-size="56" font-weight="bold" 
              fill="white" text-anchor="middle">
          RAG 구현 예제
        </text>
      </svg>
    `;
    }
    createConclusionSVG(scene, progress) {
        const fadeIn = Math.min(progress * 2, 1);
        const scale = 0.5 + progress * 0.5;
        return `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Gradient Background -->
        <defs>
          <linearGradient id="conclusionBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${this.width}" height="${this.height}" fill="url(#conclusionBg)"/>
        
        <!-- Central Circle Animation -->
        <g transform="translate(${this.width / 2}, ${this.height / 2})">
          <circle cx="0" cy="0" r="${200 * scale}" fill="none" 
                  stroke="rgba(79,209,199,0.5)" stroke-width="3" opacity="${fadeIn}"/>
          <circle cx="0" cy="0" r="${150 * scale}" fill="none" 
                  stroke="rgba(79,209,199,0.7)" stroke-width="2" opacity="${fadeIn}"/>
          <circle cx="0" cy="0" r="${100 * scale}" fill="rgba(79,209,199,0.2)" opacity="${fadeIn}"/>
        </g>
        
        <!-- Summary Points -->
        <g opacity="${fadeIn}">
          <text x="${this.width / 2}" y="${this.height / 2 - 150}" 
                font-family="Arial" font-size="36" fill="white" text-anchor="middle">
            ✓ 검색 + AI 생성의 결합
          </text>
          <text x="${this.width / 2}" y="${this.height / 2 - 50}" 
                font-family="Arial" font-size="36" fill="white" text-anchor="middle">
            ✓ 실시간 정보 활용
          </text>
          <text x="${this.width / 2}" y="${this.height / 2 + 50}" 
                font-family="Arial" font-size="36" fill="white" text-anchor="middle">
            ✓ 높은 정확도와 신뢰성
          </text>
        </g>
        
        <!-- Call to Action -->
        <rect x="${this.width / 2 - 200}" y="${this.height - 250}" 
              width="400" height="80" fill="#4fd1c7" rx="40" opacity="${fadeIn}"/>
        <text x="${this.width / 2}" y="${this.height - 200}" 
              font-family="Arial" font-size="32" font-weight="bold" 
              fill="white" text-anchor="middle">
          시작해보세요!
        </text>
        
        <!-- Title -->
        <text x="${this.width / 2}" y="100" font-family="Arial" font-size="72" font-weight="bold" 
              fill="white" text-anchor="middle">
          ${scene.title}
        </text>
      </svg>
    `;
    }
    createDefaultSVG(scene, progress) {
        return `
      <svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${this.width}" height="${this.height}" fill="#1e293b"/>
        <text x="${this.width / 2}" y="${this.height / 2}" 
              font-family="Arial" font-size="64" font-weight="bold" 
              fill="white" text-anchor="middle">
          ${scene.title}
        </text>
      </svg>
    `;
    }
    async getScenario() {
        if (!this.scenarioId)
            return null;
        return await database_1.prisma.scenario.findUnique({
            where: { id: this.scenarioId }
        });
    }
    parseScenes(scenesData) {
        if (typeof scenesData === 'string') {
            try {
                return JSON.parse(scenesData);
            }
            catch {
                return [];
            }
        }
        return scenesData || [];
    }
    async createVideo(framePaths) {
        const videoPath = path.join(this.outputDir, `${this.videoId}.mp4`);
        const framePattern = path.join(this.outputDir, `${this.videoId}_frame_%08d.png`);
        const ffmpegCmd = `ffmpeg -y -r ${this.fps} -i "${framePattern}" -c:v libx264 -pix_fmt yuv420p -preset fast "${videoPath}"`;
        const { stdout, stderr } = await execAsync(ffmpegCmd);
        console.log('[SharpVideoGen] FFmpeg output:', stdout);
        // Clean up frame files
        for (const framePath of framePaths) {
            await fs.unlink(framePath).catch(() => { });
        }
        return videoPath;
    }
    async updateVideoStatus(status, videoPath, error) {
        const updateData = {
            progress: status === 'COMPLETED' ? 100 : 0,
        };
        if (videoPath) {
            updateData.url = videoPath;
        }
        if (error) {
            console.error(`[SharpVideoGen] Video ${this.videoId} error:`, error);
        }
        await database_1.prisma.video.update({
            where: { id: this.videoId },
            data: updateData
        });
    }
}
exports.SharpVideoGenerator = SharpVideoGenerator;
async function startSharpVideoGeneration(videoId, projectId, scenarioId) {
    const generator = new SharpVideoGenerator(videoId, projectId, scenarioId);
    // Run async without waiting
    generator.generate().catch(error => {
        console.error('[SharpVideoGen] Background generation error:', error);
    });
}
