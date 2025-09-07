/**
 * Express API Server
 * InfoGraphAI Backend
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { prisma } from './lib/database';
import { costMonitor } from './lib/cost-monitor';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import projectRoutes from './routes/projects';
import videoRoutes from './routes/videos';
import costRoutes from './routes/costs';
import healthRoutes from './routes/health';
import scenarioRoutes from './routes/scenarios';

// Middleware
import { errorHandler } from './middleware/error';
import { authenticate } from './middleware/auth';
import { rateLimiter } from './middleware/rate-limit';

// Load environment variables
dotenv.config();

const app = express();

// CORS must come before helmet
app.use(cors({
  origin: ['http://localhost:3906', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Basic middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Health check (public)
app.use('/health', healthRoutes);

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', authenticate, userRoutes);
app.use('/api/projects', authenticate, projectRoutes);
app.use('/api/videos', authenticate, videoRoutes);
app.use('/api/costs', authenticate, costRoutes);
app.use('/api/scenarios', authenticate, scenarioRoutes);

// Error handling
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 4906;

async function startServer() {
  try {
    // Initialize cost monitoring
    await costMonitor.initialize();
    console.log('✅ Cost monitor initialized');

    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  await costMonitor.cleanup();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  await costMonitor.cleanup();
  process.exit(0);
});

// Start the server
startServer();

export { app, prisma, costMonitor };