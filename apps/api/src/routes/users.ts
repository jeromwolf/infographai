/**
 * User Routes
 */

import { Router } from 'express';
import { prisma } from '../lib/database';
import { asyncHandler, AppError } from '../middleware/error';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Get current user
router.get('/me', 
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            costs: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(user);
  })
);

// Update current user
router.patch('/me',
  validateRequest([
    { field: 'name', type: 'string', minLength: 2, maxLength: 100 },
    { field: 'email', type: 'email' }
  ]),
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    // If email is being changed, check if it's already taken
    if (email) {
      const existing = await prisma.user.findUnique({
        where: { email }
      });

      if (existing && existing.id !== req.user!.id) {
        throw new AppError('Email already in use', 400);
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(email && { email })
      },
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true
      }
    });

    res.json(user);
  })
);

// Get user stats
router.get('/me/stats',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const [projects, videos, costs] = await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.video.count({ 
        where: { 
          project: { userId } 
        } 
      }),
      prisma.costRecord.aggregate({
        where: { userId },
        _sum: { amount: true }
      })
    ]);

    const stats = {
      totalProjects: projects,
      totalVideos: videos,
      totalCost: costs._sum.amount || 0
    };

    res.json(stats);
  })
);

// Delete account
router.delete('/me',
  asyncHandler(async (req, res) => {
    await prisma.user.delete({
      where: { id: req.user!.id }
    });

    res.status(204).send();
  })
);

export default router;