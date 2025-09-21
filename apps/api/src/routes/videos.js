"use strict";
/**
 * Video Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../lib/database");
const cost_monitor_1 = require("../lib/cost-monitor");
const error_1 = require("../middleware/error");
const validation_1 = require("../middleware/validation");
const simple_video_generator_1 = require("../services/simple-video-generator");
const remotion_video_generator_1 = require("../services/remotion-video-generator");
const canvas_video_generator_1 = require("../services/canvas-video-generator");
const router = (0, express_1.Router)();
// Get all videos for user
router.get('/', (0, error_1.asyncHandler)(async (req, res) => {
    const videos = await database_1.prisma.video.findMany({
        where: {
            project: {
                userId: req.user.id
            }
        },
        include: {
            project: {
                select: {
                    id: true,
                    title: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    res.json(videos);
}));
// Get single video
router.get('/:id', (0, error_1.asyncHandler)(async (req, res) => {
    const video = await database_1.prisma.video.findFirst({
        where: {
            id: req.params.id,
            project: {
                userId: req.user.id
            }
        },
        include: {
            project: true,
            subtitles: {
                orderBy: { startTime: 'asc' }
            },
            assets: true
        }
    });
    if (!video) {
        throw new error_1.AppError('Video not found', 404);
    }
    res.json(video);
}));
// Create video
router.post('/', (0, validation_1.validateRequest)(validation_1.videoValidation.create), (0, error_1.asyncHandler)(async (req, res) => {
    const { projectId, topic, duration, targetAudience } = req.body;
    // Verify project ownership
    const project = await database_1.prisma.project.findFirst({
        where: {
            id: projectId,
            userId: req.user.id
        }
    });
    if (!project) {
        throw new error_1.AppError('Project not found', 404);
    }
    // Check cost limits before creating
    const estimatedCost = 0.05; // Estimate based on subtitle-only approach
    const canProceed = await cost_monitor_1.costMonitor.addCost({
        service: 'compute',
        amount: estimatedCost,
        timestamp: new Date(),
        userId: req.user.id
    });
    if (!canProceed) {
        throw new error_1.AppError('Cost limit exceeded. Please try again later.', 429);
    }
    const video = await database_1.prisma.video.create({
        data: {
            projectId,
            title: topic,
            description: `Video about ${topic}`,
            duration: duration || 120,
            targetAudience,
            status: 'QUEUED'
        }
    });
    // Record cost
    await database_1.prisma.cost.create({
        data: {
            userId: req.user.id,
            service: 'VIDEO_GENERATION',
            amount: estimatedCost,
            description: `Video creation: ${video.id}`
        }
    });
    res.status(201).json(video);
}));
// Update video status
router.patch('/:id/status', (0, validation_1.validateRequest)([
    { field: 'status', type: 'string', required: true }
]), (0, error_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    // Verify ownership
    const video = await database_1.prisma.video.findFirst({
        where: {
            id: req.params.id,
            project: {
                userId: req.user.id
            }
        }
    });
    if (!video) {
        throw new error_1.AppError('Video not found', 404);
    }
    const updatedVideo = await database_1.prisma.video.update({
        where: { id: req.params.id },
        data: { status }
    });
    res.json(updatedVideo);
}));
// Delete video
router.delete('/:id', (0, error_1.asyncHandler)(async (req, res) => {
    // Verify ownership
    const video = await database_1.prisma.video.findFirst({
        where: {
            id: req.params.id,
            project: {
                userId: req.user.id
            }
        }
    });
    if (!video) {
        throw new error_1.AppError('Video not found', 404);
    }
    await database_1.prisma.video.delete({
        where: { id: req.params.id }
    });
    res.status(204).send();
}));
// Get video subtitles
router.get('/:id/subtitles', (0, error_1.asyncHandler)(async (req, res) => {
    // Verify ownership
    const video = await database_1.prisma.video.findFirst({
        where: {
            id: req.params.id,
            project: {
                userId: req.user.id
            }
        }
    });
    if (!video) {
        throw new error_1.AppError('Video not found', 404);
    }
    const subtitles = await database_1.prisma.subtitle.findMany({
        where: { videoId: req.params.id },
        orderBy: { startTime: 'asc' }
    });
    res.json(subtitles);
}));
// Generate video endpoint
router.post('/generate', (0, error_1.asyncHandler)(async (req, res) => {
    const { scenarioId, projectId } = req.body;
    if (!scenarioId || !projectId) {
        throw new error_1.AppError('scenarioId and projectId are required', 400);
    }
    // Verify project ownership
    const project = await database_1.prisma.project.findFirst({
        where: {
            id: projectId,
            userId: req.user.id
        }
    });
    if (!project) {
        throw new error_1.AppError('Project not found', 404);
    }
    // Verify scenario exists
    const scenario = await database_1.prisma.scenario.findFirst({
        where: {
            id: scenarioId,
            projectId
        }
    });
    if (!scenario) {
        throw new error_1.AppError('Scenario not found', 404);
    }
    // Check cost limits before creating
    const estimatedCost = 0.05; // Estimate based on subtitle-only approach
    const canProceed = await cost_monitor_1.costMonitor.addCost({
        service: 'compute',
        amount: estimatedCost,
        timestamp: new Date(),
        userId: req.user.id
    });
    if (!canProceed) {
        throw new error_1.AppError('Cost limit exceeded. Please try again later.', 429);
    }
    // Create video record
    const video = await database_1.prisma.video.create({
        data: {
            projectId,
            title: scenario.title || 'Generated Video',
            description: scenario.description,
            topic: project.topic,
            duration: scenario.totalDuration || 120,
            status: 'QUEUED'
        }
    });
    // Record cost
    await database_1.prisma.cost.create({
        data: {
            user: { connect: { id: req.user.id } },
            project: { connect: { id: projectId } },
            service: 'OTHER',
            action: `video_generation:${video.id}`,
            amount: estimatedCost
        }
    });
    // Trigger video generation process
    // Use Canvas for infographic videos, Remotion if enabled, otherwise simple generator
    const useCanvas = process.env.USE_CANVAS === 'true' || true; // Default to Canvas
    const useRemotion = process.env.USE_REMOTION === 'true';
    if (useCanvas) {
        await (0, canvas_video_generator_1.startCanvasVideoGeneration)(video.id, projectId, scenarioId);
    }
    else if (useRemotion) {
        await (0, remotion_video_generator_1.startRemotionVideoGeneration)(video.id, projectId, scenarioId);
    }
    else {
        await (0, simple_video_generator_1.startSimpleVideoGeneration)(video.id, projectId, scenarioId);
    }
    res.status(201).json({
        message: 'Video generation started',
        video
    });
}));
exports.default = router;
