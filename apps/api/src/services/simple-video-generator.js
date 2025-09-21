"use strict";
/**
 * Simple Video Generation Service
 * Creates video content without complex dependencies
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
exports.SimpleVideoGenerator = void 0;
exports.startSimpleVideoGeneration = startSimpleVideoGeneration;
const database_1 = require("../lib/database");
const openai_1 = __importDefault(require("openai"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Initialize OpenAI
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || 'sk-test-key' // Will use mock mode if no key
});
class SimpleVideoGenerator {
    videoId;
    projectId;
    scenarioId;
    outputDir;
    constructor(videoId, projectId, scenarioId) {
        this.videoId = videoId;
        this.projectId = projectId;
        this.scenarioId = scenarioId;
        this.outputDir = path.join(process.cwd(), 'temp', videoId);
    }
    async generate() {
        try {
            console.log(`[VideoGen] Starting generation for ${this.videoId}`);
            // Update status to PROCESSING
            await this.updateVideoStatus('PROCESSING', 10);
            // Step 1: Generate or fetch script
            const scenes = await this.generateScript();
            await this.updateVideoStatus('PROCESSING', 30);
            // Step 2: Generate subtitles
            await this.generateSubtitles(scenes);
            await this.updateVideoStatus('PROCESSING', 50);
            // Step 3: Create simple video frames
            await this.createSimpleFrames(scenes);
            await this.updateVideoStatus('PROCESSING', 70);
            // Step 4: Create video file (or mock it)
            const videoUrl = await this.createVideo();
            await this.updateVideoStatus('PROCESSING', 90);
            // Step 5: Finalize
            await this.finalizeVideo(videoUrl);
            console.log(`[VideoGen] Completed for ${this.videoId}`);
        }
        catch (error) {
            console.error('[VideoGen] Failed:', error);
            await this.updateVideoStatus('FAILED', 0, error.message);
            throw error;
        }
    }
    async generateScript() {
        // If we have a scenario, use it
        if (this.scenarioId) {
            const scenario = await database_1.prisma.scenario.findUnique({
                where: { id: this.scenarioId }
            });
            if (scenario?.scenes) {
                const scenes = typeof scenario.scenes === 'string'
                    ? JSON.parse(scenario.scenes)
                    : scenario.scenes;
                return scenes.map((scene, index) => ({
                    id: `scene_${index}`,
                    type: scene.type || 'content',
                    duration: scene.duration || 5,
                    narration: scene.narration || scene.text || `Scene ${index + 1}`,
                    title: scene.title,
                    subtitle: scene.subtitle
                }));
            }
        }
        // Get video details
        const video = await database_1.prisma.video.findUnique({
            where: { id: this.videoId }
        });
        // Generate mock scenes for demo
        const topic = video?.topic || 'Technology';
        // Try to use OpenAI if API key exists
        if (process.env.OPENAI_API_KEY) {
            try {
                const completion = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'Generate a simple video script with 3-5 scenes. Return JSON array of scenes with: type, duration (seconds), narration, title.'
                        },
                        {
                            role: 'user',
                            content: `Create a short educational video script about: ${topic}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                });
                const content = completion.choices[0].message.content;
                if (content) {
                    try {
                        return JSON.parse(content);
                    }
                    catch {
                        // If parsing fails, use mock data
                    }
                }
            }
            catch (error) {
                console.log('[VideoGen] OpenAI generation failed, using mock data');
            }
        }
        // Return mock scenes if OpenAI fails or no API key
        return [
            {
                id: 'scene_0',
                type: 'title',
                duration: 3,
                narration: `Welcome to our video about ${topic}`,
                title: topic,
                subtitle: 'An Educational Video'
            },
            {
                id: 'scene_1',
                type: 'content',
                duration: 5,
                narration: `${topic} is an important concept in modern technology.`,
                title: 'Introduction',
                subtitle: 'Understanding the basics'
            },
            {
                id: 'scene_2',
                type: 'content',
                duration: 5,
                narration: 'Let\'s explore the key features and benefits.',
                title: 'Key Features',
                subtitle: 'What makes it special'
            },
            {
                id: 'scene_3',
                type: 'conclusion',
                duration: 3,
                narration: 'Thank you for watching this educational video.',
                title: 'Conclusion',
                subtitle: 'Generated by InfoGraphAI'
            }
        ];
    }
    async generateSubtitles(scenes) {
        let currentTime = 0;
        for (const scene of scenes) {
            if (!scene.narration)
                continue;
            // Create subtitle for the scene
            await database_1.prisma.subtitle.create({
                data: {
                    videoId: this.videoId,
                    text: scene.narration,
                    startTime: currentTime,
                    endTime: currentTime + scene.duration,
                    position: 'BOTTOM_CENTER',
                    animationType: 'FADE_IN',
                    fontSize: 24,
                    fontWeight: '500',
                    color: '#FFFFFF',
                    bgColor: 'rgba(0,0,0,0.8)'
                }
            });
            currentTime += scene.duration;
        }
        console.log(`[VideoGen] Generated ${scenes.length} subtitles`);
    }
    async createSimpleFrames(scenes) {
        // Create output directory
        await fs.mkdir(this.outputDir, { recursive: true });
        // Create a simple HTML file representing the video content
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Video: ${this.videoId}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background: #1a1a2e;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .scene {
      width: 90%;
      max-width: 800px;
      margin: 20px;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      animation: fadeIn 0.5s;
    }
    .scene h2 {
      font-size: 2.5em;
      margin: 0 0 20px 0;
      text-align: center;
    }
    .scene h3 {
      font-size: 1.5em;
      margin: 0 0 20px 0;
      text-align: center;
      opacity: 0.9;
    }
    .scene p {
      font-size: 1.2em;
      line-height: 1.6;
      text-align: center;
      opacity: 0.95;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <h1>Generated Video Content</h1>
  ${scenes.map(scene => `
    <div class="scene">
      ${scene.title ? `<h2>${scene.title}</h2>` : ''}
      ${scene.subtitle ? `<h3>${scene.subtitle}</h3>` : ''}
      <p>${scene.narration}</p>
      <small>Duration: ${scene.duration}s</small>
    </div>
  `).join('')}
  <p style="margin-top: 40px; opacity: 0.7;">
    Total Duration: ${scenes.reduce((sum, s) => sum + s.duration, 0)} seconds
  </p>
</body>
</html>`;
        // Save HTML preview
        const htmlPath = path.join(this.outputDir, 'preview.html');
        await fs.writeFile(htmlPath, htmlContent);
        console.log(`[VideoGen] Created preview at ${htmlPath}`);
    }
    async createVideo() {
        // Create public directory
        const publicDir = path.join(process.cwd(), 'public', 'videos');
        await fs.mkdir(publicDir, { recursive: true });
        const videoFileName = `${this.videoId}.mp4`;
        const videoPath = path.join(publicDir, videoFileName);
        try {
            // Get scenario and scenes
            let scenario;
            if (this.scenarioId) {
                console.log(`[VideoGen] Looking for scenario with ID: ${this.scenarioId}`);
                scenario = await database_1.prisma.scenario.findUnique({
                    where: { id: this.scenarioId }
                });
            }
            else {
                console.log(`[VideoGen] Looking for scenario with projectId: ${this.projectId}`);
                scenario = await database_1.prisma.scenario.findFirst({
                    where: { projectId: this.projectId }
                });
            }
            console.log(`[VideoGen] Found scenario:`, scenario?.title || 'None');
            const scenes = scenario?.scenes || [];
            if (scenes.length === 0) {
                throw new Error('No scenes found for video generation');
            }
            const totalDuration = scenes.reduce((sum, s) => sum + (s.duration || 5), 0);
            console.log(`[VideoGen] Creating video with ${scenes.length} scenes, total duration: ${totalDuration}s`);
            // Create individual video segments for each scene
            const segmentPaths = [];
            console.log(`[VideoGen] Starting to create ${scenes.length} individual segments...`);
            for (let i = 0; i < scenes.length; i++) {
                console.log(`[VideoGen] Creating segment ${i + 1}/${scenes.length}...`);
                const scene = scenes[i];
                const duration = scene.duration || 5;
                const segmentPath = path.join(publicDir, `${this.videoId}_segment_${i}.mp4`);
                // Get scene text content with better Korean support
                const title = scene.title || '';
                const narration = scene.narration || '';
                // Use full narration if available, otherwise use title
                const displayText = narration || title || `Scene ${i + 1}`;
                // Create professional color palette and icon based on scene type
                let bgColor = '0x1F2937'; // Default dark gray
                let iconFile = null;
                if (scene.type === 'intro') {
                    bgColor = '0x374151'; // Warm gray
                }
                else if (scene.type === 'conclusion') {
                    bgColor = '0x1F2937'; // Dark gray
                }
                else if (scene.type === 'concept') {
                    bgColor = '0x1E293B'; // Slate
                    // RAG 전체 플로우 다이어그램 추가
                    if (narration && narration.includes('RAG')) {
                        iconFile = path.join(process.cwd(), '../../assets/icons/rag-flow-diagram.svg');
                    }
                }
                else if (scene.type === 'process') {
                    bgColor = '0x0F172A'; // Deep slate
                    // RAG flow specific icons
                    if (narration && (narration.includes('임베딩') || narration.includes('벡터'))) {
                        iconFile = path.join(process.cwd(), '../../assets/icons/rag-search.svg');
                    }
                    else if (narration && (narration.includes('검색') || narration.includes('유사도'))) {
                        iconFile = path.join(process.cwd(), '../../assets/icons/rag-search.svg');
                    }
                    else if (narration && narration.includes('증강')) {
                        iconFile = path.join(process.cwd(), '../../assets/icons/rag-augment.svg');
                    }
                }
                else if (scene.type === 'example') {
                    bgColor = '0x111827'; // Gray-900
                    iconFile = path.join(process.cwd(), '../../assets/icons/rag-generate.svg');
                }
                console.log(`[VideoGen] Creating scene ${i + 1}: "${title}" - "${narration}" (${duration}s)`);
                try {
                    // 한글 지원 폰트 찾기
                    let fontFile = '/System/Library/Fonts/AppleSDGothicNeo.ttc'; // macOS 한글 폰트
                    // 폰트 파일 존재 확인 후 fallback
                    try {
                        await fs.access(fontFile);
                    }
                    catch {
                        fontFile = '/System/Library/Fonts/Helvetica.ttc'; // fallback
                    }
                    // 한글 텍스트 이스케이프 처리 및 줄바꿈
                    function wrapText(text, maxChars) {
                        const words = text.split(' ');
                        const lines = [];
                        let currentLine = '';
                        for (const word of words) {
                            if (currentLine.length + word.length + 1 <= maxChars) {
                                currentLine = currentLine ? currentLine + ' ' + word : word;
                            }
                            else {
                                if (currentLine)
                                    lines.push(currentLine);
                                currentLine = word;
                            }
                        }
                        if (currentLine)
                            lines.push(currentLine);
                        return lines.join('\\n'); // FFmpeg에서 줄바꿈은 \\n
                    }
                    const wrappedText = wrapText(displayText, 50); // 50자 정도에서 줄바꿈
                    const escapedText = wrappedText
                        .replace(/'/g, "\\'")
                        .replace(/"/g, '\\"')
                        .replace(/:/g, '\\:')
                        .replace(/\[/g, '\\[')
                        .replace(/\]/g, '\\]');
                    // 단순한 단계별 접근 - 먼저 배경만 생성
                    const baseCmd = `ffmpeg -y -f lavfi -i "color=c=${bgColor}:s=1920x1080:d=${duration}" -c:v libx264 -pix_fmt yuv420p "${segmentPath}"`;
                    console.log(`[DEBUG] Executing baseCmd:`, baseCmd);
                    await execAsync(baseCmd);
                    console.log(`[VideoGen] ✅ Base background ${i + 1} created`);
                    // 텍스트 오버레이 추가 (한글 지원)
                    const tempPath = segmentPath.replace('.mp4', '_temp.mp4');
                    await execAsync(`mv "${segmentPath}" "${tempPath}"`);
                    // 씬 길이에 맞춘 적절한 애니메이션 타이밍
                    const fadeInTime = Math.min(0.4, duration * 0.15); // 씬 길이의 15% 또는 최대 0.4초
                    const fadeOutTime = Math.min(0.4, duration * 0.15); // 씬 길이의 15% 또는 최대 0.4초
                    const stableTime = Math.max(duration * 0.7, duration - fadeInTime - fadeOutTime); // 안정적인 표시 시간
                    const fadeInEnd = fadeInTime;
                    const fadeOutStart = duration - fadeOutTime;
                    // 부드러운 이징 함수 적용 (cubic ease-in-out)
                    const animatedTextCmd = `ffmpeg -y -i "${tempPath}" -vf "drawtext=fontfile=/System/Library/Fonts/AppleSDGothicNeo.ttc:text='${escapedText}':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=(h-text_h)/2:alpha='if(lt(t,${fadeInEnd}), pow(t/${fadeInTime},2), if(gt(t,${fadeOutStart}), pow((${duration}-t)/${fadeOutTime},2), 1))'" -c:v libx264 -pix_fmt yuv420p "${segmentPath}"`;
                    console.log(`[DEBUG] Executing animatedTextCmd:`, animatedTextCmd);
                    await execAsync(animatedTextCmd);
                    // 제목 추가 (다른 경우만)
                    if (title && title !== narration) {
                        const titlePath = segmentPath.replace('.mp4', '_title.mp4');
                        await execAsync(`mv "${segmentPath}" "${titlePath}"`);
                        const escapedTitle = title.replace(/'/g, '').replace(/"/g, '').replace(/:/g, '').substring(0, 20);
                        // 제목에 적절한 페이드 인 타이밍
                        const titleFadeTime = Math.min(0.6, duration * 0.25); // 씬 길이의 25% 또는 최대 0.6초
                        const titleCmd = `ffmpeg -y -i "${titlePath}" -vf "drawtext=fontfile=/System/Library/Fonts/AppleSDGothicNeo.ttc:text='${escapedTitle}':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=150:alpha='if(lt(t,${titleFadeTime}), pow(t/${titleFadeTime},1.5), 1)'" -c:v libx264 -pix_fmt yuv420p "${segmentPath}"`;
                        console.log(`[DEBUG] Executing titleCmd:`, titleCmd);
                        await execAsync(titleCmd);
                        await execAsync(`rm "${titlePath}"`);
                    }
                    // 텍스트 기반 아이콘 추가 (SVG 대신)
                    if (iconFile) {
                        const tempIconPath = segmentPath.replace('.mp4', '_icon.mp4');
                        await execAsync(`mv "${segmentPath}" "${tempIconPath}"`);
                        // 씬 타입에 따른 텍스트 아이콘 추가 (이모지 대신 한글/영문 텍스트 사용)
                        let iconText = '[정보]'; // 기본 아이콘
                        if (scene.type === 'concept' && narration.includes('RAG')) {
                            iconText = '[RAG]';
                        }
                        else if (scene.type === 'process' && (narration.includes('임베딩') || narration.includes('벡터'))) {
                            iconText = '[벡터]';
                        }
                        else if (scene.type === 'process' && (narration.includes('검색') || narration.includes('유사도'))) {
                            iconText = '[검색]';
                        }
                        else if (scene.type === 'example') {
                            iconText = '[코드]';
                        }
                        // 아이콘 텍스트를 우측 상단에 추가
                        const iconCmd = `ffmpeg -y -i "${tempIconPath}" -vf "drawtext=fontfile=/System/Library/Fonts/AppleSDGothicNeo.ttc:text='${iconText}':fontcolor=white:fontsize=48:x=w-text_w-50:y=50:alpha='if(lt(t,${fadeInTime}), t/${fadeInTime}, if(gt(t,${fadeOutStart}), (${duration}-t)/${fadeOutTime}, 1))'" -c:v libx264 -pix_fmt yuv420p "${segmentPath}"`;
                        console.log(`[DEBUG] Executing iconCmd:`, iconCmd);
                        await execAsync(iconCmd);
                        await execAsync(`rm "${tempIconPath}"`);
                        console.log(`[VideoGen] ✅ Scene ${i + 1} created with text icon: ${iconText}`);
                    }
                    // 임시 파일 정리
                    try {
                        await execAsync(`rm "${tempPath}"`);
                    }
                    catch (cleanupError) {
                        console.log(`[VideoGen] ⚠️ Cleanup warning for scene ${i + 1}:`, cleanupError.message);
                    }
                    console.log(`[VideoGen] ✅ Scene ${i + 1} created with Korean text support`);
                }
                catch (segmentError) {
                    console.log(`[VideoGen] ⚠️ Scene ${i + 1} failed with error:`, segmentError.message);
                    // 영문 fallback
                    const englishText = title.replace(/[^a-zA-Z0-9\s]/g, '') || `Scene ${i + 1}`;
                    const fallbackCmd = `ffmpeg -y -f lavfi -i "color=c=${bgColor}:s=1920x1080:d=${duration}" ` +
                        `-vf "drawtext=text='${englishText}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2" ` +
                        `-c:v libx264 -pix_fmt yuv420p "${segmentPath}"`;
                    console.log(`[DEBUG] Executing fallbackCmd:`, fallbackCmd);
                    await execAsync(fallbackCmd);
                    console.log(`[VideoGen] ✅ Fallback segment ${i + 1} created`);
                }
                segmentPaths.push(segmentPath);
                console.log(`[VideoGen] Created segment ${i + 1}`);
            }
            console.log(`[VideoGen] All ${segmentPaths.length} segments created successfully. Starting concatenation...`);
            // Create concat file for merging segments (more reliable approach)
            const concatPath = path.join(publicDir, `${this.videoId}_concat.txt`);
            // Use basename for relative paths in concat file
            const concatContent = segmentPaths.map(p => `file '${path.basename(p)}'`).join('\n');
            await fs.writeFile(concatPath, concatContent);
            console.log(`[VideoGen] Concat file created with ${segmentPaths.length} segments`);
            console.log(`[DEBUG] Concat file content:`, concatContent);
            // Check if segments exist and their durations
            for (let i = 0; i < segmentPaths.length; i++) {
                const segmentPath = segmentPaths[i];
                try {
                    const stats = await fs.stat(segmentPath);
                    const duration = await execAsync(`ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${segmentPath}"`);
                    console.log(`[DEBUG] Segment ${i + 1}: ${path.basename(segmentPath)} (${stats.size} bytes, ${duration.stdout.trim()}s)`);
                }
                catch (error) {
                    console.log(`[DEBUG] Segment ${i + 1} error:`, error.message);
                }
            }
            // Concatenate all segments with more compatible options
            const concatCmd = `cd "${publicDir}" && ffmpeg -y -f concat -safe 0 -i "${path.basename(concatPath)}" -c:v libx264 -pix_fmt yuv420p "${path.basename(videoPath)}"`;
            console.log(`[DEBUG] Executing concatCmd:`, concatCmd);
            await execAsync(concatCmd);
            console.log(`[VideoGen] Concatenation successful!`);
            // Clean up temporary files
            for (const segmentPath of segmentPaths) {
                await fs.unlink(segmentPath).catch(() => { });
            }
            await fs.unlink(concatPath).catch(() => { });
            console.log(`[VideoGen] Created complete video with ${scenes.length} scene transitions`);
        }
        catch (error) {
            console.log(`[VideoGen] Error creating video:`, error);
            // Ultimate fallback - create a simple test video
            try {
                const fallbackCmd = `ffmpeg -y -f lavfi -i "color=c=0x1E40AF:s=1920x1080:d=10" ` +
                    `-vf "drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='Video Generation Test':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=(h-text_h)/2" ` +
                    `-c:v libx264 -pix_fmt yuv420p -r 30 "${videoPath}"`;
                await execAsync(fallbackCmd);
                console.log(`[VideoGen] Created fallback video`);
            }
            catch (fallbackError) {
                console.log(`[VideoGen] All video generation failed, creating placeholder`);
                await fs.writeFile(videoPath, Buffer.from('PLACEHOLDER_VIDEO'));
            }
        }
        // Copy HTML preview to public directory
        const htmlSource = path.join(this.outputDir, 'preview.html');
        const htmlDest = path.join(publicDir, `${this.videoId}.html`);
        try {
            await fs.copyFile(htmlSource, htmlDest);
        }
        catch (error) {
            console.log('[VideoGen] Could not copy preview HTML');
        }
        // Clean up temp directory
        try {
            await fs.rm(this.outputDir, { recursive: true, force: true });
        }
        catch (error) {
            console.log('[VideoGen] Could not clean temp directory');
        }
        return `/videos/${videoFileName}`;
    }
    async finalizeVideo(videoUrl) {
        // Get file stats if possible
        let fileSize = 0;
        try {
            const fullPath = path.join(process.cwd(), 'public', videoUrl.substring(1));
            const stats = await fs.stat(fullPath);
            fileSize = stats.size;
        }
        catch {
            fileSize = 1024 * 1024; // 1MB placeholder
        }
        // Update video record
        await database_1.prisma.video.update({
            where: { id: this.videoId },
            data: {
                status: 'COMPLETED',
                progress: 100,
                url: videoUrl,
                filename: path.basename(videoUrl),
                size: fileSize
            }
        });
        console.log(`[VideoGen] Video finalized: ${videoUrl}`);
    }
    async updateVideoStatus(status, progress, error) {
        await database_1.prisma.video.update({
            where: { id: this.videoId },
            data: {
                status,
                progress,
                ...(error && { error })
            }
        });
    }
}
exports.SimpleVideoGenerator = SimpleVideoGenerator;
// Export function to start video generation
async function startSimpleVideoGeneration(videoId, projectId, scenarioId) {
    const generator = new SimpleVideoGenerator(videoId, projectId, scenarioId);
    // Run in background
    setImmediate(async () => {
        try {
            await generator.generate();
        }
        catch (error) {
            console.error(`[VideoGen] Generation failed for ${videoId}:`, error);
        }
    });
}
