/**
 * Canvas-based Infographic Video Generator
 * 실제 인포그래픽과 애니메이션이 포함된 비디오 생성
 */

import { createCanvas, registerFont, loadImage } from 'canvas';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { prisma } from '../lib/database';

const execAsync = promisify(exec);

interface Scene {
  id: string;
  type: string;
  title: string;
  narration: string;
  duration: number;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    animation?: string;
    infographic?: string;
  };
}

export class CanvasVideoGenerator {
  private videoId: string;
  private projectId: string;
  private scenarioId?: string;
  private outputDir: string;
  private fps = 30;
  private width = 1920;
  private height = 1080;

  constructor(videoId: string, projectId: string, scenarioId?: string) {
    this.videoId = videoId;
    this.projectId = projectId;
    this.scenarioId = scenarioId;
    this.outputDir = path.join(process.cwd(), 'public', 'videos');
  }

  async generate(): Promise<void> {
    try {
      console.log(`[CanvasVideoGen] Starting generation for ${this.videoId}`);
      
      // 1. Get scenario data
      const scenario = await this.getScenario();
      if (!scenario) {
        throw new Error('Scenario not found');
      }

      const scenes = scenario.scenes as Scene[];
      
      // 2. Create frames for each scene
      const allFramePaths: string[] = [];
      
      for (let sceneIndex = 0; sceneIndex < scenes.length; sceneIndex++) {
        const scene = scenes[sceneIndex];
        const framePaths = await this.createSceneFrames(scene, sceneIndex);
        allFramePaths.push(...framePaths);
      }
      
      // 3. Create video from frames
      const videoPath = await this.createVideoFromFrames(allFramePaths);
      
      // 4. Update video status
      await this.updateVideoStatus('COMPLETED', videoPath);
      
      // 5. Clean up frames
      await this.cleanupFrames(allFramePaths);
      
      console.log(`[CanvasVideoGen] Video generation completed: ${videoPath}`);
    } catch (error) {
      console.error('[CanvasVideoGen] Error:', error);
      await this.updateVideoStatus('FAILED', null, error.message);
      throw error;
    }
  }

  private async getScenario() {
    if (this.scenarioId) {
      return await prisma.scenario.findUnique({
        where: { id: this.scenarioId }
      });
    }
    return await prisma.scenario.findFirst({
      where: { projectId: this.projectId },
      orderBy: { createdAt: 'desc' }
    });
  }

  private async createSceneFrames(scene: Scene, sceneIndex: number): Promise<string[]> {
    const frameCount = scene.duration * this.fps;
    const framePaths: string[] = [];
    
    console.log(`[CanvasVideoGen] Creating ${frameCount} frames for scene ${sceneIndex + 1}: ${scene.title} (type: ${scene.type})`);
    
    for (let frameNum = 0; frameNum < frameCount; frameNum++) {
      const canvas = createCanvas(this.width, this.height);
      const ctx = canvas.getContext('2d');
      
      // Progress for animations (0 to 1)
      const progress = frameNum / frameCount;
      
      // Always draw something first - default background
      ctx.fillStyle = '#2d3748'; // Dark blue-gray background
      ctx.fillRect(0, 0, this.width, this.height);
      
      // FORCE VISIBLE CONTENT - Always draw title and progress info
      console.log(`[CanvasVideoGen] Drawing frame ${frameNum} for scene: ${scene.type} - "${scene.title}"`);
      
      // Draw title (always visible)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(scene.title || 'No Title', this.width / 2, this.height / 2 - 100);
      
      // Draw scene type
      ctx.fillStyle = '#a0aec0';
      ctx.font = '32px Arial';
      ctx.fillText(`Scene Type: ${scene.type}`, this.width / 2, this.height / 2 - 40);
      
      // Draw progress indicator
      ctx.fillStyle = '#4fd1c7';
      ctx.font = '28px Arial';
      ctx.fillText(`Frame: ${frameNum + 1} | Progress: ${Math.round(progress * 100)}%`, this.width / 2, this.height / 2 + 20);
      
      // Draw narration preview
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '24px Arial';
      const shortNarration = scene.narration ? scene.narration.substring(0, 80) + '...' : 'No narration';
      ctx.fillText(shortNarration, this.width / 2, this.height / 2 + 80);
      
      // Add simple animation - moving circle
      ctx.strokeStyle = '#4fd1c7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      const circleX = this.width / 2 + Math.sin(progress * Math.PI * 2) * 200;
      const circleY = this.height / 2 + 150;
      ctx.arc(circleX, circleY, 30, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw based on scene type (optional - fallback to forced content above)
      try {
        if (scene.type === 'intro') {
          await this.drawIntroScene(ctx, scene, progress);
        } else if (scene.type === 'definition' || scene.type === 'concept') {
          await this.drawConceptScene(ctx, scene, progress);
        } else if (scene.type === 'process' || scene.type === 'workflow') {
          await this.drawProcessScene(ctx, scene, progress);
        } else if (scene.type === 'benefits' || scene.type === 'features') {
          await this.drawBenefitsScene(ctx, scene, progress);
        } else if (scene.type === 'example' || scene.type === 'applications') {
          await this.drawExampleScene(ctx, scene, progress);
        } else if (scene.type === 'conclusion') {
          await this.drawConclusionScene(ctx, scene, progress);
        } else {
          console.log(`[CanvasVideoGen] Using default scene for type: ${scene.type}`);
          await this.drawDefaultScene(ctx, scene, progress);
        }
      } catch (error) {
        console.error(`[CanvasVideoGen] Error drawing scene ${sceneIndex + 1}:`, error);
        // The forced content above will still be visible
      }
      
      // Save frame
      const frameNumber = sceneIndex * 10000 + frameNum;
      const framePath = path.join(this.outputDir, `${this.videoId}_frame_${frameNumber.toString().padStart(8, '0')}.png`);
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(framePath, buffer);
      framePaths.push(framePath);
    }
    
    return framePaths;
  }

  private async drawIntroScene(ctx: CanvasRenderingContext2D, scene: Scene, progress: number) {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Animated circle patterns
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const radius = 100 + i * 50 + progress * 20;
      ctx.beginPath();
      ctx.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Title with fade-in animation
    const alpha = Math.min(progress * 2, 1);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scene.title, this.width / 2, this.height / 2 - 50);
    
    // Subtitle
    ctx.font = '40px Arial';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
    ctx.fillText(scene.narration.substring(0, 50), this.width / 2, this.height / 2 + 50);
  }

  private async drawConceptScene(ctx: CanvasRenderingContext2D, scene: Scene, progress: number) {
    // Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // RAG concept visualization
    if (scene.title.includes('RAG')) {
      // Draw three connected components
      const components = [
        { x: this.width * 0.2, y: this.height * 0.5, label: 'Retrieval', color: '#3b82f6' },
        { x: this.width * 0.5, y: this.height * 0.5, label: 'Augmented', color: '#10b981' },
        { x: this.width * 0.8, y: this.height * 0.5, label: 'Generation', color: '#f59e0b' }
      ];
      
      // Draw connections with animation
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      
      for (let i = 0; i < components.length - 1; i++) {
        const drawLength = progress * (components[i + 1].x - components[i].x);
        ctx.beginPath();
        ctx.moveTo(components[i].x + 80, components[i].y);
        ctx.lineTo(components[i].x + 80 + drawLength, components[i].y);
        ctx.stroke();
      }
      
      // Draw components
      components.forEach((comp, index) => {
        const scale = index <= progress * components.length ? 1 : 0;
        
        // Circle
        ctx.fillStyle = comp.color;
        ctx.beginPath();
        ctx.arc(comp.x, comp.y, 80 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Icon/Letter
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(comp.label[0], comp.x, comp.y);
        
        // Label
        ctx.font = '32px Arial';
        ctx.fillText(comp.label, comp.x, comp.y + 120);
      });
    }
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scene.title, this.width / 2, 150);
    
    // Description
    ctx.font = '36px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const words = scene.narration.split(' ');
    const lineLength = 10;
    for (let i = 0; i < Math.min(words.length, 20); i += lineLength) {
      const line = words.slice(i, i + lineLength).join(' ');
      ctx.fillText(line, this.width / 2, this.height - 200 + (i / lineLength) * 40);
    }
  }

  private async drawProcessScene(ctx: CanvasRenderingContext2D, scene: Scene, progress: number) {
    // Background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scene.title, this.width / 2, 100);
    
    // Process flow diagram
    const steps = [
      { x: 200, y: 400, text: '문서 입력' },
      { x: 500, y: 400, text: '임베딩' },
      { x: 800, y: 400, text: '벡터 DB' },
      { x: 1100, y: 400, text: '검색' },
      { x: 1400, y: 400, text: 'LLM' },
      { x: 1700, y: 400, text: '답변' }
    ];
    
    // Draw process flow with animation
    const visibleSteps = Math.floor(progress * steps.length);
    
    steps.forEach((step, index) => {
      if (index <= visibleSteps) {
        // Draw box
        ctx.fillStyle = index === visibleSteps ? '#3b82f6' : '#374151';
        ctx.fillRect(step.x - 80, step.y - 40, 160, 80);
        
        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(step.text, step.x, step.y);
        
        // Draw arrow to next step
        if (index < visibleSteps && index < steps.length - 1) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(step.x + 80, step.y);
          ctx.lineTo(steps[index + 1].x - 80, steps[index + 1].y);
          ctx.stroke();
          
          // Arrowhead
          ctx.beginPath();
          ctx.moveTo(steps[index + 1].x - 90, steps[index + 1].y - 10);
          ctx.lineTo(steps[index + 1].x - 80, steps[index + 1].y);
          ctx.lineTo(steps[index + 1].x - 90, steps[index + 1].y + 10);
          ctx.stroke();
        }
      }
    });
    
    // Description
    ctx.font = '32px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(scene.narration.substring(0, 80), this.width / 2, this.height - 150);
  }

  private async drawBenefitsScene(ctx: CanvasRenderingContext2D, scene: Scene, progress: number) {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#065f46');
    gradient.addColorStop(1, '#064e3b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scene.title, this.width / 2, 100);
    
    // Benefits list with icons
    const benefits = [
      { icon: '✓', text: '정확성 향상', color: '#10b981' },
      { icon: '✓', text: '최신 정보 활용', color: '#10b981' },
      { icon: '✓', text: '환각 현상 감소', color: '#10b981' },
      { icon: '✓', text: '도메인 특화', color: '#10b981' }
    ];
    
    const visibleBenefits = Math.floor(progress * benefits.length);
    
    benefits.forEach((benefit, index) => {
      if (index <= visibleBenefits) {
        const y = 300 + index * 120;
        const slideIn = Math.min((progress * benefits.length - index) * 2, 1);
        const x = 400 + (1 - slideIn) * 200;
        
        // Icon circle
        ctx.fillStyle = benefit.color;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Icon
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(benefit.icon, x, y + 10);
        
        // Text
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(benefit.text, x + 80, y + 10);
      }
    });
  }

  private async drawExampleScene(ctx: CanvasRenderingContext2D, scene: Scene, progress: number) {
    // Background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scene.title, this.width / 2, 100);
    
    // Example cards with fade-in animation
    const examples = [
      { x: 300, y: 300, title: '고객 지원', desc: 'FAQ 자동 응답' },
      { x: 700, y: 300, title: '문서 검색', desc: '내부 지식 활용' },
      { x: 1100, y: 300, title: '코드 도우미', desc: '문서 기반 코딩' },
      { x: 1500, y: 300, title: '교육 도구', desc: '맞춤형 학습' }
    ];
    
    examples.forEach((example, index) => {
      const alpha = Math.min((progress * 4 - index) * 0.5, 1);
      
      if (alpha > 0) {
        // Card background
        ctx.fillStyle = `rgba(55, 65, 81, ${alpha})`;
        ctx.fillRect(example.x - 150, example.y - 100, 300, 200);
        
        // Card border
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(example.x - 150, example.y - 100, 300, 200);
        
        // Title
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(example.title, example.x, example.y - 20);
        
        // Description
        ctx.font = '24px Arial';
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.fillText(example.desc, example.x, example.y + 30);
      }
    });
  }

  private async drawConclusionScene(ctx: CanvasRenderingContext2D, scene: Scene, progress: number) {
    // Gradient background
    const gradient = ctx.createRadialGradient(
      this.width / 2, this.height / 2, 0,
      this.width / 2, this.height / 2, this.width / 2
    );
    gradient.addColorStop(0, '#764ba2');
    gradient.addColorStop(1, '#667eea');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Pulse animation
    const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.1;
    
    // Main message
    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(pulseScale, pulseScale);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scene.title, 0, -50);
    
    ctx.font = '40px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(scene.narration.substring(0, 60), 0, 50);
    
    ctx.restore();
    
    // Call to action
    const fadeIn = Math.min(progress * 2, 1);
    ctx.fillStyle = `rgba(255, 255, 255, ${fadeIn})`;
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('InfoGraphAI로 제작되었습니다', this.width / 2, this.height - 100);
  }

  private async drawDefaultScene(ctx: CanvasRenderingContext2D, scene: Scene, progress: number) {
    // Simple default scene
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.width, this.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(scene.title, this.width / 2, this.height / 2 - 50);
    
    ctx.font = '36px Arial';
    ctx.fillText(scene.narration.substring(0, 80), this.width / 2, this.height / 2 + 50);
  }

  private async createVideoFromFrames(framePaths: string[]): Promise<string> {
    const videoPath = path.join(this.outputDir, `${this.videoId}.mp4`);
    const framePattern = path.join(this.outputDir, `${this.videoId}_frame_%08d.png`);
    
    console.log(`[CanvasVideoGen] Creating video from ${framePaths.length} frames`);
    
    const ffmpegCmd = `ffmpeg -y -r ${this.fps} -i "${framePattern}" -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p "${videoPath}"`;
    
    await execAsync(ffmpegCmd);
    
    return `/videos/${this.videoId}.mp4`;
  }

  private async cleanupFrames(framePaths: string[]) {
    console.log(`[CanvasVideoGen] Cleaning up ${framePaths.length} frames`);
    for (const framePath of framePaths) {
      try {
        await fs.unlink(framePath);
      } catch (error) {
        console.error(`Failed to delete frame: ${framePath}`);
      }
    }
  }

  private async updateVideoStatus(status: string, outputUrl?: string, error?: string) {
    const updateData: any = {
      // status, // Video 모델에 status 필드가 없으므로 제거
      progress: status === 'COMPLETED' ? 100 : 0,
    };
    
    if (outputUrl) {
      updateData.url = outputUrl;
    }
    
    // error 필드도 없으므로 로그만 출력
    if (error) {
      console.error(`[CanvasVideoGen] Video ${this.videoId} error:`, error);
    }
    
    await prisma.video.update({
      where: { id: this.videoId },
      data: updateData
    });
  }
}

export async function startCanvasVideoGeneration(
  videoId: string,
  projectId: string,
  scenarioId?: string
): Promise<void> {
  const generator = new CanvasVideoGenerator(videoId, projectId, scenarioId);
  
  // Update status to processing
  await prisma.video.update({
    where: { id: videoId },
    data: {
      status: 'PROCESSING',
      progress: 0
    }
  });
  
  // Start generation asynchronously
  generator.generate().catch(error => {
    console.error(`[startCanvasVideoGeneration] Error:`, error);
  });
}