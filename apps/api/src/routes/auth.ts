/**
 * Authentication Routes
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/database';
import { generateToken } from '../middleware/auth';
import { validateRequest, authValidation } from '../middleware/validation';
import { authLimiter } from '../middleware/rate-limit';
import { asyncHandler, AppError } from '../middleware/error';

const router = Router();

// Register
router.post('/register', 
  authLimiter.middleware(),
  validateRequest(authValidation.register),
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      user,
      token
    });
  })
);

// Login
router.post('/login',
  authLimiter.middleware(),
  validateRequest(authValidation.login),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  })
);

// Refresh token
router.post('/refresh',
  asyncHandler(async (req, _res) => {
    const { token } = req.body;

    if (!token) {
      throw new AppError('Token required', 400);
    }

    // For now, just return error
    throw new AppError('Refresh token not implemented', 501);
  })
);

export default router;