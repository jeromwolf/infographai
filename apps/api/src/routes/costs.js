"use strict";
/**
 * Cost Management Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../lib/database");
const cost_monitor_1 = require("../lib/cost-monitor");
const error_1 = require("../middleware/error");
const router = (0, express_1.Router)();
// Get cost summary for user
router.get('/summary', (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [today, month, total] = await Promise.all([
        // Today's costs
        database_1.prisma.cost.aggregate({
            where: {
                userId,
                createdAt: { gte: todayStart }
            },
            _sum: { amount: true }
        }),
        // This month's costs
        database_1.prisma.cost.aggregate({
            where: {
                userId,
                createdAt: { gte: monthStart }
            },
            _sum: { amount: true }
        }),
        // Total costs
        database_1.prisma.cost.aggregate({
            where: { userId },
            _sum: { amount: true }
        })
    ]);
    // Get current limits from cost monitor
    const limits = await cost_monitor_1.costMonitor.getCurrentUsage();
    res.json({
        today: today._sum.amount || 0,
        month: month._sum.amount || 0,
        total: total._sum.amount || 0,
        limits: {
            daily: process.env.DAILY_COST_LIMIT || 10,
            hourly: process.env.HOURLY_COST_LIMIT || 2,
            currentUsage: limits
        }
    });
}));
// Get detailed cost history
router.get('/history', (0, error_1.asyncHandler)(async (req, res) => {
    const { limit = 50, offset = 0, service, startDate, endDate } = req.query;
    const where = {
        userId: req.user.id
    };
    if (service) {
        where.service = service;
    }
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
            where.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
            where.createdAt.lte = new Date(endDate);
        }
    }
    const [records, totalCount] = await Promise.all([
        database_1.prisma.cost.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: Number(limit),
            skip: Number(offset)
        }),
        database_1.prisma.cost.count({ where })
    ]);
    res.json({
        records,
        totalCount,
        limit: Number(limit),
        offset: Number(offset)
    });
}));
// Get cost breakdown by service
router.get('/breakdown', (0, error_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const breakdown = await database_1.prisma.cost.groupBy({
        by: ['service'],
        where: { userId },
        _sum: {
            amount: true
        },
        _count: {
            _all: true
        }
    });
    const formatted = breakdown.map(item => ({
        service: item.service,
        totalCost: item._sum.amount || 0,
        count: item._count._all
    }));
    res.json(formatted);
}));
// Get cost alerts/warnings
router.get('/alerts', (0, error_1.asyncHandler)(async (_req, res) => {
    const usage = await cost_monitor_1.costMonitor.getCurrentUsage();
    const alerts = [];
    // Check if approaching limits
    const dailyLimit = Number(process.env.DAILY_COST_LIMIT || 10);
    const hourlyLimit = Number(process.env.HOURLY_COST_LIMIT || 2);
    if (usage.daily > dailyLimit * 0.8) {
        alerts.push({
            type: 'warning',
            message: `Daily cost approaching limit: $${usage.daily.toFixed(2)} / $${dailyLimit}`,
            severity: 'high'
        });
    }
    if (usage.hourly > hourlyLimit * 0.8) {
        alerts.push({
            type: 'warning',
            message: `Hourly cost approaching limit: $${usage.hourly.toFixed(2)} / $${hourlyLimit}`,
            severity: 'medium'
        });
    }
    res.json({ alerts, usage });
}));
exports.default = router;
