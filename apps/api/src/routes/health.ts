/**
 * Health Check Routes
 */

import { Router } from 'express';
import { prisma } from '../lib/database';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'InfoGraphAI API',
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
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
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch {}

  const allReady = Object.values(checks).every(v => v === true);

  res.status(allReady ? 200 : 503).json({
    ready: allReady,
    checks,
    timestamp: new Date().toISOString()
  });
});

export default router;