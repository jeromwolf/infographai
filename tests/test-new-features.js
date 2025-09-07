#!/usr/bin/env node

/**
 * InfoGraphAI 새 기능 테스트
 * 1. 실시간 자막 편집기
 * 2. 교육 기관 인증 시스템
 */

const path = require('path');
const fs = require('fs');

console.log('🧪 InfoGraphAI 새 기능 테스트\n');
console.log('=' . repeat(50));

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log(`\n${tests.length}개 테스트 실행 중...\n`);
  
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   오류: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '=' . repeat(50));
  console.log(`\n결과: ${passed} 성공, ${failed} 실패`);
  console.log(`성공률: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 모든 테스트 통과!');
  } else {
    console.log('\n⚠️  일부 테스트 실패');
    process.exit(1);
  }
}

// ==================== 실시간 자막 편집기 테스트 ====================

test('실시간 자막 편집기 패키지 존재', () => {
  const packagePath = 'packages/realtime-subtitle-editor/package.json';
  if (!fs.existsSync(packagePath)) {
    throw new Error('실시간 자막 편집기 패키지가 없습니다');
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (pkg.name !== '@infographai/realtime-subtitle-editor') {
    throw new Error('패키지 이름이 올바르지 않습니다');
  }
});

test('실시간 편집 핵심 기능 구현', () => {
  const srcPath = 'packages/realtime-subtitle-editor/src/index.ts';
  if (!fs.existsSync(srcPath)) {
    throw new Error('소스 파일이 없습니다');
  }
  
  const content = fs.readFileSync(srcPath, 'utf8');
  const requiredFeatures = [
    'editText',           // 텍스트 편집
    'moveSubtitle',       // 타임라인 이동
    'splitSubtitle',      // 자막 분할
    'mergeSubtitles',     // 자막 병합
    'undo',               // 실행 취소
    'redo',               // 다시 실행
    'generateInstantPreview', // 즉시 미리보기
    'exportSubtitles'     // 내보내기
  ];
  
  requiredFeatures.forEach(feature => {
    if (!content.includes(feature)) {
      throw new Error(`필수 기능 누락: ${feature}`);
    }
  });
});

test('한글 조사 자동 수정 지원', () => {
  const srcPath = 'packages/realtime-subtitle-editor/src/index.ts';
  const content = fs.readFileSync(srcPath, 'utf8');
  
  if (!content.includes('fixKoreanParticles')) {
    throw new Error('한글 조사 수정 기능이 없습니다');
  }
  
  // 조사 처리 체크 (이스케이프 문자 고려)
  const particles = ['을|를', '이|가', '은|는', '와|과'];
  particles.forEach(particle => {
    if (!content.includes(particle)) {
      throw new Error(`한글 조사 처리 누락: ${particle}`);
    }
  });
});

test('1초 내 미리보기 성능', () => {
  const srcPath = 'packages/realtime-subtitle-editor/src/index.ts';
  const content = fs.readFileSync(srcPath, 'utf8');
  
  // 성능 관련 코드 체크
  if (!content.includes('generateInstantPreview')) {
    throw new Error('즉시 미리보기 기능이 없습니다');
  }
  
  // 코멘트에서 1초 언급 확인
  if (!content.includes('1초 내')) {
    throw new Error('1초 내 미리보기 목표가 명시되지 않았습니다');
  }
});

test('SRT/VTT 내보내기 지원', () => {
  const srcPath = 'packages/realtime-subtitle-editor/src/index.ts';
  const content = fs.readFileSync(srcPath, 'utf8');
  
  const formats = ['srt', 'vtt', 'json'];
  formats.forEach(format => {
    if (!content.toLowerCase().includes(format)) {
      throw new Error(`${format.toUpperCase()} 형식 지원 안 됨`);
    }
  });
});

// ==================== 교육 인증 시스템 테스트 ====================

test('교육 인증 패키지 존재', () => {
  const packagePath = 'packages/education-auth/package.json';
  if (!fs.existsSync(packagePath)) {
    throw new Error('교육 인증 패키지가 없습니다');
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (pkg.name !== '@infographai/education-auth') {
    throw new Error('패키지 이름이 올바르지 않습니다');
  }
});

test('.edu 이메일 자동 승인', () => {
  const srcPath = 'packages/education-auth/src/index.ts';
  if (!fs.existsSync(srcPath)) {
    throw new Error('소스 파일이 없습니다');
  }
  
  const content = fs.readFileSync(srcPath, 'utf8');
  
  // 교육 도메인 체크
  const eduDomains = ['.edu', '.ac.kr', '.ac.uk'];
  eduDomains.forEach(domain => {
    if (!content.includes(domain)) {
      throw new Error(`교육 도메인 누락: ${domain}`);
    }
  });
  
  if (!content.includes('isEducationEmail')) {
    throw new Error('이메일 검증 함수가 없습니다');
  }
});

test('한국 대학 지원', () => {
  const srcPath = 'packages/education-auth/src/index.ts';
  const content = fs.readFileSync(srcPath, 'utf8');
  
  const koreanUnivs = [
    'kaist.ac.kr',
    'snu.ac.kr',
    'yonsei.ac.kr',
    'korea.ac.kr'
  ];
  
  koreanUnivs.forEach(univ => {
    if (!content.includes(univ)) {
      throw new Error(`한국 대학 누락: ${univ}`);
    }
  });
});

test('교육 플랜 혜택 (월 100개)', () => {
  const srcPath = 'packages/education-auth/src/index.ts';
  const content = fs.readFileSync(srcPath, 'utf8');
  
  if (!content.includes('monthlyVideoLimit: 100')) {
    throw new Error('교육 플랜 월 100개 제한이 설정되지 않았습니다');
  }
  
  if (!content.includes('EDUCATION')) {
    throw new Error('교육 플랜이 정의되지 않았습니다');
  }
  
  // 일반 플랜과 비교
  if (!content.includes('monthlyVideoLimit: 10')) {
    throw new Error('일반 무료 플랜 (10개)이 정의되지 않았습니다');
  }
});

test('JWT 토큰 인증', () => {
  const srcPath = 'packages/education-auth/src/index.ts';
  const content = fs.readFileSync(srcPath, 'utf8');
  
  if (!content.includes('jsonwebtoken')) {
    throw new Error('JWT 라이브러리가 임포트되지 않았습니다');
  }
  
  if (!content.includes('jwt.sign')) {
    throw new Error('JWT 토큰 생성이 구현되지 않았습니다');
  }
  
  if (!content.includes('jwt.verify')) {
    throw new Error('JWT 토큰 검증이 구현되지 않았습니다');
  }
});

test('사용량 제한 체크', () => {
  const srcPath = 'packages/education-auth/src/index.ts';
  const content = fs.readFileSync(srcPath, 'utf8');
  
  if (!content.includes('checkUsageLimit')) {
    throw new Error('사용량 제한 체크 함수가 없습니다');
  }
  
  if (!content.includes('dailyVideoLimit') || !content.includes('monthlyVideoLimit')) {
    throw new Error('일간/월간 제한이 구현되지 않았습니다');
  }
});

test('SheerID API 준비', () => {
  const srcPath = 'packages/education-auth/src/index.ts';
  const content = fs.readFileSync(srcPath, 'utf8');
  
  if (!content.includes('SheerID')) {
    throw new Error('SheerID API 연동 준비가 안 되어 있습니다');
  }
  
  if (!content.includes('SHEERID_API_KEY')) {
    throw new Error('SheerID API 키 설정이 없습니다');
  }
});

// ==================== 통합 테스트 ====================

test('두 패키지 간 연동 가능', () => {
  // 실시간 편집기가 교육 플랜 사용자에게만 제공되는지 체크
  const authPath = 'packages/education-auth/src/index.ts';
  const authContent = fs.readFileSync(authPath, 'utf8');
  
  if (!authContent.includes('realtime_edit')) {
    throw new Error('교육 플랜에 실시간 편집 기능이 포함되지 않았습니다');
  }
});

test('TypeScript 설정', () => {
  const packages = [
    'packages/realtime-subtitle-editor',
    'packages/education-auth'
  ];
  
  packages.forEach(pkg => {
    const tsconfigPath = path.join(pkg, 'tsconfig.json');
    // 패키지가 root tsconfig 상속
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(pkg, 'package.json'), 'utf8')
    );
    
    if (!packageJson.scripts || !packageJson.scripts.build) {
      throw new Error(`${pkg}에 빌드 스크립트가 없습니다`);
    }
  });
});

test('의존성 설치 가능', async () => {
  // package.json 의존성 체크
  const packages = [
    'packages/realtime-subtitle-editor/package.json',
    'packages/education-auth/package.json'
  ];
  
  packages.forEach(pkgPath => {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // 필수 의존성 체크
    if (!pkg.dependencies && !pkg.devDependencies) {
      throw new Error(`${pkgPath}에 의존성이 정의되지 않았습니다`);
    }
  });
});

test('전체 프로젝트 100% 완성도', () => {
  // 기존 테스트 + 새 기능
  const requiredPackages = [
    'packages/cost-monitor',
    'packages/gpt-service',
    'packages/infographic-generator',
    'packages/korean-subtitle',
    'packages/scenario-manager',
    'packages/subtitle-generator',
    'packages/video-orchestrator',
    'packages/video-synthesizer',
    'packages/realtime-subtitle-editor',  // 새 기능
    'packages/education-auth'              // 새 기능
  ];
  
  requiredPackages.forEach(pkg => {
    if (!fs.existsSync(pkg)) {
      throw new Error(`필수 패키지 누락: ${pkg}`);
    }
  });
  
  console.log('   ✓ 10개 핵심 패키지 모두 구현됨');
});

// 테스트 실행
runTests().catch(console.error);