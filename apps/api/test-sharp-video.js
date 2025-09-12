// Sharp 기반 비디오 생성 테스트
const { SharpVideoGenerator } = require('./src/services/sharp-video-generator');

async function testSharpVideo() {
  console.log('🎨 Sharp + SVG 비디오 생성 테스트');
  
  const videoId = 'sharp-test-' + Date.now();
  const projectId = 'cmf9wwmia00026oj6rnpq5tq0';
  const scenarioId = 'cmffppzx40003mfkctlrjx6z7';
  
  // 테스트용 시나리오 직접 생성
  const mockScenario = {
    scenes: [
      {
        id: '1',
        type: 'intro',
        title: 'RAG 소개',
        narration: 'Retrieval-Augmented Generation의 혁신적인 기술',
        duration: 2
      },
      {
        id: '2', 
        type: 'concept',
        title: 'RAG 구성요소',
        narration: '검색, 보강, 생성의 3단계 프로세스',
        duration: 2
      },
      {
        id: '3',
        type: 'process',
        title: 'RAG 프로세스',
        narration: '질문에서 답변까지의 과정',
        duration: 2
      },
      {
        id: '4',
        type: 'benefits',
        title: 'RAG의 장점',
        narration: '정확성, 신뢰성, 유연성, 비용효율성',
        duration: 2
      },
      {
        id: '5',
        type: 'example',
        title: 'RAG 구현 예제',
        narration: 'LangChain을 활용한 RAG 구현',
        duration: 2
      },
      {
        id: '6',
        type: 'conclusion',
        title: '마무리',
        narration: 'RAG로 AI의 미래를 만들어가세요',
        duration: 2
      }
    ]
  };
  
  // Mock getScenario function
  const generator = new SharpVideoGenerator(videoId, projectId, scenarioId);
  generator.getScenario = async () => mockScenario;
  
  try {
    await generator.generate();
    console.log('✅ Sharp 비디오 생성 완료!');
  } catch (error) {
    console.error('❌ Sharp 비디오 생성 실패:', error);
  }
}

testSharpVideo();