"use strict";
/**
 * Video Generation Orchestrator
 * 비디오 생성 전체 워크플로우 관리
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoOrchestrator = exports.JobStatus = exports.JobType = void 0;
const bull_1 = __importDefault(require("bull"));
const events_1 = require("events");
const uuid_1 = require("uuid");
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const scenario_manager_1 = __importDefault(require("@infographai/scenario-manager"));
// 작업 타입
var JobType;
(function (JobType) {
    JobType["GENERATE_SCRIPT"] = "generate_script";
    JobType["CREATE_INFOGRAPHICS"] = "create_infographics";
    JobType["GENERATE_SUBTITLES"] = "generate_subtitles";
    JobType["SYNTHESIZE_VIDEO"] = "synthesize_video";
    JobType["UPLOAD_VIDEO"] = "upload_video";
})(JobType || (exports.JobType = JobType = {}));
// 작업 상태
var JobStatus;
(function (JobStatus) {
    JobStatus["PENDING"] = "pending";
    JobStatus["PROCESSING"] = "processing";
    JobStatus["COMPLETED"] = "completed";
    JobStatus["FAILED"] = "failed";
    JobStatus["CANCELLED"] = "cancelled";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
class VideoOrchestrator extends events_1.EventEmitter {
    queues;
    logger;
    io = null;
    workflows;
    redisUrl;
    outputDir;
    scenarioManager;
    constructor(redisUrl = 'redis://localhost:6379', outputDir = './output/videos') {
        super();
        this.redisUrl = redisUrl;
        this.outputDir = outputDir;
        this.queues = new Map();
        this.workflows = new Map();
        this.scenarioManager = new scenario_manager_1.default();
        // Logger 설정
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'video-orchestrator.log' })
            ]
        });
        this.initializeQueues();
        this.ensureOutputDir();
    }
    /**
     * 큐 초기화
     */
    initializeQueues() {
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
            const queue = new bull_1.default(type, queueOptions);
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
    registerProcessor(type, queue) {
        queue.process(async (job) => {
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
    async startVideoGeneration(request) {
        const workflowId = (0, uuid_1.v4)();
        const workflow = [];
        // 시나리오 처리
        let scenario;
        if (request.scenarioId) {
            // 기존 시나리오 사용
            scenario = await this.scenarioManager.getScenario(request.scenarioId);
        }
        else if (request.options?.generateScenario && request.topic) {
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
            { id: (0, uuid_1.v4)(), name: '스크립트 생성', type: JobType.GENERATE_SCRIPT },
            { id: (0, uuid_1.v4)(), name: '인포그래픽 생성', type: JobType.CREATE_INFOGRAPHICS },
            { id: (0, uuid_1.v4)(), name: '자막 생성', type: JobType.GENERATE_SUBTITLES },
            { id: (0, uuid_1.v4)(), name: '비디오 합성', type: JobType.SYNTHESIZE_VIDEO }
        ];
        if (request.options?.autoUpload) {
            steps.push({
                id: (0, uuid_1.v4)(),
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
        const firstJob = await this.queues.get(JobType.GENERATE_SCRIPT).add({
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
    async processScriptGeneration(job) {
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
        }
        else {
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
    }
    /**
     * 인포그래픽 생성 처리
     */
    async processInfographicCreation(job) {
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
                path: path_1.default.join(this.outputDir, `infographic_${i}.png`),
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
    async processSubtitleGeneration(job) {
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
    async processVideoSynthesis(job) {
        const { workflowId, script, infographics, subtitles, srtPath } = job.data;
        await job.progress(10);
        // FFmpeg를 사용한 비디오 합성 시뮬레이션
        const videoPath = path_1.default.join(this.outputDir, `${workflowId}.mp4`);
        const thumbnailPath = path_1.default.join(this.outputDir, `${workflowId}_thumb.jpg`);
        // 실제 구현에서는 FFmpeg 명령 실행
        await job.progress(50);
        const videoResult = {
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
                infographics: infographics.map((i) => i.path)
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
        }
        else {
            this.completeWorkflow(workflowId, videoResult);
        }
        return videoResult;
    }
    /**
     * 비디오 업로드 처리
     */
    async processVideoUpload(job) {
        const { video } = job.data;
        await job.progress(50);
        // YouTube API 또는 다른 플랫폼 업로드 시뮬레이션
        const uploadResult = {
            platform: 'youtube',
            videoId: (0, uuid_1.v4)(),
            url: `https://youtube.com/watch?v=${(0, uuid_1.v4)()}`,
            uploadedAt: new Date()
        };
        await job.progress(100);
        return uploadResult;
    }
    /**
     * 다음 워크플로우 단계 시작
     */
    async startNextStep(workflowId, stepIndex, data) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow || stepIndex >= workflow.length)
            return;
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
    completeWorkflow(workflowId, result) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow)
            return;
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
    handleJobCompleted(type, job, result) {
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
    handleJobFailed(type, job, error) {
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
    handleJobProgress(type, job, progress) {
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
    emitWorkflowUpdate(workflowId, workflow) {
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
    getWorkflowStatus(workflow) {
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
    splitTextIntoChunks(text, maxLength) {
        const words = text.split(' ');
        const chunks = [];
        let current = '';
        for (const word of words) {
            if ((current + ' ' + word).length <= maxLength) {
                current = current ? `${current} ${word}` : word;
            }
            else {
                if (current)
                    chunks.push(current);
                current = word;
            }
        }
        if (current)
            chunks.push(current);
        return chunks;
    }
    /**
     * SRT 파일 생성
     */
    async generateSRTFile(workflowId, subtitles) {
        const srtContent = subtitles.map((sub, index) => {
            const startTime = this.formatSRTTime(sub.startTime);
            const endTime = this.formatSRTTime(sub.endTime);
            return `${index + 1}\n${startTime} --> ${endTime}\n${sub.text}\n`;
        }).join('\n');
        const srtPath = path_1.default.join(this.outputDir, `${workflowId}.srt`);
        await promises_1.default.writeFile(srtPath, srtContent, 'utf-8');
        return srtPath;
    }
    /**
     * SRT 시간 포맷
     */
    formatSRTTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
    }
    /**
     * 출력 디렉토리 생성
     */
    async ensureOutputDir() {
        try {
            await promises_1.default.mkdir(this.outputDir, { recursive: true });
        }
        catch (error) {
            this.logger.error('Failed to create output directory', { error });
        }
    }
    /**
     * WebSocket 서버 설정
     */
    setSocketServer(io) {
        this.io = io;
        this.logger.info('Socket server attached');
    }
    /**
     * 워크플로우 상태 조회
     */
    getWorkflowStatus(workflowId) {
        return this.workflows.get(workflowId) || null;
    }
    /**
     * 워크플로우 취소
     */
    async cancelWorkflow(workflowId) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow)
            return false;
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
    async getQueueStats() {
        const stats = {};
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
    async cleanup() {
        for (const queue of this.queues.values()) {
            await queue.close();
        }
        this.logger.info('Orchestrator cleaned up');
    }
}
exports.VideoOrchestrator = VideoOrchestrator;
exports.default = VideoOrchestrator;
