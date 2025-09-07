/**
 * Video Routes
 */

import { Router } from 'express';
import { prisma } from '../lib/database';
import { costMonitor } from '../lib/cost-monitor';
import { asyncHandler, AppError } from '../middleware/error';
import { validateRequest, videoValidation } from '../middleware/validation';

const router = Router();

// Get all videos for user
router.get('/',
  asyncHandler(async (req, res) => {
    const videos = await prisma.video.findMany({
      where: {
        project: {
          userId: req.user!.id
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
  })
);

// Get single video
router.get('/:id',
  asyncHandler(async (req, res) => {
    const video = await prisma.video.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user!.id
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
      throw new AppError('Video not found', 404);
    }

    res.json(video);
  })
);

// Create video
router.post('/',
  validateRequest(videoValidation.create),
  asyncHandler(async (req, res) => {
    const { projectId, topic, duration, targetAudience } = req.body;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user!.id
      }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check cost limits before creating
    const estimatedCost = 0.05; // Estimate based on subtitle-only approach
    const canProceed = await costMonitor.addCost({
      service: 'compute',
      amount: estimatedCost,
      timestamp: new Date(),
      userId: req.user!.id
    });

    if (!canProceed) {
      throw new AppError('Cost limit exceeded. Please try again later.', 429);
    }

    const video = await prisma.video.create({
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
    await prisma.cost.create({
      data: {
        userId: req.user!.id,
        service: 'VIDEO_GENERATION',
        amount: estimatedCost,
        description: `Video creation: ${video.id}`
      }
    });

    res.status(201).json(video);
  })
);

// Update video status
router.patch('/:id/status',
  validateRequest([
    { field: 'status', type: 'string', required: true }
  ]),
  asyncHandler(async (req, res) => {
    const { status } = req.body;

    // Verify ownership
    const video = await prisma.video.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user!.id
        }
      }
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    const updatedVideo = await prisma.video.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(updatedVideo);
  })
);

// Delete video
router.delete('/:id',
  asyncHandler(async (req, res) => {
    // Verify ownership
    const video = await prisma.video.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user!.id
        }
      }
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    await prisma.video.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  })
);

// Get video subtitles
router.get('/:id/subtitles',
  asyncHandler(async (req, res) => {
    // Verify ownership
    const video = await prisma.video.findFirst({
      where: {
        id: req.params.id,
        project: {
          userId: req.user!.id
        }
      }
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    const subtitles = await prisma.subtitle.findMany({
      where: { videoId: req.params.id },
      orderBy: { startTime: 'asc' }
    });

    res.json(subtitles);
  })
);

export default router;