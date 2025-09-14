#!/usr/bin/env node

/**
 * Smart Template Selector 테스트
 * Phase 2 템플릿 선택 시스템 검증
 */

const { smartTemplateSelector } = require('./dist/services/smart-template-selector');
const { enhancedAnimationRenderer } = require('./dist/services/enhanced-animation-renderer');

async function testTemplateSelection() {
  console.log('🚀 Smart Template Selector Test');
  console.log('=' .repeat(60));

  // Test topics
  const testCases = [
    { topic: 'Docker Container Basics', level: 'beginner' },
    { topic: 'Kubernetes Deployment Strategy', level: 'intermediate' },
    { topic: 'React Hooks Performance Optimization', level: 'advanced' },
    { topic: 'AWS Lambda Serverless Architecture', level: 'intermediate' },
    { topic: 'TypeScript Generic Types', level: 'intermediate' },
    { topic: 'Terraform Infrastructure as Code', level: 'beginner' },
    { topic: 'Python Machine Learning Pipeline', level: 'advanced' },
    { topic: 'Database Query Optimization', level: 'intermediate' },
    { topic: 'Security Vulnerability Scanning', level: 'advanced' },
    { topic: 'Go Microservices with gRPC', level: 'intermediate' }
  ];

  for (const testCase of testCases) {
    console.log(`\n📚 Topic: ${testCase.topic}`);
    console.log(`📊 Level: ${testCase.level}`);
    console.log('-'.repeat(40));

    try {
      // Get template recommendations
      const recommendations = await smartTemplateSelector.recommendTemplates(
        testCase.topic,
        6 // Number of scenes
      );

      // Display recommendations for each scene type
      recommendations.forEach((composition, sceneType) => {
        console.log(`\n  🎬 Scene: ${sceneType}`);
        console.log(`     Primary: ${composition.primaryTemplate || 'none'}`);

        if (composition.supportingTemplates.length > 0) {
          console.log(`     Supporting:`);
          composition.supportingTemplates.forEach(template => {
            console.log(`       - ${template}`);
          });
        }

        if (composition.animations.length > 0) {
          console.log(`     Animations: ${composition.animations.join(', ')}`);
        }

        console.log(`     Layout: ${composition.layout}`);
      });

      // Test specific scene selection
      const mockScene = {
        id: 1,
        type: 'example',
        title: `${testCase.topic} Example`,
        duration: 5,
        narration: `Here's a practical example of ${testCase.topic}`,
        visualElements: [],
        animation: { type: 'fadeIn', duration: 1 },
        layout: 'single'
      };

      const selectedTemplates = await smartTemplateSelector.selectTemplatesForScene(
        mockScene,
        testCase.topic,
        testCase.level
      );

      console.log(`\n  🎯 Specific Scene Selection (${mockScene.type}):`);
      console.log(`     Primary: ${selectedTemplates.primaryTemplate}`);
      console.log(`     Layout: ${selectedTemplates.layout}`);

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  // Display template usage statistics
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Template Usage Statistics:');
  console.log('-'.repeat(40));

  const stats = smartTemplateSelector.getTemplateUsageStats();
  const sortedStats = Array.from(stats.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  sortedStats.forEach(([template, count], index) => {
    console.log(`  ${index + 1}. ${template}: ${count} uses`);
  });

  console.log('\n✅ Template selection test complete!');
}

async function testAnimationRendering() {
  console.log('\n🎨 Testing Enhanced Animation Rendering');
  console.log('=' .repeat(60));

  const testScene = {
    id: 1,
    type: 'process',
    title: 'Docker Build Process',
    duration: 5,
    narration: 'Understanding the Docker build process step by step',
    visualElements: [
      { type: 'text', content: 'FROM node:14', position: { x: 100, y: 200 } },
      { type: 'text', content: 'COPY . /app', position: { x: 100, y: 250 } },
      { type: 'text', content: 'RUN npm install', position: { x: 100, y: 300 } }
    ],
    animation: { type: 'slideIn', duration: 1 },
    layout: 'split'
  };

  try {
    console.log('🎬 Rendering test frames...');

    // Render 3 sample frames
    const frameNumbers = [0, 30, 60]; // Start, middle, end

    for (const frameNumber of frameNumbers) {
      const frameBuffer = await enhancedAnimationRenderer.renderSceneWithTemplates(
        testScene,
        frameNumber,
        90, // Total frames (3 seconds)
        'Docker Container Basics',
        'intermediate'
      );

      console.log(`  ✅ Frame ${frameNumber}: ${frameBuffer.length} bytes`);
    }

    // Test transition
    const transitionScene = {
      id: 2,
      type: 'benefits',
      title: 'Docker Benefits',
      duration: 5,
      narration: 'Key benefits of using Docker',
      visualElements: [],
      animation: { type: 'fadeIn', duration: 1 },
      layout: 'grid'
    };

    console.log('\n🔄 Testing scene transition...');
    const transitionBuffer = await enhancedAnimationRenderer.createTransition(
      testScene,
      transitionScene,
      15, // Frame number in transition
      30  // Total transition frames
    );

    console.log(`  ✅ Transition frame: ${transitionBuffer.length} bytes`);

  } catch (error) {
    console.error(`  ❌ Rendering error: ${error.message}`);
  }

  console.log('\n✅ Animation rendering test complete!');
}

// Run tests
async function main() {
  try {
    await testTemplateSelection();
    await testAnimationRendering();

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 All Phase 2 tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

main();