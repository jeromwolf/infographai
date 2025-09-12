// 자동 시나리오 생성 테스트 스크립트
import { AutoScenarioGenerator } from './src/services/auto-scenario-generator.js';

async function testScenarioGeneration() {
  const generator = new AutoScenarioGenerator();
  
  const testTopics = [
    'RAG',
    'Docker',
    'REST API',
    'React Hooks',
    'Kubernetes'
  ];
  
  console.log('🚀 자동 시나리오 생성 테스트 시작\n');
  
  for (const topic of testTopics) {
    console.log(`\n📝 토픽: ${topic}`);
    console.log('='.repeat(50));
    
    try {
      const scenario = await generator.generateFromTopic(topic, 'test-user');
      
      console.log(`✅ 시나리오 생성 성공!`);
      console.log(`- 제목: ${scenario.title}`);
      console.log(`- 카테고리: ${scenario.metadata.category}`);
      console.log(`- 난이도: ${scenario.metadata.difficulty}`);
      console.log(`- 씬 개수: ${scenario.sceneCount}`);
      console.log(`- 총 시간: ${scenario.totalDuration}초`);
      console.log(`- 키워드: ${scenario.metadata.keywords.join(', ')}`);
      
      console.log('\n📍 씬 구성:');
      scenario.scenes.forEach((scene, index) => {
        console.log(`  ${index + 1}. [${scene.type}] ${scene.title} (${scene.duration}초)`);
        console.log(`     스타일: ${scene.style.backgroundColor} | 애니메이션: ${scene.style.animation}`);
      });
      
    } catch (error) {
      console.error(`❌ 에러 발생: ${error.message}`);
    }
  }
  
  console.log('\n\n✨ 테스트 완료!');
}

// 스크립트 실행
testScenarioGeneration().catch(console.error);