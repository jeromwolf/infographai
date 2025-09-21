// 테스트 계정 생성 스크립트
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestAccount() {
  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash('test1234', 10);

    // 테스트 계정 생성
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: hashedPassword,
        name: 'Test User'
      }
    });

    console.log('✅ 테스트 계정 생성 완료!');
    console.log('📧 이메일: test@test.com');
    console.log('🔑 비밀번호: test1234');
    console.log('👤 이름: Test User');
    console.log('ID:', user.id);

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️ 테스트 계정이 이미 존재합니다');
      console.log('📧 이메일: test@test.com');
      console.log('🔑 비밀번호: test1234');
    } else {
      console.error('❌ 오류:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestAccount();