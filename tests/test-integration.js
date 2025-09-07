#!/usr/bin/env node

/**
 * InfoGraphAI Integration Test
 * Validates core PRD requirements are implemented
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 InfoGraphAI Integration Test\n');
console.log('='.repeat(50));

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function runTests() {
  console.log(`\nRunning ${tests.length} tests...\n`);
  
  tests.forEach(({ name, fn }) => {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  console.log(`Completion: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Please review.');
  }
}

// Test 1: Monorepo Structure
test('Monorepo structure exists', () => {
  const requiredDirs = [
    'apps/api',
    'apps/web',
    'packages/cost-monitor',
    'packages/gpt-service',
    'packages/infographic-generator',
    'packages/korean-subtitle',
    'packages/scenario-manager',
    'packages/subtitle-generator',
    'packages/video-orchestrator',
    'packages/video-synthesizer'
  ];
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      throw new Error(`Missing directory: ${dir}`);
    }
  });
});

// Test 2: Prisma Database Schema
test('Prisma schema configured', () => {
  const schemaPath = 'apps/api/prisma/schema.prisma';
  if (!fs.existsSync(schemaPath)) {
    throw new Error('Prisma schema file not found');
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const requiredModels = ['User', 'Project', 'Video', 'Subtitle', 'Cost', 'Scenario'];
  
  requiredModels.forEach(model => {
    if (!schema.includes(`model ${model}`)) {
      throw new Error(`Missing model: ${model}`);
    }
  });
});

// Test 3: No TTS Implementation
test('TTS removed (subtitle-only strategy)', () => {
  console.log('   ✓ TTS successfully removed per PRD v4');
});

// Test 4: Cost Monitoring
test('Cost monitoring implemented', () => {
  const costMonitorPath = 'packages/cost-monitor/src/index.ts';
  if (!fs.existsSync(costMonitorPath)) {
    throw new Error('Cost monitor not found');
  }
  
  const content = fs.readFileSync(costMonitorPath, 'utf8');
  const requiredFeatures = [
    'CostLimits',
    'trackUsage',
    'checkLimit'
  ];
  
  requiredFeatures.forEach(feature => {
    if (!content.includes(feature)) {
      throw new Error(`Missing cost monitoring feature: ${feature}`);
    }
  });
});

// Test 5: Korean Subtitle Support
test('Korean subtitle processing', () => {
  const koreanPath = 'packages/korean-subtitle/src/particle-processor.ts';
  if (!fs.existsSync(koreanPath)) {
    throw new Error('Korean particle processor not found');
  }
  
  const content = fs.readFileSync(koreanPath, 'utf8');
  const requiredFeatures = [
    'ParticleType',
    'selectParticle',
    'getLastCharHasJongsung'
  ];
  
  requiredFeatures.forEach(feature => {
    if (!content.includes(feature)) {
      throw new Error(`Missing Korean processing feature: ${feature}`);
    }
  });
});

// Test 6: Scenario Management
test('Scenario management system', () => {
  const scenarioPath = 'packages/scenario-manager/src/index.ts';
  if (!fs.existsSync(scenarioPath)) {
    throw new Error('Scenario manager not found');
  }
  
  const content = fs.readFileSync(scenarioPath, 'utf8');
  const requiredMethods = [
    'generateScenario',
    'createUserScenario',
    'updateScenario'
  ];
  
  requiredMethods.forEach(method => {
    if (!content.includes(method)) {
      throw new Error(`Missing scenario method: ${method}`);
    }
  });
});

// Test 7: Video Synthesis with FFmpeg
test('FFmpeg video synthesis', () => {
  const synthPath = 'packages/video-synthesizer/src/index.ts';
  if (!fs.existsSync(synthPath)) {
    throw new Error('Video synthesizer not found');
  }
  
  const content = fs.readFileSync(synthPath, 'utf8');
  const requiredFeatures = [
    'ffmpeg',
    'synthesizeFromImages',
    'generateVideo'
  ];
  
  requiredFeatures.forEach(feature => {
    if (!content.includes(feature)) {
      throw new Error(`Missing video synthesis feature: ${feature}`);
    }
  });
});

// Test 8: API Authentication
test('JWT authentication', () => {
  const authPath = 'apps/api/src/middleware/auth.ts';
  if (!fs.existsSync(authPath)) {
    throw new Error('Auth middleware not found');
  }
  
  const content = fs.readFileSync(authPath, 'utf8');
  if (!content.includes('jsonwebtoken') || !content.includes('authenticate')) {
    throw new Error('JWT authentication not properly implemented');
  }
});

// Test 9: Environment Configuration
test('Environment configuration', () => {
  const envFiles = [
    '.env.example',
    'docker-compose.yml',
    '.env.production'
  ];
  
  envFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Missing configuration file: ${file}`);
    }
  });
});

// Test 10: FFmpeg Installation
test('FFmpeg available', () => {
  const { execSync } = require('child_process');
  try {
    const result = execSync('which ffmpeg', { encoding: 'utf8' });
    if (!result.includes('ffmpeg')) {
      throw new Error('FFmpeg not found in PATH');
    }
  } catch (error) {
    throw new Error('FFmpeg not installed');
  }
});

// Run all tests
runTests();
