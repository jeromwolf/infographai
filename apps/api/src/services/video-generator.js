"use strict";
/**
 * Video Generation Service
 * Handles the complete video generation pipeline
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
exports.VideoGenerator = void 0;
exports.startVideoGeneration = startVideoGeneration;
const database_1 = require("../lib/database");
const openai_1 = __importDefault(require("openai"));
const canvas_1 = require("canvas");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Initialize OpenAI
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || ''
});
class VideoGenerator {
    videoId;
    projectId;
    scenarioId;
    outputDir;
    frameRate = 30;
    width = 1920;
    height = 1080;
    constructor(videoId, projectId, scenarioId) {
        this.videoId = videoId;
        this.projectId = projectId;
        this.scenarioId = scenarioId;
        this.outputDir = path.join(process.cwd(), 'temp', videoId);
    }
    async generate() {
        try {
            console.log(`Starting video generation for ${this.videoId}`);
            // Update status to PROCESSING
            await this.updateVideoStatus('PROCESSING', 10);
            // Step 1: Generate or fetch script
            const script = await this.generateScript();
            await this.updateVideoStatus('PROCESSING', 25);
            // Step 2: Parse script into scenes
            const scenes = await this.parseScriptToScenes(script);
            await this.updateVideoStatus('PROCESSING', 40);
            // Step 3: Generate subtitles
            await this.generateSubtitles(scenes);
            await this.updateVideoStatus('PROCESSING', 50);
            // Step 4: Render frames for each scene
            await this.renderScenes(scenes);
            await this.updateVideoStatus('PROCESSING', 70);
            // Step 5: Compile video with FFmpeg
            const videoPath = await this.compileVideo();
            await this.updateVideoStatus('PROCESSING', 90);
            // Step 6: Upload to storage (for now, just save locally)
            const finalPath = await this.saveVideo(videoPath);
            // Step 7: Update video record with final URL
            await this.finalizeVideo(finalPath);
            console.log(`Video generation completed for ${this.videoId}`);
        }
        catch (error) {
            console.error('Video generation failed:', error);
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
                return JSON.stringify(scenario.scenes);
            }
        }
        // Otherwise generate from video topic
        const video = await database_1.prisma.video.findUnique({
            where: { id: this.videoId }
        });
        if (!video?.topic) {
            throw new Error('No topic found for video generation');
        }
        // Generate script using OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert educational content creator specializing in IT and technology topics. 
                   Create a structured video script for a ${video.duration || 120} second educational video.
                   The script should be engaging, informative, and suitable for visual presentation.`
                },
                {
                    role: 'user',
                    content: `Create a video script about: ${video.topic}
                   Target audience: ${video.targetAudience || 'IT professionals and students'}
                   Duration: ${video.duration || 120} seconds
                   
                   Format the response as a JSON array of scenes with:
                   - type: 'title' | 'content' | 'comparison' | 'process' | 'conclusion'
                   - duration: seconds for this scene
                   - narration: what to say
                   - visuals: description of visual elements`
                }
            ],
            response_format: { type: 'json_object' }
        });
        return completion.choices[0].message.content || '[]';
    }
    async parseScriptToScenes(scriptJson) {
        try {
            const parsed = JSON.parse(scriptJson);
            const scenes = parsed.scenes || parsed;
            // Ensure scenes have proper structure
            return scenes.map((scene, index) => ({
                id: `scene_${index}`,
                type: scene.type || 'content',
                duration: scene.duration || 5,
                narration: scene.narration || scene.text || '',
                visuals: {
                    background: scene.background || '#1a1a2e',
                    title: scene.title || scene.visuals?.title,
                    subtitle: scene.subtitle || scene.visuals?.subtitle,
                    elements: scene.elements || scene.visuals?.elements || []
                }
            }));
        }
        catch (error) {
            console.error('Failed to parse script:', error);
            // Return a simple default scene
            return [{
                    id: 'scene_0',
                    type: 'title',
                    duration: 5,
                    narration: 'Welcome to this educational video',
                    visuals: {
                        background: '#1a1a2e',
                        title: 'Educational Video',
                        subtitle: 'Generated by InfoGraphAI'
                    }
                }];
        }
    }
    async generateSubtitles(scenes) {
        let currentTime = 0;
        for (const scene of scenes) {
            if (!scene.narration)
                continue;
            // Split narration into subtitle chunks
            const words = scene.narration.split(' ');
            const wordsPerSubtitle = 8;
            const subtitleDuration = scene.duration / Math.ceil(words.length / wordsPerSubtitle);
            for (let i = 0; i < words.length; i += wordsPerSubtitle) {
                const text = words.slice(i, i + wordsPerSubtitle).join(' ');
                await database_1.prisma.subtitle.create({
                    data: {
                        videoId: this.videoId,
                        text,
                        startTime: currentTime,
                        endTime: currentTime + subtitleDuration,
                        position: 'BOTTOM_CENTER',
                        animationType: 'FADE_IN'
                    }
                });
                currentTime += subtitleDuration;
            }
        }
    }
    async renderScenes(scenes) {
        // Create output directory
        await fs.mkdir(this.outputDir, { recursive: true });
        let frameNumber = 0;
        for (const scene of scenes) {
            const totalFrames = Math.floor(scene.duration * this.frameRate);
            for (let i = 0; i < totalFrames; i++) {
                const canvas = (0, canvas_1.createCanvas)(this.width, this.height);
                const ctx = canvas.getContext('2d');
                // Render scene to canvas
                await this.renderScene(ctx, scene, i / totalFrames);
                // Save frame as image
                const buffer = canvas.toBuffer('image/png');
                const framePath = path.join(this.outputDir, `frame_${String(frameNumber).padStart(6, '0')}.png`);
                await fs.writeFile(framePath, buffer);
                frameNumber++;
            }
        }
    }
    async renderScene(ctx, scene, progress) {
        // Clear canvas with background
        ctx.fillStyle = scene.visuals.background || '#1a1a2e';
        ctx.fillRect(0, 0, this.width, this.height);
        // Render title
        if (scene.visuals.title) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 72px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Add fade-in animation
            const opacity = Math.min(progress * 3, 1);
            ctx.globalAlpha = opacity;
            ctx.fillText(scene.visuals.title, this.width / 2, this.height / 3);
        }
        // Render subtitle
        if (scene.visuals.subtitle) {
            ctx.fillStyle = '#cccccc';
            ctx.font = '36px Arial';
            ctx.textAlign = 'center';
            ctx.globalAlpha = Math.min(progress * 2, 1);
            ctx.fillText(scene.visuals.subtitle, this.width / 2, this.height / 2);
        }
        // Render elements
        if (scene.visuals.elements) {
            for (const element of scene.visuals.elements) {
                ctx.globalAlpha = 1;
                if (element.type === 'text') {
                    ctx.fillStyle = element.style?.color || '#ffffff';
                    ctx.font = element.style?.font || '24px Arial';
                    ctx.fillText(element.content, element.position.x, element.position.y);
                }
                else if (element.type === 'shape') {
                    ctx.fillStyle = element.style?.color || '#4a90e2';
                    // Draw a simple rectangle for now
                    ctx.fillRect(element.position.x, element.position.y, 100, 100);
                }
            }
        }
        // Reset alpha
        ctx.globalAlpha = 1;
    }
    async compileVideo() {
        const outputPath = path.join(this.outputDir, 'output.mp4');
        // Use FFmpeg to compile frames into video
        const ffmpegCommand = `ffmpeg -y -r ${this.frameRate} -i ${this.outputDir}/frame_%06d.png -c:v libx264 -pix_fmt yuv420p -preset fast ${outputPath}`;
        try {
            await execAsync(ffmpegCommand);
            return outputPath;
        }
        catch (error) {
            console.error('FFmpeg compilation failed:', error);
            throw new Error('Failed to compile video');
        }
    }
    async saveVideo(videoPath) {
        // For now, save to a public directory
        const publicDir = path.join(process.cwd(), 'public', 'videos');
        await fs.mkdir(publicDir, { recursive: true });
        const fileName = `${this.videoId}.mp4`;
        const finalPath = path.join(publicDir, fileName);
        // Copy video to public directory
        await fs.copyFile(videoPath, finalPath);
        // Clean up temp files
        await fs.rm(this.outputDir, { recursive: true, force: true });
        // Return relative URL
        return `/videos/${fileName}`;
    }
    async finalizeVideo(videoUrl) {
        // Get file stats
        const stats = await fs.stat(path.join(process.cwd(), 'public', videoUrl.substring(1)));
        // Update video record
        await database_1.prisma.video.update({
            where: { id: this.videoId },
            data: {
                status: 'COMPLETED',
                progress: 100,
                url: videoUrl,
                filename: path.basename(videoUrl),
                size: stats.size
            }
        });
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
exports.VideoGenerator = VideoGenerator;
// Export function to start video generation
async function startVideoGeneration(videoId, projectId, scenarioId) {
    const generator = new VideoGenerator(videoId, projectId, scenarioId);
    // Run in background (in production, use a job queue)
    setImmediate(async () => {
        try {
            await generator.generate();
        }
        catch (error) {
            console.error(`Video generation failed for ${videoId}:`, error);
        }
    });
}
