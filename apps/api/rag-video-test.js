/**
 * RAG 비디오 생성 테스트 스크립트
 */

const API_URL = 'http://localhost:4906';
let authToken = '';
let projectId = '';
let scenarioId = '';

async function login() {
  console.log('🔐 로그인 중...');
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'kelly@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  authToken = data.token;
  console.log('✅ 로그인 완료:', data.user.email);
  return data;
}

async function createRAGProject() {
  console.log('📁 RAG 프로젝트 생성 중...');
  const response = await fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      title: 'RAG 완전 가이드',
      description: 'Retrieval-Augmented Generation 교육 비디오',
      topic: 'RAG (검색 증강 생성)'
    })
  });
  
  const project = await response.json();
  projectId = project.id;
  console.log('✅ RAG 프로젝트 생성 완료:', project.title);
  return project;
}

async function createRAGScenario() {
  console.log('🎬 RAG 시나리오 생성 중...');
  const response = await fetch(`${API_URL}/api/scenarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      projectId: projectId,
      title: 'RAG 시스템 완전 가이드',
      description: '검색 증강 생성의 모든 것을 다루는 교육 비디오',
      scenes: [
        {
          type: 'intro',
          duration: 4,
          title: 'RAG 시작하기',
          narration: '안녕하세요! RAG 시스템에 대해 완벽하게 알아보겠습니다'
        },
        {
          type: 'concept',
          duration: 6,
          title: 'RAG란 무엇인가?',
          narration: 'RAG는 검색 증강 생성으로, AI가 외부 지식을 활용해 더 정확한 답변을 생성하는 혁신적인 방법입니다'
        },
        {
          type: 'process',
          duration: 5,
          title: '문서 임베딩',
          narration: '먼저 문서들을 벡터로 변환하여 벡터 데이터베이스에 저장합니다'
        },
        {
          type: 'process',
          duration: 5,
          title: '유사도 검색',
          narration: '사용자 질문과 가장 유사한 문서들을 벡터 검색으로 찾아냅니다'
        },
        {
          type: 'example',
          duration: 7,
          title: 'Python 구현',
          narration: 'LangChain과 OpenAI를 사용해서 실제 RAG 시스템을 구현해보겠습니다'
        },
        {
          type: 'conclusion',
          duration: 3,
          title: '마무리',
          narration: 'RAG를 활용해서 더 똑똑하고 신뢰할 수 있는 AI를 만들어보세요!'
        }
      ]
    })
  });
  
  const scenario = await response.json();
  scenarioId = scenario.id;
  console.log('✅ RAG 시나리오 생성 완료:', scenario.title);
  console.log(`📊 총 ${scenario.scenes.length}개 씬, ${scenario.totalDuration}초 길이`);
  return scenario;
}

async function generateRAGVideo() {
  console.log('🎥 RAG 비디오 생성 중...');
  const response = await fetch(`${API_URL}/api/videos/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      projectId: projectId,
      scenarioId: scenarioId
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`비디오 생성 실패: ${response.status} - ${error}`);
  }
  
  const result = await response.json();
  console.log('✅ RAG 비디오 생성 시작:', result.video.id);
  return result.video;
}

async function waitForRAGVideo(videoId) {
  console.log('⏳ RAG 비디오 완성까지 대기 중...');
  
  for (let i = 0; i < 20; i++) {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3초 대기
    
    const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const video = await response.json();
    console.log(`📊 상태: ${video.status}, 진행률: ${video.progress}%`);
    
    if (video.status === 'COMPLETED') {
      console.log('🎉 RAG 비디오 생성 완료!');
      console.log(`📺 비디오 보기: ${API_URL}${video.url}`);
      console.log(`📄 프리뷰 보기: ${API_URL}/videos/${videoId}.html`);
      return video;
    }
    
    if (video.status === 'FAILED') {
      throw new Error(`RAG 비디오 생성 실패: ${video.error}`);
    }
  }
  
  throw new Error('RAG 비디오 생성 타임아웃');
}

async function main() {
  try {
    console.log('🚀 RAG 교육 비디오 생성 시작!\n');
    
    await login();
    await createRAGProject();
    await createRAGScenario();
    
    const video = await generateRAGVideo();
    await waitForRAGVideo(video.id);
    
    console.log('\n✅ RAG 교육 비디오 완성!');
  } catch (error) {
    console.error('\n❌ RAG 비디오 생성 실패:', error.message);
    process.exit(1);
  }
}

// RAG 비디오 생성 실행
main();