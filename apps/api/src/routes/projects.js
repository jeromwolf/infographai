"use strict";
/**
 * Project Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../lib/database");
const error_1 = require("../middleware/error");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Get all projects for user
router.get('/', (0, error_1.asyncHandler)(async (req, res) => {
    const projects = await database_1.prisma.project.findMany({
        where: { userId: req.user.id },
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
}));
// Get single project
router.get('/:id', (0, error_1.asyncHandler)(async (req, res) => {
    const project = await database_1.prisma.project.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id
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
        throw new error_1.AppError('Project not found', 404);
    }
    res.json(project);
}));
// Create project
router.post('/', (0, validation_1.validateRequest)(validation_1.projectValidation.create), (0, error_1.asyncHandler)(async (req, res) => {
    const { name, description, topic } = req.body;
    const project = await database_1.prisma.project.create({
        data: {
            title: name,
            description,
            topic,
            userId: req.user.id
        }
    });
    res.status(201).json(project);
}));
// Update project
router.patch('/:id', (0, validation_1.validateRequest)([
    { field: 'name', type: 'string', minLength: 1, maxLength: 200 },
    { field: 'description', type: 'string', maxLength: 1000 }
]), (0, error_1.asyncHandler)(async (req, res) => {
    const { name, description } = req.body;
    // Check ownership
    const existing = await database_1.prisma.project.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id
        }
    });
    if (!existing) {
        throw new error_1.AppError('Project not found', 404);
    }
    const project = await database_1.prisma.project.update({
        where: { id: req.params.id },
        data: {
            ...(name && { title: name }),
            ...(description && { description })
        }
    });
    res.json(project);
}));
// Delete project
router.delete('/:id', (0, error_1.asyncHandler)(async (req, res) => {
    // Check ownership
    const project = await database_1.prisma.project.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id
        }
    });
    if (!project) {
        throw new error_1.AppError('Project not found', 404);
    }
    // Delete project and cascade delete videos
    await database_1.prisma.project.delete({
        where: { id: req.params.id }
    });
    res.status(204).send();
}));
exports.default = router;
