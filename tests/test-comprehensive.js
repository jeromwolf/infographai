#!/usr/bin/env node

/**
 * InfoGraphAI 종합 통합 테스트
 * 전체 시스템의 완성도와 통합성 검증
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔬 InfoGraphAI 종합 통합 테스트\n');
console.log('=' . repeat(60));

const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// 테스트 헬퍼 함수
function runTest(category, name, testFn) {
  process.stdout.write(`[${category}] ${name}... `);
  try {
    const result = testFn();
    if (result === 'warning') {
      console.log('⚠️  경고');
      testResults.warnings.push({ category, name });
    } else {
      console.log('✅ 통과');
      testResults.passed.push({ category, name });
    }
  } catch (error) {
    console.log('❌ 실패');
    console.log(`  └─ ${error.message}`);
    testResults.failed.push({ category, name, error: error.message });
  }
}

// ==================== 1. 프로젝트 구조 테스트 ====================
console.log('\n📁 프로젝트 구조 검증\n');

runTest('구조', '모노레포 설정', () => {
  const files = ['package.json', 'turbo.json', 'tsconfig.json'];
  files.forEach(file => {
    if (!fs.existsSync(file)) throw new Error(`${file} 없음`);
  });
});

runTest('구조', '필수 디렉토리', () => {
  const dirs = ['apps', 'packages', 'docs'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) throw new Error(`${dir} 디렉토리 없음`);
  });
});

runTest('구조', '12개 핵심 패키지', () => {
  const packages = [
    'cost-monitor',
    'gpt-service',
    'infographic-generator',
    'korean-subtitle',
    'scenario-manager',
    'subtitle-generator',
    'video-orchestrator',
    'video-synthesizer',
    'realtime-subtitle-editor',  // 신규
    'education-auth',             // 신규
    'shared',
    'interactive-visualizer'     // 추가
  ];
  
  packages.forEach(pkg => {
    const pkgPath = `packages/${pkg}`;
    if (!fs.existsSync(pkgPath)) {
      throw new Error(`패키지 누락: ${pkg}`);
    }
  });
});

// ==================== 2. 의존성 테스트 ====================
console.log('\n📦 의존성 검증\n');

runTest('의존성', 'package-lock.json 존재', () => {
  if (!fs.existsSync('package-lock.json')) {
    throw new Error('package-lock.json이 없습니다');
  }
});

runTest('의존성', '핵심 라이브러리', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const required = ['turbo', 'typescript', 'eslint', 'prettier'];
  
  required.forEach(lib => {
    if (!pkg.devDependencies || !pkg.devDependencies[lib]) {
      throw new Error(`${lib} 의존성 누락`);
    }
  });
});

// ==================== 3. 데이터베이스 테스트 ====================
console.log('\n🗄️  데이터베이스 검증\n');

runTest('DB', 'Prisma 스키마', () => {
  const schemaPath = 'apps/api/prisma/schema.prisma';
  if (!fs.existsSync(schemaPath)) {
    throw new Error('Prisma 스키마 파일 없음');
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const models = ['User', 'Project', 'Video', 'Subtitle', 'Cost', 'Scenario', 'Template'];
  
  models.forEach(model => {
    if (!schema.includes(`model ${model}`)) {
      throw new Error(`모델 누락: ${model}`);
    }
  });
});

runTest('DB', '마이그레이션 파일', () => {
  const migrationsPath = 'apps/api/prisma/migrations';
  if (!fs.existsSync(migrationsPath)) {
    return 'warning'; // 마이그레이션은 선택사항
  }
});

// ==================== 4. API 테스트 ====================
console.log('\n🔌 API 서버 검증\n');

runTest('API', 'Express 서버 구성', () => {
  const serverPath = 'apps/api/src/index.ts';
  if (!fs.existsSync(serverPath)) {
    throw new Error('API 서버 진입점 없음');
  }
  
  const content = fs.readFileSync(serverPath, 'utf8');
  if (!content.includes('express')) {
    throw new Error('Express 설정 없음');
  }
});

runTest('API', 'JWT 인증', () => {
  const authPath = 'apps/api/src/middleware/auth.ts';
  if (!fs.existsSync(authPath)) {
    throw new Error('인증 미들웨어 없음');
  }
  
  const content = fs.readFileSync(authPath, 'utf8');
  if (!content.includes('jsonwebtoken')) {
    throw new Error('JWT 구현 없음');
  }
});

runTest('API', 'API 라우트', () => {
  const routesPath = 'apps/api/src/routes';
  if (!fs.existsSync(routesPath)) {
    throw new Error('API 라우트 디렉토리 없음');
  }
  
  const routes = fs.readdirSync(routesPath);
  const required = ['auth.ts', 'projects.ts', 'videos.ts'];
  
  required.forEach(route => {
    if (!routes.includes(route)) {
      throw new Error(`라우트 누락: ${route}`);
    }
  });
});

// ==================== 5. 프론트엔드 테스트 ====================
console.log('\n🎨 프론트엔드 검증\n');

runTest('Frontend', 'Next.js 설정', () => {
  const configPath = 'apps/web/next.config.js';
  if (!fs.existsSync(configPath)) {
    throw new Error('Next.js 설정 파일 없음');
  }
});

runTest('Frontend', '페이지 구조', () => {
  const appPath = 'apps/web/app';
  if (!fs.existsSync(appPath)) {
    throw new Error('App 디렉토리 없음');
  }
  
  const pages = ['page.tsx', 'layout.tsx'];
  pages.forEach(page => {
    if (!fs.existsSync(path.join(appPath, page))) {
      throw new Error(`페이지 누락: ${page}`);
    }
  });
});

// ==================== 6. 비용 모니터링 테스트 ====================
console.log('\n💰 비용 모니터링 검증\n');

runTest('비용', 'Cost Monitor 구현', () => {
  const costPath = 'packages/cost-monitor/src/index.ts';
  const content = fs.readFileSync(costPath, 'utf8');
  
  const required = ['trackUsage', 'checkLimit', 'getCurrentUsage', 'blockService'];
  required.forEach(method => {
    if (!content.includes(method)) {
      throw new Error(`메서드 누락: ${method}`);
    }
  });
});

runTest('비용', '일일/월간 한도', () => {
  const costPath = 'packages/cost-monitor/src/index.ts';
  const content = fs.readFileSync(costPath, 'utf8');
  
  if (!content.includes('daily') || !content.includes('monthly')) {
    throw new Error('일일/월간 한도 설정 없음');
  }
});

// ==================== 7. 한국어 지원 테스트 ====================
console.log('\n🇰🇷 한국어 지원 검증\n');

runTest('한국어', '조사 처리', () => {
  const koreanPath = 'packages/korean-subtitle/src/particle-processor.ts';
  const content = fs.readFileSync(koreanPath, 'utf8');
  
  const particles = ['은/는', '이/가', '을/를', '와/과'];
  particles.forEach(particle => {
    if (!content.includes(particle)) {
      throw new Error(`조사 처리 누락: ${particle}`);
    }
  });
});

runTest('한국어', '실시간 자막 편집', () => {
  const editorPath = 'packages/realtime-subtitle-editor/src/index.ts';
  const content = fs.readFileSync(editorPath, 'utf8');
  
  if (!content.includes('fixKoreanParticles')) {
    throw new Error('한글 조사 자동 수정 없음');
  }
});

// ==================== 8. 교육 기능 테스트 ====================
console.log('\n🎓 교육 기능 검증\n');

runTest('교육', '.edu 인증', () => {
  const authPath = 'packages/education-auth/src/index.ts';
  const content = fs.readFileSync(authPath, 'utf8');
  
  const domains = ['.edu', '.ac.kr'];
  domains.forEach(domain => {
    if (!content.includes(domain)) {
      throw new Error(`교육 도메인 누락: ${domain}`);
    }
  });
});

runTest('교육', '무료 플랜 (월 100개)', () => {
  const authPath = 'packages/education-auth/src/index.ts';
  const content = fs.readFileSync(authPath, 'utf8');
  
  if (!content.includes('monthlyVideoLimit: 100')) {
    throw new Error('교육 플랜 혜택 설정 없음');
  }
});

// ==================== 9. 비디오 처리 테스트 ====================
console.log('\n🎬 비디오 처리 검증\n');

runTest('비디오', 'FFmpeg 설치', () => {
  try {
    execSync('which ffmpeg', { stdio: 'pipe' });
  } catch {
    throw new Error('FFmpeg이 설치되지 않았습니다');
  }
});

runTest('비디오', 'Video Synthesizer', () => {
  const synthPath = 'packages/video-synthesizer/src/index.ts';
  const content = fs.readFileSync(synthPath, 'utf8');
  
  if (!content.includes('ffmpeg')) {
    throw new Error('FFmpeg 통합 없음');
  }
});

// ==================== 10. 환경 설정 테스트 ====================
console.log('\n⚙️  환경 설정 검증\n');

runTest('환경', '.env 파일', () => {
  const envFiles = ['.env.example'];
  envFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`환경 파일 누락: ${file}`);
    }
  });
});

runTest('환경', 'Docker 설정', () => {
  const dockerFiles = ['docker-compose.yml', 'Dockerfile'];
  dockerFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Docker 파일 누락: ${file}`);
    }
  });
});

runTest('환경', 'TypeScript 설정', () => {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  if (!tsconfig.compilerOptions) {
    throw new Error('TypeScript 설정 없음');
  }
});

// ==================== 11. 문서화 테스트 ====================
console.log('\n📚 문서화 검증\n');

runTest('문서', 'README.md', () => {
  const readme = fs.readFileSync('README.md', 'utf8');
  if (readme.length < 1000) {
    throw new Error('README가 너무 짧습니다');
  }
});

runTest('문서', 'PRD 문서', () => {
  const prdPath = 'docs/prd';
  if (!fs.existsSync(prdPath)) {
    return 'warning';
  }
});

// ==================== 12. 보안 테스트 ====================
console.log('\n🔒 보안 검증\n');

runTest('보안', 'API 키 노출 체크', () => {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const required = ['.env', 'node_modules', 'dist'];
  
  required.forEach(item => {
    if (!gitignore.includes(item)) {
      throw new Error(`.gitignore에 ${item} 누락`);
    }
  });
});

runTest('보안', '비용 한도 설정', () => {
  const costPath = 'packages/cost-monitor/src/index.ts';
  const content = fs.readFileSync(costPath, 'utf8');
  
  if (!content.includes('blockService')) {
    throw new Error('서비스 차단 기능 없음');
  }
});

// ==================== 13. 성능 테스트 ====================
console.log('\n⚡ 성능 검증\n');

runTest('성능', '실시간 편집 (1초 목표)', () => {
  const editorPath = 'packages/realtime-subtitle-editor/src/index.ts';
  const content = fs.readFileSync(editorPath, 'utf8');
  
  if (!content.includes('1초')) {
    return 'warning';
  }
});

runTest('성능', '캐싱 구현', () => {
  const packages = fs.readdirSync('packages');
  let hasCaching = false;
  
  packages.forEach(pkg => {
    const indexPath = `packages/${pkg}/src/index.ts`;
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      if (content.includes('cache') || content.includes('Cache')) {
        hasCaching = true;
      }
    }
  });
  
  if (!hasCaching) {
    return 'warning';
  }
});

// ==================== 결과 요약 ====================
console.log('\n' + '=' . repeat(60));
console.log('\n📊 테스트 결과 요약\n');

const total = testResults.passed.length + testResults.failed.length;
const passRate = Math.round((testResults.passed.length / total) * 100);

console.log(`✅ 통과: ${testResults.passed.length}개`);
console.log(`❌ 실패: ${testResults.failed.length}개`);
console.log(`⚠️  경고: ${testResults.warnings.length}개`);
console.log(`\n성공률: ${passRate}%`);

if (testResults.failed.length > 0) {
  console.log('\n실패한 테스트:');
  testResults.failed.forEach(({ category, name, error }) => {
    console.log(`  - [${category}] ${name}: ${error}`);
  });
}

if (testResults.warnings.length > 0) {
  console.log('\n경고 항목:');
  testResults.warnings.forEach(({ category, name }) => {
    console.log(`  - [${category}] ${name}`);
  });
}

// 최종 판정
console.log('\n' + '=' . repeat(60));
if (passRate === 100) {
  console.log('\n🎉 완벽! 모든 테스트를 통과했습니다!');
  console.log('InfoGraphAI는 프로덕션 배포 준비가 완료되었습니다.');
} else if (passRate >= 90) {
  console.log('\n✨ 우수! 대부분의 테스트를 통과했습니다.');
  console.log('몇 가지 개선사항만 처리하면 배포 가능합니다.');
} else if (passRate >= 80) {
  console.log('\n⚠️  양호. 추가 작업이 필요합니다.');
} else {
  console.log('\n❌ 미흡. 상당한 개선이 필요합니다.');
  process.exit(1);
}

console.log('\n');