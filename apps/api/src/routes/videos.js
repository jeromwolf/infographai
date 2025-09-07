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
                    name: true
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
exports.default = router;
