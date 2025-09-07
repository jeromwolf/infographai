/**
 * Video Generation Orchestrator
 * 비디오 생성 전체 워크플로우 관리
 */
import { EventEmitter } from 'events';
import { Server as SocketServer } from 'socket.io';
export declare enum JobType {
    GENERATE_SCRIPT = "generate_script",
    CREATE_INFOGRAPHICS = "create_infographics",
    GENERATE_SUBTITLES = "generate_subtitles",
    SYNTHESIZE_VIDEO = "synthesize_video",
    UPLOAD_VIDEO = "upload_video"
}
export declare enum JobStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export interface VideoGenerationRequest {
    projectId: string;
    userId: string;
    scenarioId?: string;
    topic?: string;
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
        generateScenario?: boolean;
    };
}
export interface JobResult {
    jobId: string;
    type: JobType;
    status: JobStatus;
    progress: number;
    data?: any;
    error?: string;
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
}
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
export declare class VideoOrchestrator extends EventEmitter {
    private queues;
    private logger;
    private io;
    private workflows;
    private redisUrl;
    private outputDir;
    private scenarioManager;
    constructor(redisUrl?: string, outputDir?: string);
    /**
     * 큐 초기화
     */
    private initializeQueues;
    /**
     * 작업 처리기 등록
     */
    private registerProcessor;
    /**
     * 비디오 생성 워크플로우 시작
     */
    startVideoGeneration(request: VideoGenerationRequest): Promise<string>;
    /**
     * 스크립트 생성 처리
     */
    private processScriptGeneration;
    /**
     * 인포그래픽 생성 처리
     */
    private processInfographicCreation;
    /**
     * 자막 생성 처리
     */
    private processSubtitleGeneration;
    /**
     * 비디오 합성 처리
     */
    private processVideoSynthesis;
    /**
     * 비디오 업로드 처리
     */
    private processVideoUpload;
    /**
     * 다음 워크플로우 단계 시작
     */
    private startNextStep;
    /**
     * 워크플로우 완료
     */
    private completeWorkflow;
    /**
     * 작업 완료 핸들러
     */
    private handleJobCompleted;
    /**
     * 작업 실패 핸들러
     */
    private handleJobFailed;
    /**
     * 작업 진행 상태 핸들러
     */
    private handleJobProgress;
    /**
     * 워크플로우 상태 업데이트 전송
     */
    private emitWorkflowUpdate;
    /**
     * 텍스트를 자막 청크로 분할
     */
    private splitTextIntoChunks;
    /**
     * SRT 파일 생성
     */
    private generateSRTFile;
    /**
     * SRT 시간 포맷
     */
    private formatSRTTime;
    /**
     * 출력 디렉토리 생성
     */
    private ensureOutputDir;
    /**
     * WebSocket 서버 설정
     */
    setSocketServer(io: SocketServer): void;
    /**
     * 워크플로우 취소
     */
    cancelWorkflow(workflowId: string): Promise<boolean>;
    /**
     * 큐 상태 조회
     */
    getQueueStats(): Promise<any>;
    /**
     * 정리
     */
    cleanup(): Promise<void>;
}
export default VideoOrchestrator;
//# sourceMappingURL=index.d.ts.map