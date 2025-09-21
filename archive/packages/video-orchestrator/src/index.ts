/**
 * Video Generation Orchestrator
 * 비디오 생성 전체 워크플로우 관리
 */

import Bull, { Queue, Job } from 'bull';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import { Server as SocketServer } from 'socket.io';
import path from 'path';
import fs from 'fs/promises';
import ScenarioManager from '@infographai/scenario-manager';

// 작업 타입
export enum JobType {
  GENERATE_SCRIPT = 'generate_script',
  CREATE_INFOGRAPHICS = 'create_infographics',
  GENERATE_SUBTITLES = 'generate_subtitles',
  SYNTHESIZE_VIDEO = 'synthesize_video',
  UPLOAD_VIDEO = 'upload_video'
}

// 작업 상태
export enum JobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// 비디오 생성 요청
export interface VideoGenerationRequest {
  projectId: string;
  userId: string;
  scenarioId?: string; // 기존 시나리오 사용
  topic?: string; // 시나리오가 없을 때 필요
  duration: number;
  targetAudience: 'beginner' | 'intermediate' | 'advanced';
  language: 'ko' | 'en';
  style?: 'casual' | 'formal' | 'educational';
  keywords?: string[];
  options?: {
    includeCodeExamples?: boolean;
    includeQuiz?: boolean;
    backgroundMusic?: boolean;
    autoUpload?: boolean;
    generateScenario?: boolean; // 시나리오 자동 생성 여부
  };
}

// 작업 결과
export interface JobResult {
  jobId: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  data?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // milliseconds
}

// 비디오 생성 결과
export interface VideoGenerationResult {
  videoId: string;
  projectId: string;
  userId: string;
  videoPath: string;
  thumbnailPath: string;
  duration: number;
  fileSize: number;
  format: string;
  resolution: string;
  subtitles: {
    srt: string;
    vtt: string;
  };
  assets: {
    infographics: string[];
    audio?: string;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    generatedAt: Date;
    processingTime: number;
    totalCost: number;
  };
}

// 워크플로우 단계
export interface WorkflowStep {
  id: string;
  name: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
  output?: any;
}

export class VideoOrchestrator extends EventEmitter {
  private queues: Map<JobType, Queue>;
  private logger: winston.Logger;
  private io: SocketServer | null = null;
  private workflows: Map<string, WorkflowStep[]>;
  private redisUrl: string;
  private outputDir: string;
  private scenarioManager: ScenarioManager;

  constructor(
    redisUrl: string = 'redis://localhost:6379',
    outputDir: string = './output/videos'
  ) {
    super();
    this.redisUrl = redisUrl;
    this.outputDir = outputDir;
    this.queues = new Map();
    this.workflows = new Map();
    this.scenarioManager = new ScenarioManager();

    // Logger 설정
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'video-orchestrator.log' })
      ]
    });

    this.initializeQueues();
    this.ensureOutputDir();
  }

  /**
   * 큐 초기화
   */
  private initializeQueues() {
    const queueOptions = {
      redis: this.redisUrl,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    };

    // 각 작업 타입별 큐 생성
    Object.values(JobType).forEach(type => {
      const queue = new Bull(type, queueOptions);
      this.queues.set(type, queue);

      // 작업 처리 핸들러 등록
      this.registerProcessor(type, queue);

      // 이벤트 리스너
      queue.on('completed', (job, result) => {
        this.handleJobCompleted(type, job, result);
      });

      queue.on('failed', (job, err) => {
        this.handleJobFailed(type, job, err);
      });

      queue.on('progress', (job, progress) => {
        this.handleJobProgress(type, job, progress);
      });
    });

    this.logger.info('Queues initialized', { 
      queues: Array.from(this.queues.keys()) 
    });
  }

  /**
   * 작업 처리기 등록
   */
  private registerProcessor(type: JobType, queue: Queue) {
    queue.process(async (job: Job) => {
      this.logger.info(`Processing job: ${type}`, { jobId: job.id });

      switch (type) {
        case JobType.GENERATE_SCRIPT:
          return await this.processScriptGeneration(job);
        case JobType.CREATE_INFOGRAPHICS:
          return await this.processInfographicCreation(job);
        case JobType.GENERATE_SUBTITLES:
          return await this.processSubtitleGeneration(job);
        case JobType.SYNTHESIZE_VIDEO:
          return await this.processVideoSynthesis(job);
        case JobType.UPLOAD_VIDEO:
          return await this.processVideoUpload(job);
        default:
          throw new Error(`Unknown job type: ${type}`);
      }
    });
  }

  /**
   * 비디오 생성 워크플로우 시작
   */
  public async startVideoGeneration(
    request: VideoGenerationRequest
  ): Promise<string> {
    const workflowId = uuidv4();
    const workflow: WorkflowStep[] = [];

    // 시나리오 처리
    let scenario;
    if (request.scenarioId) {
      // 기존 시나리오 사용
      scenario = await this.scenarioManager.getScenario(request.scenarioId);
    } else if (request.options?.generateScenario && request.topic) {
      // 시나리오 자동 생성
      scenario = await this.scenarioManager.generateScenario({
        topic: request.topic,
        duration: request.duration,
        targetAudience: request.targetAudience,
        language: request.language,
        style: request.style || 'educational',
        keywords: request.keywords
      }, request.userId);
    }

    // 워크플로우 단계 정의
    const steps = [
      { id: uuidv4(), name: '스크립트 생성', type: JobType.GENERATE_SCRIPT },
      { id: uuidv4(), name: '인포그래픽 생성', type: JobType.CREATE_INFOGRAPHICS },
      { id: uuidv4(), name: '자막 생성', type: JobType.GENERATE_SUBTITLES },
      { id: uuidv4(), name: '비디오 합성', type: JobType.SYNTHESIZE_VIDEO }
    ];

    if (request.options?.autoUpload) {
      steps.push({ 
        id: uuidv4(), 
        name: '비디오 업로드', 
        type: JobType.UPLOAD_VIDEO 
      });
    }

    // 워크플로우 초기화
    steps.forEach(step => {
      workflow.push({
        ...step,
        status: JobStatus.PENDING,
        progress: 0
      });
    });

    this.workflows.set(workflowId, workflow);

    // 첫 번째 작업 시작
    const firstJob = await this.queues.get(JobType.GENERATE_SCRIPT)!.add({
      workflowId,
      request,
      scenario,
      stepIndex: 0
    });

    this.logger.info('Video generation workflow started', {
      workflowId,
      projectId: request.projectId,
      steps: steps.length
    });

    // 실시간 업데이트 전송
    this.emitWorkflowUpdate(workflowId, workflow);

    return workflowId;
  }

  /**
   * 스크립트 생성 처리
   */
  private async processScriptGeneration(job: Job): Promise<any> {
    const { workflowId, request, scenario } = job.data;
    
    // 진행 상태 업데이트
    await job.progress(10);

    let script;
    if (scenario) {
      // 시나리오가 있으면 시나리오 기반 스크립트 생성
      script = {
        title: scenario.title,
        introduction: scenario.description,
        sections: scenario.scenes.map(scene => ({
          title: scene.title,
          content: scene.content,
          duration: scene.duration,
          visualSuggestions: [scene.visualType, scene.visualPrompt].filter(Boolean)
        })),
        conclusion: scenario.metadata?.conclusion || '감사합니다!',
        metadata: scenario.metadata
      };
    } else {
      // 시나리오가 없으면 기존 방식대로 생성
      script = {
        title: `${request.topic} 완벽 가이드`,
        introduction: `안녕하세요! 오늘은 ${request.topic}에 대해 알아보겠습니다.`,
      sections: [
        {
          title: '개요',
          content: `${request.topic}의 기본 개념을 설명합니다.`,
          duration: 30,
          visualSuggestions: ['다이어그램', '플로우차트']
        },
        {
          title: '핵심 기능',
          content: '주요 기능과 사용법을 살펴봅니다.',
          duration: 60,
          visualSuggestions: ['코드 예제', '비교 차트']
        },
        {
          title: '실습',
          content: '실제 예제를 통해 학습합니다.',
          duration: request.duration - 100,
          visualSuggestions: ['스크린 레코딩', '단계별 가이드']
        },
        {
          title: '마무리',
          content: '오늘 배운 내용을 정리합니다.',
          duration: 10,
          visualSuggestions: ['요약 슬라이드']
        }
      ],
      conclusion: '감사합니다! 다음 시간에 만나요.',
      keywords: request.keywords || [],
      estimatedDuration: request.duration
    };

    await job.progress(100);

    // 다음 단계 시작
    await this.startNextStep(workflowId, 1, { script });

    return script;
  }

  /**
   * 인포그래픽 생성 처리
   */
  private async processInfographicCreation(job: Job): Promise<any> {
    const { workflowId, script } = job.data;
    
    await job.progress(20);

    const infographics = [];
    
    // 각 섹션별 인포그래픽 생성
    for (let i = 0; i < script.sections.length; i++) {
      const section = script.sections[i];
      
      // 인포그래픽 생성 시뮬레이션
      const asset = {
        sectionIndex: i,
        type: 'infographic',
        path: path.join(this.outputDir, `infographic_${i}.png`),
        width: 1920,
        height: 1080,
        format: 'png'
      };
      
      infographics.push(asset);
      await job.progress(20 + (60 * (i + 1) / script.sections.length));
    }

    await job.progress(100);

    // 다음 단계 시작
    await this.startNextStep(workflowId, 2, { script, infographics });

    return infographics;
  }

  /**
   * 자막 생성 처리
   */
  private async processSubtitleGeneration(job: Job): Promise<any> {
    const { workflowId, script } = job.data;
    
    await job.progress(30);

    const subtitles = [];
    let currentTime = 0;

    // 각 섹션별 자막 생성
    for (const section of script.sections) {
      const sectionDuration = section.duration * 1000; // to ms
      const chunks = this.splitTextIntoChunks(section.content, 40);
      const chunkDuration = sectionDuration / chunks.length;

      chunks.forEach((chunk, index) => {
        subtitles.push({
          id: subtitles.length + 1,
          startTime: currentTime,
          endTime: currentTime + chunkDuration - 100,
          text: chunk
        });
        currentTime += chunkDuration;
      });
    }

    await job.progress(80);

    // SRT 파일 생성
    const srtPath = await this.generateSRTFile(workflowId, subtitles);
    
    await job.progress(100);

    // 다음 단계 시작
    await this.startNextStep(workflowId, 3, {
      script,
      infographics: job.data.infographics,
      subtitles,
      srtPath
    });

    return { subtitles, srtPath };
  }

  /**
   * 비디오 합성 처리
   */
  private async processVideoSynthesis(job: Job): Promise<any> {
    const { workflowId, script, infographics, subtitles, srtPath } = job.data;
    
    await job.progress(10);

    // FFmpeg를 사용한 비디오 합성 시뮬레이션
    const videoPath = path.join(this.outputDir, `${workflowId}.mp4`);
    const thumbnailPath = path.join(this.outputDir, `${workflowId}_thumb.jpg`);

    // 실제 구현에서는 FFmpeg 명령 실행
    await job.progress(50);

    const videoResult: VideoGenerationResult = {
      videoId: workflowId,
      projectId: job.data.request?.projectId || 'unknown',
      userId: job.data.request?.userId || 'unknown',
      videoPath,
      thumbnailPath,
      duration: script.estimatedDuration,
      fileSize: 50 * 1024 * 1024, // 50MB (예시)
      format: 'mp4',
      resolution: '1920x1080',
      subtitles: {
        srt: srtPath,
        vtt: srtPath.replace('.srt', '.vtt')
      },
      assets: {
        infographics: infographics.map((i: any) => i.path)
      },
      metadata: {
        title: script.title,
        description: script.introduction,
        keywords: script.keywords,
        generatedAt: new Date(),
        processingTime: Date.now() - job.timestamp,
        totalCost: 0.10
      }
    };

    await job.progress(100);

    // 워크플로우 완료 또는 다음 단계
    const workflow = this.workflows.get(workflowId);
    if (workflow && workflow.length > 4) {
      await this.startNextStep(workflowId, 4, { video: videoResult });
    } else {
      this.completeWorkflow(workflowId, videoResult);
    }

    return videoResult;
  }

  /**
   * 비디오 업로드 처리
   */
  private async processVideoUpload(job: Job): Promise<any> {
    const { video } = job.data;
    
    await job.progress(50);

    // YouTube API 또는 다른 플랫폼 업로드 시뮬레이션
    const uploadResult = {
      platform: 'youtube',
      videoId: uuidv4(),
      url: `https://youtube.com/watch?v=${uuidv4()}`,
      uploadedAt: new Date()
    };

    await job.progress(100);

    return uploadResult;
  }

  /**
   * 다음 워크플로우 단계 시작
   */
  private async startNextStep(
    workflowId: string,
    stepIndex: number,
    data: any
  ) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || stepIndex >= workflow.length) return;

    const step = workflow[stepIndex];
    step.status = JobStatus.PENDING;
    step.startTime = new Date();

    const queue = this.queues.get(step.type);
    if (queue) {
      await queue.add({
        workflowId,
        stepIndex,
        ...data
      });
    }

    this.emitWorkflowUpdate(workflowId, workflow);
  }

  /**
   * 워크플로우 완료
   */
  private completeWorkflow(workflowId: string, result: VideoGenerationResult) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return;

    workflow.forEach(step => {
      if (step.status === JobStatus.PROCESSING) {
        step.status = JobStatus.COMPLETED;
        step.progress = 100;
        step.endTime = new Date();
      }
    });

    this.logger.info('Workflow completed', {
      workflowId,
      videoId: result.videoId,
      duration: result.metadata.processingTime
    });

    this.emit('workflow:completed', { workflowId, result });
    this.emitWorkflowUpdate(workflowId, workflow);
  }

  /**
   * 작업 완료 핸들러
   */
  private handleJobCompleted(type: JobType, job: Job, result: any) {
    const { workflowId, stepIndex } = job.data;
    const workflow = this.workflows.get(workflowId);
    
    if (workflow && stepIndex < workflow.length) {
      const step = workflow[stepIndex];
      step.status = JobStatus.COMPLETED;
      step.progress = 100;
      step.endTime = new Date();
      step.output = result;

      this.emitWorkflowUpdate(workflowId, workflow);
    }

    this.logger.info(`Job completed: ${type}`, {
      jobId: job.id,
      workflowId
    });
  }

  /**
   * 작업 실패 핸들러
   */
  private handleJobFailed(type: JobType, job: Job, error: Error) {
    const { workflowId, stepIndex } = job.data;
    const workflow = this.workflows.get(workflowId);
    
    if (workflow && stepIndex < workflow.length) {
      const step = workflow[stepIndex];
      step.status = JobStatus.FAILED;
      step.endTime = new Date();
      step.error = error.message;

      // 워크플로우 중단
      this.emit('workflow:failed', { workflowId, error });
      this.emitWorkflowUpdate(workflowId, workflow);
    }

    this.logger.error(`Job failed: ${type}`, {
      jobId: job.id,
      workflowId,
      error: error.message
    });
  }

  /**
   * 작업 진행 상태 핸들러
   */
  private handleJobProgress(type: JobType, job: Job, progress: number) {
    const { workflowId, stepIndex } = job.data;
    const workflow = this.workflows.get(workflowId);
    
    if (workflow && stepIndex < workflow.length) {
      const step = workflow[stepIndex];
      step.status = JobStatus.PROCESSING;
      step.progress = progress;

      this.emitWorkflowUpdate(workflowId, workflow);
    }
  }

  /**
   * 워크플로우 상태 업데이트 전송
   */
  private emitWorkflowUpdate(workflowId: string, workflow: WorkflowStep[]) {
    const totalProgress = workflow.reduce((sum, step) => sum + step.progress, 0) / workflow.length;

    const update = {
      workflowId,
      steps: workflow,
      totalProgress,
      status: this.getWorkflowStatus(workflow)
    };

    this.emit('workflow:update', update);

    // WebSocket으로 실시간 전송
    if (this.io) {
      this.io.emit('workflow:update', update);
    }
  }

  /**
   * 워크플로우 전체 상태 계산
   */
  private getWorkflowStatus(workflow: WorkflowStep[]): JobStatus {
    if (workflow.some(step => step.status === JobStatus.FAILED)) {
      return JobStatus.FAILED;
    }
    if (workflow.every(step => step.status === JobStatus.COMPLETED)) {
      return JobStatus.COMPLETED;
    }
    if (workflow.some(step => step.status === JobStatus.PROCESSING)) {
      return JobStatus.PROCESSING;
    }
    return JobStatus.PENDING;
  }

  /**
   * 텍스트를 자막 청크로 분할
   */
  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    const words = text.split(' ');
    const chunks: string[] = [];
    let current = '';

    for (const word of words) {
      if ((current + ' ' + word).length <= maxLength) {
        current = current ? `${current} ${word}` : word;
      } else {
        if (current) chunks.push(current);
        current = word;
      }
    }
    if (current) chunks.push(current);

    return chunks;
  }

  /**
   * SRT 파일 생성
   */
  private async generateSRTFile(
    workflowId: string,
    subtitles: any[]
  ): Promise<string> {
    const srtContent = subtitles.map((sub, index) => {
      const startTime = this.formatSRTTime(sub.startTime);
      const endTime = this.formatSRTTime(sub.endTime);
      return `${index + 1}\n${startTime} --> ${endTime}\n${sub.text}\n`;
    }).join('\n');

    const srtPath = path.join(this.outputDir, `${workflowId}.srt`);
    await fs.writeFile(srtPath, srtContent, 'utf-8');

    return srtPath;
  }

  /**
   * SRT 시간 포맷
   */
  private formatSRTTime(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  }

  /**
   * 출력 디렉토리 생성
   */
  private async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create output directory', { error });
    }
  }

  /**
   * WebSocket 서버 설정
   */
  public setSocketServer(io: SocketServer) {
    this.io = io;
    this.logger.info('Socket server attached');
  }

  /**
   * 워크플로우 상태 조회
   */
  public getWorkflowStatus(workflowId: string): WorkflowStep[] | null {
    return this.workflows.get(workflowId) || null;
  }

  /**
   * 워크플로우 취소
   */
  public async cancelWorkflow(workflowId: string): Promise<boolean> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return false;

    // 모든 대기 중인 작업 취소
    for (const [type, queue] of this.queues) {
      const jobs = await queue.getJobs(['waiting', 'delayed']);
      for (const job of jobs) {
        if (job.data.workflowId === workflowId) {
          await job.remove();
        }
      }
    }

    // 워크플로우 상태 업데이트
    workflow.forEach(step => {
      if (step.status === JobStatus.PENDING || step.status === JobStatus.PROCESSING) {
        step.status = JobStatus.CANCELLED;
      }
    });

    this.emitWorkflowUpdate(workflowId, workflow);
    this.logger.info('Workflow cancelled', { workflowId });

    return true;
  }

  /**
   * 큐 상태 조회
   */
  public async getQueueStats(): Promise<any> {
    const stats: any = {};

    for (const [type, queue] of this.queues) {
      const jobCounts = await queue.getJobCounts();
      stats[type] = {
        waiting: jobCounts.waiting,
        active: jobCounts.active,
        completed: jobCounts.completed,
        failed: jobCounts.failed
      };
    }

    return stats;
  }

  /**
   * 정리
   */
  public async cleanup() {
    for (const queue of this.queues.values()) {
      await queue.close();
    }
    this.logger.info('Orchestrator cleaned up');
  }
}

export default VideoOrchestrator;