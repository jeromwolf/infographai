// Canvas 렌더링 테스트 스크립트
const { CanvasVideoGenerator } = require('./src/services/canvas-video-generator');

async function testCanvasRendering() {
  console.log('🎨 Canvas 렌더링 테스트 시작');
  
  // 기존 실제 비디오 ID 사용
  const videoId = 'cmffptk710001mfkcn3h1ozpu';
  const projectId = 'cmf9wwmia00026oj6rnpq5tq0';
  const scenarioId = 'cmffppzx40003mfkctlrjx6z7';
  
  const generator = new CanvasVideoGenerator(videoId, projectId, scenarioId);
  
  try {
    await generator.generate();
    console.log('✅ Canvas 렌더링 완료!');
  } catch (error) {
    console.error('❌ Canvas 렌더링 실패:', error);
  }
}

testCanvasRendering();