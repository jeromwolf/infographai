// 테스트 계정 리셋 스크립트
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetTestAccount() {
  try {
    // 기존 테스트 계정 삭제
    await prisma.user.deleteMany({
      where: {
        email: 'test@test.com'
      }
    });
    console.log('🗑️  기존 계정 삭제됨');

    // 새 비밀번호 해싱
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 새 테스트 계정 생성
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: hashedPassword,
        name: 'Test User'
      }
    });

    console.log('');
    console.log('✅ 새 테스트 계정 생성 완료!');
    console.log('=====================================');
    console.log('📧 이메일: test@test.com');
    console.log('🔑 비밀번호: password123');
    console.log('=====================================');
    console.log('');

    // 추가 테스트 계정도 생성
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: { password: adminPassword },
      create: {
        email: 'admin@test.com',
        password: adminPassword,
        name: 'Admin User'
      }
    });

    console.log('추가 계정:');
    console.log('📧 이메일: admin@test.com');
    console.log('🔑 비밀번호: admin123');
    console.log('');

  } catch (error) {
    console.error('❌ 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetTestAccount();