const fetch = require('node-fetch');

async function testRAGVideoGeneration() {
  try {
    console.log('🎬 RAG 비디오 생성 시작 - 개선된 템플릿 시스템 테스트');
    console.log('============================================================');

    const startTime = Date.now();

    // 1단계: 프로젝트 생성
    console.log('📋 1단계: 프로젝트 생성 중...');
    const projectResponse = await fetch('http://localhost:4906/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'RAG 시스템 완전 정복',
        description: 'Retrieval-Augmented Generation의 개념부터 실전 구현까지',
        topic: 'RAG (Retrieval-Augmented Generation)'
      })
    });

    if (!projectResponse.ok) {
      throw new Error(`프로젝트 생성 실패: ${projectResponse.status}`);
    }

    const project = await projectResponse.json();
    console.log('✅ 프로젝트 생성 완료:', project.title);
    console.log('🆔 프로젝트 ID:', project.id);

    // 2단계: AI 시나리오 생성 (개선된 프롬프트)
    console.log('\n🤖 2단계: AI 시나리오 생성 중...');
    const scenarioResponse = await fetch('http://localhost:4906/api/ai/generate-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: project.id,
        topic: 'RAG (Retrieval-Augmented Generation)',
        duration: 30,
        targetAudience: 'intermediate developers',
        focus: 'comprehensive explanation with visual diagrams, architecture flow, and practical implementation examples'
      })
    });

    if (!scenarioResponse.ok) {
      const errorText = await scenarioResponse.text();
      throw new Error(`시나리오 생성 실패: ${scenarioResponse.status} - ${errorText}`);
    }

    const scenario = await scenarioResponse.json();
    console.log('✅ AI 시나리오 생성 완료:', scenario.title);
    console.log('📝 총 장면 수:', scenario.scenes?.length || 'N/A');

    // 시나리오 상세 정보 출력
    if (scenario.scenes && scenario.scenes.length > 0) {
      console.log('\n📋 생성된 시나리오 구조:');
      scenario.scenes.forEach((scene, index) => {
        console.log(`  ${index + 1}. ${scene.type}: ${scene.title}`);
        if (scene.content) {
          const preview = scene.content.substring(0, 80);
          console.log(`     내용: ${preview}...`);
        }
      });
    }

    // 3단계: 비디오 생성
    console.log('\n🎥 3단계: 비디오 생성 시작...');
    const videoResponse = await fetch('http://localhost:4906/api/videos/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioId: scenario.id,
        width: 1920,
        height: 1080,
        fps: 30
      })
    });

    if (!videoResponse.ok) {
      const errorText = await videoResponse.text();
      throw new Error(`비디오 생성 요청 실패: ${videoResponse.status} - ${errorText}`);
    }

    const video = await videoResponse.json();
    console.log('✅ 비디오 생성 작업 시작:', video.id);

    // 4단계: 진행상황 모니터링
    console.log('\n📊 4단계: 비디오 처리 모니터링...');
    let attempts = 0;
    const maxAttempts = 60; // 3분

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const statusResponse = await fetch(`http://localhost:4906/api/videos/${video.id}`);
      if (!statusResponse.ok) {
        console.log('⚠️  상태 조회 실패, 재시도 중...');
        attempts++;
        continue;
      }

      const videoStatus = await statusResponse.json();
      const elapsed = Math.round((Date.now() - startTime) / 1000);

      console.log(`📈 진행상황: ${videoStatus.status} (${videoStatus.progress || 0}%) - ${elapsed}초 경과`);

      if (videoStatus.status === 'completed') {
        console.log('\n🎉 비디오 생성 완료!');
        console.log('============================================================');
        console.log('📁 출력 파일:', videoStatus.outputUrl);
        console.log('⏱️  총 처리 시간:', elapsed, '초');
        console.log('📊 파일 크기:', videoStatus.fileSize ? `${Math.round(videoStatus.fileSize / 1024)}KB` : 'N/A');
        console.log('🎬 비디오 스펙: 1920x1080, 30fps');

        // 파일 존재 확인
        const fs = require('fs');
        const path = require('path');
        const publicPath = path.join(__dirname, 'public', videoStatus.outputUrl.replace('/videos/', ''));

        if (fs.existsSync(publicPath)) {
          const stats = fs.statSync(publicPath);
          console.log('✅ 파일 확인됨:', `${Math.round(stats.size / 1024)}KB`);
        } else {
          console.log('⚠️  파일 경로 확인 필요:', publicPath);
        }

        break;
      } else if (videoStatus.status === 'failed') {
        console.log('❌ 비디오 생성 실패');
        console.log('🔍 오류 내용:', videoStatus.error || 'Unknown error');
        break;
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.log('⏰ 타임아웃: 비디오 생성이 예상보다 오래 걸리고 있습니다.');
    }

    return { project, scenario, video };

  } catch (error) {
    console.error('\n❌ RAG 비디오 생성 오류:', error.message);
    if (error.stack) {
      console.error('📋 스택 트레이스:', error.stack);
    }
    throw error;
  }
}

// 메인 실행
console.log('🚀 InfoGraphAI RAG 비디오 생성 테스트 시작');
testRAGVideoGeneration()
  .then(result => {
    console.log('\n✨ 테스트 완료!');
    console.log('📝 결과 요약:');
    console.log('  - 프로젝트:', result.project.title);
    console.log('  - 시나리오:', result.scenario.title);
    console.log('  - 비디오 ID:', result.video.id);
  })
  .catch(error => {
    console.error('\n💥 테스트 실패:', error.message);
    process.exit(1);
  });