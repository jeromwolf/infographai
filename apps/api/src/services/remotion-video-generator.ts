import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

interface RemotionScene {
  id: string;
  type: string;
  duration: number;
  title: string;
  narration: string;
  style: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    animation: string;
    infographic: string;
  };
}

interface RemotionVideoProps {
  title: string;
  scenes: RemotionScene[];
  style?: {
    colorPalette?: string[];
    fontFamily?: string;
  };
}

export class RemotionVideoGenerator {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'videos');
  }

  /**
   * Remotion을 사용하여 비디오 생성
   */
  async generate(videoId: string, projectId: string, scenarioId?: string): Promise<void> {
    try {
      console.log(`[RemotionVideoGenerator] Starting video generation for ${videoId}`);

      // 1. 시나리오 데이터 가져오기
      const scenarioData = await this.getScenarioData(scenarioId, projectId);
      if (!scenarioData) {
        throw new Error('시나리오를 찾을 수 없습니다');
      }

      // 2. Remotion Props 변환
      const remotionProps = await this.convertToRemotionProps(scenarioData);

      // 3. Remotion으로 렌더링 (실제 Remotion 패키지가 설치되면 활성화)
      const videoPath = await this.renderWithRemotion(videoId, remotionProps);

      // 4. 비디오 정보 업데이트
      await this.finalizeVideo(videoId, videoPath);

      console.log(`[RemotionVideoGenerator] Video generation completed: ${videoPath}`);
    } catch (error) {
      console.error('[RemotionVideoGenerator] Generation failed:', error);
      await this.updateVideoStatus(videoId, 'FAILED', error.message);
      throw error;
    }
  }

  /**
   * 시나리오 데이터 조회
   */
  private async getScenarioData(scenarioId?: string, projectId?: string): Promise<any> {
    if (scenarioId) {
      return await prisma.scenario.findUnique({
        where: { id: scenarioId },
        include: { project: true }
      });
    }

    if (projectId) {
      return await prisma.scenario.findFirst({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
        include: { project: true }
      });
    }

    return null;
  }

  /**
   * 시나리오 데이터를 Remotion Props로 변환
   */
  private async convertToRemotionProps(scenarioData: any): Promise<RemotionVideoProps> {
    // scenes가 이미 JSON 객체인지 문자열인지 확인
    let scenes: any[];
    if (typeof scenarioData.scenes === 'string') {
      try {
        scenes = JSON.parse(scenarioData.scenes);
      } catch (error) {
        console.error('Failed to parse scenes JSON:', error);
        scenes = [];
      }
    } else {
      scenes = scenarioData.scenes || [];
    }

    // 각 씬을 Remotion 형식으로 변환
    const remotionScenes: RemotionScene[] = scenes.map((scene: any, index: number) => ({
      id: scene.id || `scene_${index + 1}`,
      type: scene.type || 'general',
      duration: scene.duration || 5,
      title: scene.title || `Scene ${index + 1}`,
      narration: scene.narration || scene.content || '',
      style: scene.style || {
        backgroundColor: this.getDefaultBackgroundColor(index),
        textColor: '#ffffff',
        accentColor: this.getDefaultAccentColor(index),
        animation: scene.animation || 'fadeIn',
        infographic: scene.infographic || 'simple-icon'
      }
    }));

    return {
      title: scenarioData.title || 'Untitled Video',
      scenes: remotionScenes,
      style: {
        colorPalette: ['#667eea', '#764ba2', '#f093fb'],
        fontFamily: 'AppleSDGothicNeo, sans-serif'
      }
    };
  }

  /**
   * 기본 배경색 생성
   */
  private getDefaultBackgroundColor(index: number): string {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#5f72bd', '#9921e8'];
    return colors[index % colors.length];
  }

  /**
   * 기본 강조색 생성
   */
  private getDefaultAccentColor(index: number): string {
    const colors = ['#f093fb', '#667eea', '#9921e8', '#764ba2', '#5f72bd'];
    return colors[index % colors.length];
  }

  /**
   * Remotion으로 비디오 렌더링
   * 현재는 모의 구현 - 실제 Remotion 패키지 설치 후 활성화
   */
  private async renderWithRemotion(
    videoId: string,
    props: RemotionVideoProps
  ): Promise<string> {
    console.log('[RemotionVideoGenerator] Rendering with Remotion (Mock)');
    
    // 출력 디렉토리 확인
    await fs.mkdir(this.outputDir, { recursive: true });
    
    const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
    
    // TODO: 실제 Remotion 렌더링 구현
    // 현재는 테스트를 위해 더미 파일 생성
    try {
      // Remotion 패키지가 설치되면 아래 코드 활성화
      /*
      const { bundle } = require('@remotion/bundler');
      const { renderMedia, selectComposition } = require('@remotion/renderer');
      
      // 번들링
      const bundleLocation = await bundle({
        entryPoint: path.join(__dirname, '../remotion/index.tsx'),
        webpackOverride: (config) => config,
      });
      
      // 컴포지션 선택
      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'AutoVideoComposition',
        inputProps: props
      });
      
      // 렌더링
      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps: props,
        imageFormat: 'jpeg',
        ffmpegExecutable: null, // Use system ffmpeg
        ffmpegOverride: (info) => info,
        onProgress: ({ progress }) => {
          console.log(`Rendering progress: ${(progress * 100).toFixed(2)}%`);
        }
      });
      */
      
      // 임시: 더미 파일 생성 (테스트용)
      await fs.writeFile(
        outputPath,
        Buffer.from('Mock video content for ' + videoId)
      );
      
      console.log(`[RemotionVideoGenerator] Mock video created at ${outputPath}`);
    } catch (error) {
      console.error('[RemotionVideoGenerator] Rendering error:', error);
      throw new Error(`비디오 렌더링 실패: ${error.message}`);
    }
    
    return `/videos/${videoId}.mp4`;
  }

  /**
   * 비디오 생성 완료 처리
   */
  private async finalizeVideo(videoId: string, videoPath: string): Promise<void> {
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        outputUrl: videoPath,
        metadata: {
          completedAt: new Date().toISOString(),
          generator: 'remotion'
        }
      }
    });
  }

  /**
   * 비디오 상태 업데이트
   */
  private async updateVideoStatus(
    videoId: string,
    status: string,
    error?: string
  ): Promise<void> {
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status,
        metadata: {
          error,
          updatedAt: new Date().toISOString()
        }
      }
    });
  }
}

/**
 * 비디오 생성 시작 함수 (기존 API와의 호환성 유지)
 */
export async function startRemotionVideoGeneration(
  videoId: string,
  projectId: string,
  scenarioId?: string
): Promise<void> {
  const generator = new RemotionVideoGenerator();
  
  // 비디오 상태를 PROCESSING으로 업데이트
  await prisma.video.update({
    where: { id: videoId },
    data: {
      status: 'PROCESSING',
      progress: 0,
      metadata: {
        startedAt: new Date().toISOString(),
        generator: 'remotion'
      }
    }
  });
  
  // 비동기로 비디오 생성 시작
  generator.generate(videoId, projectId, scenarioId).catch(error => {
    console.error(`[startRemotionVideoGeneration] Error:`, error);
  });
}