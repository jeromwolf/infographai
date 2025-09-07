"use strict";
/**
 * User Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../lib/database");
const error_1 = require("../middleware/error");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Get current user
router.get('/me', (0, error_1.asyncHandler)(async (req, res) => {
    const user = await database_1.prisma.user.findUnique({
        where: { id: req.user.id },
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
        throw new error_1.AppError('User not found', 404);
    }
    res.json(user);
}));
// Update current user
router.patch('/me', (0, validation_1.validateRequest)([
    { field: 'name', type: 'string', minLength: 2, maxLength: 100 },
    { field: 'email', type: 'email' }
]), (0, error_1.asyncHandler)(async (req, res) => {
    const { name, email } = req.body;
    // If email is being changed, check if it's already taken
    if (email) {
        const existing = await database_1.prisma.user.findUnique({
            where: { email }
        });
        if (existing && existing.id !== req.user.id) {
            throw new error_1.AppError('Email already in use', 400);
        }
    }
    const user = await database_1.prisma.user.update({
        where: { id: req.user.id },
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
}));
// Get user stats
router.get('/me/stats', (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const [projects, videos, costs] = await Promise.all([
        database_1.prisma.project.count({ where: { userId } }),
        database_1.prisma.video.count({
            where: {
                project: { userId }
            }
        }),
        database_1.prisma.costRecord.aggregate({
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
}));
// Delete account
router.delete('/me', (0, error_1.asyncHandler)(async (req, res) => {
    await database_1.prisma.user.delete({
        where: { id: req.user.id }
    });
    res.status(204).send();
}));
exports.default = router;
