const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Delete existing test user if exists
    await prisma.user.deleteMany({
      where: {
        email: 'test@test.com'
      }
    });

    // Create new test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: hashedPassword,
        name: 'Test User'
      }
    });

    console.log('✅ Test user created successfully!');
    console.log('Email: test@test.com');
    console.log('Password: password123');
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();