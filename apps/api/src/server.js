"use strict";
/**
 * Express API Server
 * InfoGraphAI Backend
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.costMonitor = exports.prisma = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./lib/database");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return database_1.prisma; } });
const cost_monitor_1 = require("./lib/cost-monitor");
Object.defineProperty(exports, "costMonitor", { enumerable: true, get: function () { return cost_monitor_1.costMonitor; } });
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const projects_1 = __importDefault(require("./routes/projects"));
const videos_1 = __importDefault(require("./routes/videos"));
const costs_1 = __importDefault(require("./routes/costs"));
const health_1 = __importDefault(require("./routes/health"));
const scenarios_1 = __importDefault(require("./routes/scenarios"));
const scene_video_1 = __importDefault(require("./routes/scene-video"));
// Middleware
const error_1 = require("./middleware/error");
const auth_2 = require("./middleware/auth");
const rate_limit_1 = require("./middleware/rate-limit");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
// CORS must come before helmet
app.use((0, cors_1.default)({
    origin: ['http://localhost:3906', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
// Basic middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
app.use(rate_limit_1.rateLimiter);
// Serve static files (videos and previews)
app.use('/videos', express_1.default.static(path_1.default.join(__dirname, '../public/videos')));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
// Health check (public)
app.use('/health', health_1.default);
// Auth routes (public)
app.use('/api/auth', auth_1.default);
// Protected routes
app.use('/api/users', auth_2.authenticate, users_1.default);
app.use('/api/projects', auth_2.authenticate, projects_1.default);
app.use('/api/videos', auth_2.authenticate, videos_1.default);
app.use('/api/costs', auth_2.authenticate, costs_1.default);
app.use('/api/scenarios', auth_2.authenticate, scenarios_1.default);
app.use('/api/scene-video', auth_2.authenticate, scene_video_1.default);
// Error handling
app.use(error_1.errorHandler);
// Server startup
const PORT = process.env.PORT || 4906;
async function startServer() {
    try {
        // Initialize cost monitoring
        await cost_monitor_1.costMonitor.initialize();
        console.log('✅ Cost monitor initialized');
        // Connect to database
        await database_1.prisma.$connect();
        console.log('✅ Database connected');
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await database_1.prisma.$disconnect();
    await cost_monitor_1.costMonitor.cleanup();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await database_1.prisma.$disconnect();
    await cost_monitor_1.costMonitor.cleanup();
    process.exit(0);
});
// Start the server
startServer();
