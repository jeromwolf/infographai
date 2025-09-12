// 30초 Full 비디오 생성 테스트
const { SharpVideoGenerator } = require('./src/services/sharp-video-generator');

async function test30SecVideo() {
  console.log('🎬 30초 Full 비디오 생성 테스트');
  
  const videoId = 'sharp-30sec-' + Date.now();
  const projectId = 'cmf9wwmia00026oj6rnpq5tq0';
  const scenarioId = 'cmffppzx40003mfkctlrjx6z7';
  
  // 30초 시나리오 (각 씬 5초)
  const mockScenario = {
    scenes: [
      {
        id: '1',
        type: 'intro',
        title: 'RAG 완벽 가이드',
        narration: 'Retrieval-Augmented Generation - AI의 미래를 바꾸는 혁신 기술',
        duration: 5  // 5초
      },
      {
        id: '2', 
        type: 'concept',
        title: 'RAG란 무엇인가?',
        narration: '검색(Retrieval) + 보강(Augmented) + 생성(Generation)의 결합',
        duration: 5
      },
      {
        id: '3',
        type: 'process',
        title: 'RAG 작동 원리',
        narration: '사용자 질문 → 관련 문서 검색 → 컨텍스트 보강 → AI 응답 생성',
        duration: 5
      },
      {
        id: '4',
        type: 'benefits',
        title: 'RAG의 강력한 장점',
        narration: '정확성 95% 향상, 실시간 정보 반영, 환각 현상 감소, 비용 효율성',
        duration: 5
      },
      {
        id: '5',
        type: 'example',
        title: '실제 구현 사례',
        narration: 'ChatGPT, Bard, Claude 등 주요 AI 서비스에 적용된 RAG 기술',
        duration: 5
      },
      {
        id: '6',
        type: 'conclusion',
        title: '지금 시작하세요!',
        narration: 'RAG로 당신의 AI 프로젝트를 한 단계 업그레이드하세요',
        duration: 5
      }
    ]
  };
  
  const generator = new SharpVideoGenerator(videoId, projectId, scenarioId);
  generator.getScenario = async () => mockScenario;
  
  try {
    await generator.generate();
    console.log('✅ 30초 비디오 생성 완료!');
    console.log(`📹 비디오 위치: public/videos/${videoId}.mp4`);
    console.log(`▶️  재생: open public/videos/${videoId}.mp4`);
  } catch (error) {
    console.error('❌ 비디오 생성 실패:', error);
  }
}

test30SecVideo();