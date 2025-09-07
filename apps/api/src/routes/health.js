"use strict";
/**
 * Health Check Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../lib/database");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        // Check database connection
        await database_1.prisma.$queryRaw `SELECT 1`;
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'InfoGraphAI API',
            version: process.env.npm_package_version || '0.1.0',
            environment: process.env.NODE_ENV || 'development'
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: 'Database connection failed',
            timestamp: new Date().toISOString()
        });
    }
});
router.get('/ready', async (_req, res) => {
    // More detailed readiness check
    const checks = {
        database: false,
        redis: false
    };
    try {
        await database_1.prisma.$queryRaw `SELECT 1`;
        checks.database = true;
    }
    catch { }
    const allReady = Object.values(checks).every(v => v === true);
    res.status(allReady ? 200 : 503).json({
        ready: allReady,
        checks,
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
