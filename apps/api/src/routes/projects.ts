/**
 * Project Routes
 */

import { Router } from 'express';
import { prisma } from '../lib/database';
import { asyncHandler, AppError } from '../middleware/error';
import { validateRequest, projectValidation } from '../middleware/validation';

const router = Router();

// Get all projects for user
router.get('/',
  asyncHandler(async (req, res) => {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
      include: {
        _count: {
          select: {
            videos: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(projects);
  })
);

// Get single project
router.get('/:id',
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      },
      include: {
        videos: {
          select: {
            id: true,
            title: true,
            status: true,
            duration: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json(project);
  })
);

// Create project
router.post('/',
  validateRequest(projectValidation.create),
  asyncHandler(async (req, res) => {
    const { title, description, topic } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        topic,
        userId: req.user!.id
      }
    });

    res.status(201).json(project);
  })
);

// Update project
router.patch('/:id',
  validateRequest([
    { field: 'name', type: 'string', minLength: 1, maxLength: 200 },
    { field: 'description', type: 'string', maxLength: 1000 }
  ]),
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    // Check ownership
    const existing = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!existing) {
      throw new AppError('Project not found', 404);
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(name && { title: name }),
        ...(description && { description })
      }
    });

    res.json(project);
  })
);

// Delete project
router.delete('/:id',
  asyncHandler(async (req, res) => {
    // Check ownership
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Delete project and cascade delete videos
    await prisma.project.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  })
);

export default router;