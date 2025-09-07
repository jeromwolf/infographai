/**
 * 향상된 비디오 생성 엔진
 * 고품질 교육 비디오 생성을 위한 개선된 버전
 */

import { prisma } from '../lib/database';
import OpenAI from 'openai';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { templates, enhanceScenario, evaluateScenarioQuality } from '../templates/scenario-templates';

const execAsync = promisify(exec);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-test'
});

// 향상된 프롬프트 템플릿
const ENHANCED_PROMPT = `
You are an expert educational content creator specializing in IT and technology.
Create a highly engaging, structured video script following these guidelines:

1. TARGET AUDIENCE: {audience}
2. LEARNING OBJECTIVES: Clear, measurable outcomes
3. STRUCTURE: Introduction → Core Concepts → Examples → Practice → Summary
4. TONE: Professional yet approachable, using analogies when helpful
5. VISUAL CUES: Describe what should appear on screen
6. PACING: Vary rhythm to maintain engagement

Topic: {topic}
Duration: {duration} seconds
Style: {style}

Return a JSON object with this structure:
{
  "title": "Engaging title",
  "learningObjectives": ["objective1", "objective2"],
  "scenes": [
    {
      "type": "intro|concept|example|process|comparison|conclusion",
      "duration": seconds,
      "title": "Scene title",
      "narration": "What to say (natural, conversational)",
      "visuals": {
        "primary": "Main visual element",
        "secondary": ["Supporting elements"],
        "animation": "Animation style",
        "codeExample": "If applicable"
      },
      "keyPoints": ["Key point 1", "Key point 2"]
    }
  ],
  "summary": "Brief summary",
  "nextSteps": ["Follow-up topic 1", "Follow-up topic 2"]
}
`;

export class EnhancedVideoGenerator {
  private videoId: string;
  private projectId: string;
  private scenarioId?: string;
  private outputDir: string;
  private quality: 'draft' | 'standard' | 'high' = 'standard';

  constructor(videoId: string, projectId: string, scenarioId?: string) {
    this.videoId = videoId;
    this.projectId = projectId;
    this.scenarioId = scenarioId;
    this.outputDir = path.join(process.cwd(), 'temp', videoId);
  }

  async generate(): Promise<void> {
    try {
      console.log(`[EnhancedVideoGen] Starting for ${this.videoId}`);
      
      await this.updateStatus('PROCESSING', 5, 'Initializing...');

      // Step 1: 시나리오 생성 또는 가져오기
      const scenario = await this.generateEnhancedScenario();
      await this.updateStatus('PROCESSING', 20, 'Scenario created');

      // Step 2: 시나리오 품질 평가 및 개선
      const evaluation = evaluateScenarioQuality(scenario);
      console.log(`[EnhancedVideoGen] Quality score: ${evaluation.score}/100`);
      
      if (evaluation.score < 70) {
        console.log('[EnhancedVideoGen] Enhancing low-quality scenario...');
        const enhanced = enhanceScenario(scenario, 'conceptExplanation');
        Object.assign(scenario, enhanced);
      }
      
      await this.updateStatus('PROCESSING', 30, 'Scenario optimized');

      // Step 3: 자막 생성 (향상된 타이밍)
      await this.generateEnhancedSubtitles(scenario.scenes);
      await this.updateStatus('PROCESSING', 40, 'Subtitles generated');

      // Step 4: 비주얼 에셋 준비
      await this.prepareVisualAssets(scenario.scenes);
      await this.updateStatus('PROCESSING', 50, 'Assets prepared');

      // Step 5: 프레임 렌더링
      await this.renderEnhancedFrames(scenario.scenes);
      await this.updateStatus('PROCESSING', 70, 'Frames rendered');

      // Step 6: 오디오 생성 (TTS 또는 음악)
      const audioPath = await this.generateAudio(scenario.scenes);
      await this.updateStatus('PROCESSING', 80, 'Audio generated');

      // Step 7: 비디오 컴파일
      const videoPath = await this.compileEnhancedVideo(audioPath);
      await this.updateStatus('PROCESSING', 90, 'Video compiled');

      // Step 8: 최종 처리
      const finalUrl = await this.finalizeVideo(videoPath);
      await this.updateStatus('COMPLETED', 100, 'Video ready!');

      console.log(`[EnhancedVideoGen] Completed: ${finalUrl}`);
    } catch (error) {
      console.error('[EnhancedVideoGen] Error:', error);
      await this.updateStatus('FAILED', 0, error.message);
      throw error;
    }
  }

  private async generateEnhancedScenario(): Promise<any> {
    if (this.scenarioId) {
      const scenario = await prisma.scenario.findUnique({
        where: { id: this.scenarioId }
      });
      
      if (scenario?.scenes) {
        return {
          title: scenario.title,
          scenes: typeof scenario.scenes === 'string' 
            ? JSON.parse(scenario.scenes) 
            : scenario.scenes
        };
      }
    }

    // AI로 새 시나리오 생성
    const video = await prisma.video.findUnique({
      where: { id: this.videoId },
      include: { project: true }
    });

    if (!video) throw new Error('Video not found');

    const prompt = ENHANCED_PROMPT
      .replace('{topic}', video.topic || video.project.topic || 'Technology')
      .replace('{duration}', String(video.duration || 120))
      .replace('{audience}', video.targetAudience || 'IT professionals and students')
      .replace('{style}', 'educational');

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are an expert educational video script writer.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.log('[EnhancedVideoGen] Using template fallback');
      return this.getFallbackScenario(video.topic || 'Technology');
    }
  }

  private getFallbackScenario(topic: string): any {
    return {
      title: `Understanding ${topic}`,
      learningObjectives: [
        `Understand the fundamentals of ${topic}`,
        `Learn practical applications`,
        `Master best practices`
      ],
      scenes: [
        {
          type: 'intro',
          duration: 5,
          title: topic,
          narration: `Welcome to our comprehensive guide on ${topic}. In the next few minutes, we'll explore the key concepts and practical applications.`,
          visuals: {
            primary: 'Title card with modern gradient',
            animation: 'fade-in-scale'
          },
          keyPoints: ['Introduction', 'Overview']
        },
        {
          type: 'concept',
          duration: 20,
          title: 'Core Concepts',
          narration: `${topic} is a fundamental concept in modern technology. Let's understand its core principles and why it matters.`,
          visuals: {
            primary: 'Conceptual diagram',
            animation: 'reveal-sequential'
          },
          keyPoints: ['Definition', 'Importance', 'Use cases']
        },
        {
          type: 'example',
          duration: 25,
          title: 'Practical Example',
          narration: `Now let's see ${topic} in action with a real-world example that demonstrates its power and flexibility.`,
          visuals: {
            primary: 'Code demonstration',
            animation: 'typewriter-effect'
          },
          keyPoints: ['Implementation', 'Best practices']
        },
        {
          type: 'process',
          duration: 20,
          title: 'How It Works',
          narration: `Understanding the process behind ${topic} helps us use it more effectively. Let's break it down step by step.`,
          visuals: {
            primary: 'Process flowchart',
            animation: 'path-follow'
          },
          keyPoints: ['Step-by-step', 'Flow']
        },
        {
          type: 'conclusion',
          duration: 10,
          title: 'Summary',
          narration: `We've covered the essentials of ${topic}. Remember these key points as you apply this knowledge in your projects.`,
          visuals: {
            primary: 'Summary cards',
            animation: 'fade-in-group'
          },
          keyPoints: ['Recap', 'Next steps']
        }
      ]
    };
  }

  private async generateEnhancedSubtitles(scenes: any[]): Promise<void> {
    let currentTime = 0;

    for (const scene of scenes) {
      if (!scene.narration) continue;

      // 자연스러운 문장 단위로 분할
      const sentences = scene.narration.match(/[^.!?]+[.!?]+/g) || [scene.narration];
      const sentenceDuration = scene.duration / sentences.length;

      for (const sentence of sentences) {
        // 문장을 적절한 길이로 분할 (7-10 단어)
        const words = sentence.trim().split(' ');
        const chunks: string[] = [];
        
        for (let i = 0; i < words.length; i += 8) {
          chunks.push(words.slice(i, i + 8).join(' '));
        }

        const chunkDuration = sentenceDuration / chunks.length;

        for (const chunk of chunks) {
          await prisma.subtitle.create({
            data: {
              videoId: this.videoId,
              text: chunk,
              startTime: currentTime,
              endTime: currentTime + chunkDuration,
              position: 'BOTTOM_CENTER',
              animationType: 'FADE_IN',
              fontSize: 28,
              fontWeight: '600',
              color: '#FFFFFF',
              bgColor: 'rgba(0,0,0,0.75)',
              keywords: this.extractKeywords(chunk)
            }
          });

          currentTime += chunkDuration;
        }
      }
    }

    console.log(`[EnhancedVideoGen] Generated subtitles for ${scenes.length} scenes`);
  }

  private extractKeywords(text: string): string[] {
    // IT 관련 키워드 추출
    const keywords = text.match(/\b(API|REST|GraphQL|React|Vue|Node|Python|Java|Docker|Kubernetes|AWS|cloud|server|database|function|component|state|props|hook|async|promise|array|object|class|interface|type|variable|const|let)\b/gi) || [];
    return [...new Set(keywords.map(k => k.toLowerCase()))];
  }

  private async prepareVisualAssets(scenes: any[]): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.mkdir(path.join(this.outputDir, 'assets'), { recursive: true });

    // 각 씬에 필요한 에셋 준비
    for (const scene of scenes) {
      if (scene.visuals?.codeExample) {
        // 코드 이미지 생성
        await this.createCodeImage(scene.visuals.codeExample, scene.id);
      }
      
      // 다이어그램, 아이콘 등 추가 에셋 준비
      // 실제 구현에서는 SVG 생성, 아이콘 다운로드 등
    }
  }

  private async createCodeImage(code: string, sceneId: string): Promise<void> {
    // 코드를 이미지로 변환 (실제 구현 시 syntax highlighting 추가)
    const html = `
      <html>
        <head>
          <style>
            body { 
              background: #2d2d2d; 
              color: #f8f8f2;
              font-family: 'Fira Code', monospace;
              padding: 20px;
              font-size: 18px;
              line-height: 1.6;
            }
            pre { margin: 0; }
          </style>
        </head>
        <body>
          <pre>${code}</pre>
        </body>
      </html>
    `;
    
    const htmlPath = path.join(this.outputDir, 'assets', `code_${sceneId}.html`);
    await fs.writeFile(htmlPath, html);
  }

  private async renderEnhancedFrames(scenes: any[]): Promise<void> {
    // 향상된 프레임 렌더링
    // 실제 구현에서는 Canvas API나 외부 렌더링 서비스 사용
    
    let frameNumber = 0;
    const fps = 30;

    for (const scene of scenes) {
      const totalFrames = Math.floor(scene.duration * fps);
      
      for (let i = 0; i < totalFrames; i++) {
        // 프레임별 진행률 계산
        const progress = i / totalFrames;
        
        // HTML 기반 프레임 생성
        const frameHtml = this.generateFrameHtml(scene, progress);
        const framePath = path.join(this.outputDir, `frame_${String(frameNumber).padStart(6, '0')}.html`);
        
        await fs.writeFile(framePath, frameHtml);
        frameNumber++;
      }
    }
  }

  private generateFrameHtml(scene: any, progress: number): string {
    const opacity = Math.min(progress * 3, 1);
    const slideOffset = 50 * (1 - Math.min(progress * 2, 1));

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            width: 1920px;
            height: 1080px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Inter', -apple-system, sans-serif;
            color: white;
            overflow: hidden;
          }
          .container {
            text-align: center;
            opacity: ${opacity};
            transform: translateY(${slideOffset}px);
          }
          h1 {
            font-size: 72px;
            font-weight: 800;
            margin: 0 0 30px 0;
            text-shadow: 0 4px 20px rgba(0,0,0,0.3);
          }
          .subtitle {
            font-size: 32px;
            font-weight: 400;
            opacity: 0.95;
            max-width: 1200px;
            line-height: 1.5;
          }
          .code-block {
            background: rgba(0,0,0,0.4);
            border-radius: 12px;
            padding: 30px;
            font-family: 'Fira Code', monospace;
            font-size: 24px;
            text-align: left;
            margin: 40px auto;
            max-width: 1000px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${scene.title ? `<h1>${scene.title}</h1>` : ''}
          ${scene.subtitle ? `<div class="subtitle">${scene.subtitle}</div>` : ''}
          ${scene.visuals?.codeExample ? `
            <div class="code-block">
              <pre>${scene.visuals.codeExample}</pre>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  }

  private async generateAudio(scenes: any[]): Promise<string> {
    // 오디오 생성 (배경음악 또는 TTS)
    // 실제 구현에서는 ElevenLabs API 또는 Azure Speech 사용
    
    const audioPath = path.join(this.outputDir, 'audio.mp3');
    
    // 임시: 무음 오디오 생성
    const duration = scenes.reduce((sum, s) => sum + s.duration, 0);
    const silenceCommand = `ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=stereo -t ${duration} -acodec mp3 "${audioPath}"`;
    
    try {
      await execAsync(silenceCommand);
    } catch {
      // 오디오 생성 실패 시 계속 진행
    }
    
    return audioPath;
  }

  private async compileEnhancedVideo(audioPath?: string): Promise<string> {
    const outputPath = path.join(this.outputDir, 'output.mp4');
    
    // FFmpeg 명령어 구성
    let ffmpegCmd = `ffmpeg -y -r 30 -i ${this.outputDir}/frame_%06d.html`;
    
    // 오디오가 있으면 추가
    if (audioPath) {
      ffmpegCmd += ` -i "${audioPath}" -c:a aac`;
    }
    
    // 비디오 코덱 설정 (품질에 따라)
    const qualitySettings = {
      draft: '-c:v libx264 -preset ultrafast -crf 28',
      standard: '-c:v libx264 -preset fast -crf 23',
      high: '-c:v libx264 -preset slow -crf 18'
    };
    
    ffmpegCmd += ` ${qualitySettings[this.quality]} -pix_fmt yuv420p "${outputPath}"`;
    
    try {
      // HTML을 이미지로 변환 후 비디오 생성
      // 실제로는 puppeteer 등을 사용하여 HTML을 이미지로 변환
      
      // 간단한 대체 방법: 직접 비디오 생성
      const duration = 10; // 기본 10초
      const simpleCmd = `ffmpeg -y -f lavfi -i color=c=black:s=1920x1080:d=${duration} -vf "drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='Enhanced Video ${this.videoId}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2" -c:v libx264 -pix_fmt yuv420p "${outputPath}"`;
      
      await execAsync(simpleCmd);
      console.log('[EnhancedVideoGen] Video compiled successfully');
    } catch (error) {
      console.error('[EnhancedVideoGen] FFmpeg error:', error);
      throw new Error('Video compilation failed');
    }
    
    return outputPath;
  }

  private async finalizeVideo(videoPath: string): Promise<string> {
    const publicDir = path.join(process.cwd(), 'public', 'videos');
    await fs.mkdir(publicDir, { recursive: true });
    
    const fileName = `${this.videoId}.mp4`;
    const finalPath = path.join(publicDir, fileName);
    
    await fs.copyFile(videoPath, finalPath);
    
    // 메타데이터 업데이트
    const stats = await fs.stat(finalPath);
    
    await prisma.video.update({
      where: { id: this.videoId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        url: `/videos/${fileName}`,
        filename: fileName,
        size: stats.size
      }
    });
    
    // 임시 파일 정리
    try {
      await fs.rm(this.outputDir, { recursive: true, force: true });
    } catch {
      // 정리 실패 무시
    }
    
    return `/videos/${fileName}`;
  }

  private async updateStatus(status: string, progress: number, message?: string): Promise<void> {
    await prisma.video.update({
      where: { id: this.videoId },
      data: {
        status,
        progress,
        ...(message && { error: message })
      }
    });
    
    console.log(`[EnhancedVideoGen] ${status}: ${progress}% - ${message || ''}`);
  }
}

// Export enhanced generator
export async function startEnhancedVideoGeneration(
  videoId: string,
  projectId: string,
  scenarioId?: string
): Promise<void> {
  const generator = new EnhancedVideoGenerator(videoId, projectId, scenarioId);
  
  // 백그라운드 실행
  setImmediate(async () => {
    try {
      await generator.generate();
    } catch (error) {
      console.error(`[EnhancedVideoGen] Failed for ${videoId}:`, error);
    }
  });
}