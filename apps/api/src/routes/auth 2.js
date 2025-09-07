"use strict";
/**
 * Authentication Routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../lib/database");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const rate_limit_1 = require("../middleware/rate-limit");
const error_1 = require("../middleware/error");
const router = (0, express_1.Router)();
// Register
router.post('/register', rate_limit_1.authLimiter.middleware(), (0, validation_1.validateRequest)(validation_1.authValidation.register), (0, error_1.asyncHandler)(async (req, res) => {
    const { email, password, name } = req.body;
    // Check if user exists
    const existingUser = await database_1.prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        throw new error_1.AppError('Email already registered', 400);
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Create user
    const user = await database_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            tier: 'FREE'
        },
        select: {
            id: true,
            email: true,
            name: true,
            tier: true,
            createdAt: true
        }
    });
    // Generate token
    const token = (0, auth_1.generateToken)(user.id, user.email);
    res.status(201).json({
        user,
        token
    });
}));
// Login
router.post('/login', rate_limit_1.authLimiter.middleware(), (0, validation_1.validateRequest)(validation_1.authValidation.login), (0, error_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    // Find user
    const user = await database_1.prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            password: true,
            name: true,
            tier: true,
            createdAt: true
        }
    });
    if (!user) {
        throw new error_1.AppError('Invalid credentials', 401);
    }
    // Check password
    const isValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isValid) {
        throw new error_1.AppError('Invalid credentials', 401);
    }
    // Generate token
    const token = (0, auth_1.generateToken)(user.id, user.email);
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({
        user: userWithoutPassword,
        token
    });
}));
// Refresh token
router.post('/refresh', (0, error_1.asyncHandler)(async (req, _res) => {
    const { token } = req.body;
    if (!token) {
        throw new error_1.AppError('Token required', 400);
    }
    // For now, just return error
    throw new error_1.AppError('Refresh token not implemented', 501);
}));
exports.default = router;
