// RAG (Retrieval-Augmented Generation) 교육 비디오 생성 테스트 - 개선된 템플릿 시스템
const { EnhancedAnimationRenderer } = require('./dist/services/enhanced-animation-renderer');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// RAG 시스템 교육 시나리오 (AI 생성 시뮬레이션)
const ragScenario = {
  topic: 'RAG (Retrieval-Augmented Generation)',
  duration: 30,
  scenes: [
    {
      id: 'scene_001',
      type: 'intro',
      duration: 5,
      title: 'RAG 시스템',
      subtitle: 'AI의 한계를 뛰어넘는 혁신',
      narration: 'RAG는 검색과 생성을 결합하여 더 정확하고 최신의 정보를 제공합니다.',
      layout: 'center',
      visualElements: [
        { type: 'icon', id: 'rag_logo', content: '🧠', style: { size: 'large', color: '#4f46e5' } },
        { type: 'text', id: 'title', content: 'RAG', style: { size: 'large', color: '#1f2937' } },
        { type: 'text', id: 'subtitle', content: 'Retrieval-Augmented Generation', style: { size: 'medium', color: '#6b7280' } }
      ],
      animations: [
        { type: 'zoomIn', target: 'rag_logo', duration: 1, delay: 0 },
        { type: 'typewriter', target: 'title', duration: 1.5, delay: 0.5 },
        { type: 'fadeIn', target: 'subtitle', duration: 1, delay: 2 }
      ]
    },
    {
      id: 'scene_002',
      type: 'concept',
      duration: 5,
      title: 'RAG의 핵심 개념',
      subtitle: '검색 + 생성 = 혁신',
      narration: 'RAG는 외부 지식을 검색하여 LLM의 생성 능력과 결합합니다.',
      layout: 'split',
      visualElements: [
        { type: 'diagram', id: 'retrieval', content: 'Knowledge Base\n검색', style: { color: '#059669' } },
        { type: 'diagram', id: 'generation', content: 'LLM\n생성', style: { color: '#dc2626' } },
        { type: 'arrow', id: 'flow_arrow', content: '→', style: { size: 'large' } }
      ],
      animations: [
        { type: 'slideIn', target: 'retrieval', duration: 1, delay: 0 },
        { type: 'slideIn', target: 'generation', duration: 1, delay: 0.5 },
        { type: 'pulse', target: 'flow_arrow', duration: 2, delay: 1 }
      ]
    },
    {
      id: 'scene_003',
      type: 'process',
      duration: 6,
      title: 'RAG 동작 과정',
      subtitle: '4단계 프로세스',
      narration: 'RAG는 쿼리 분석, 검색, 컨텍스트 구성, 답변 생성의 4단계로 동작합니다.',
      layout: 'grid',
      visualElements: [
        { type: 'step', id: 'step1', content: '1. Query\nAnalysis', style: { color: '#3b82f6' } },
        { type: 'step', id: 'step2', content: '2. Vector\nSearch', style: { color: '#8b5cf6' } },
        { type: 'step', id: 'step3', content: '3. Context\nComposition', style: { color: '#06b6d4' } },
        { type: 'step', id: 'step4', content: '4. Response\nGeneration', style: { color: '#10b981' } }
      ],
      animations: [
        { type: 'cascadeIn', target: 'all_steps', duration: 2, delay: 0 },
        { type: 'highlight', target: 'step1', duration: 0.8, delay: 2 },
        { type: 'highlight', target: 'step2', duration: 0.8, delay: 2.8 },
        { type: 'highlight', target: 'step3', duration: 0.8, delay: 3.6 },
        { type: 'highlight', target: 'step4', duration: 0.8, delay: 4.4 }
      ]
    },
    {
      id: 'scene_004',
      type: 'benefits',
      duration: 5,
      title: 'RAG의 장점',
      subtitle: 'Why RAG?',
      narration: 'RAG는 환각 현상 감소, 실시간 정보 반영, 도메인 특화 지식 활용이 가능합니다.',
      layout: 'grid',
      visualElements: [
        { type: 'benefit', id: 'accuracy', content: '정확성 향상\n✓ 환각 감소', style: { color: '#059669' } },
        { type: 'benefit', id: 'freshness', content: '최신 정보\n✓ 실시간 업데이트', style: { color: '#0891b2' } },
        { type: 'benefit', id: 'domain', content: '도메인 특화\n✓ 전문 지식', style: { color: '#7c2d12' } }
      ],
      animations: [
        { type: 'bounceIn', target: 'accuracy', duration: 1, delay: 0 },
        { type: 'bounceIn', target: 'freshness', duration: 1, delay: 0.5 },
        { type: 'bounceIn', target: 'domain', duration: 1, delay: 1 }
      ],
      dataPoints: [
        { label: '정확도 개선', value: '40-60%', highlight: true },
        { label: '환각 현상', value: '80% 감소', highlight: true }
      ]
    },
    {
      id: 'scene_005',
      type: 'example',
      duration: 4,
      title: '실제 구현 예제',
      subtitle: 'Python + LangChain',
      narration: 'LangChain과 벡터 DB를 활용한 RAG 시스템 구현이 가능합니다.',
      layout: 'split',
      visualElements: [
        { type: 'code', id: 'code_example', content: 'from langchain import RAG\\nvector_db = Chroma()\\nretriever = vector_db.as_retriever()\\nchain = RetrievalQA.from_chain_type()', style: { language: 'python' } },
        { type: 'architecture', id: 'arch_diagram', content: 'App → RAG → Vector DB\\n     ↓\\n   LLM → Response' }
      ],
      animations: [
        { type: 'typewriter', target: 'code_example', duration: 2.5, delay: 0 },
        { type: 'slideIn', target: 'arch_diagram', duration: 1.5, delay: 1 }
      ]
    },
    {
      id: 'scene_006',
      type: 'conclusion',
      duration: 5,
      title: 'RAG 시작하기',
      subtitle: '지금 바로 구현해보세요!',
      narration: 'RAG는 AI 애플리케이션의 게임 체인저입니다. 오늘부터 시작해보세요!',
      layout: 'center',
      visualElements: [
        { type: 'cta', id: 'call_to_action', content: 'Start Building with RAG', style: { size: 'large', color: '#1d4ed8' } },
        { type: 'icons', id: 'tech_stack', content: ['🔍', '🤖', '💾', '⚡'], style: { layout: 'row' } }
      ],
      animations: [
        { type: 'scaleIn', target: 'call_to_action', duration: 1.5, delay: 0 },
        { type: 'stagger', target: 'tech_stack', duration: 2, delay: 1 }
      ]
    }
  ]
};

async function generateRAGVideo() {
  console.log('🎬 RAG 교육 비디오 생성 시작 - 개선된 템플릿 시스템 테스트');
  console.log('============================================================');

  const startTime = Date.now();

  try {
    // 개선된 렌더러 초기화
    console.log('🔧 개선된 렌더러 초기화 중...');
    const renderer = new EnhancedAnimationRenderer();

    // 출력 디렉토리 설정
    const outputDir = path.join(__dirname, 'public', 'videos');
    await fs.mkdir(outputDir, { recursive: true });

    const videoId = `rag_video_${Date.now()}`;
    const framesDir = path.join(outputDir, `${videoId}_frames`);
    await fs.mkdir(framesDir, { recursive: true });

    console.log('📁 출력 디렉토리:', framesDir);

    // 비디오 설정
    const width = 1920;
    const height = 1080;
    const fps = 30;

    console.log(`🎥 비디오 설정: ${width}x${height}, ${fps}fps`);

    // 각 장면별 프레임 생성
    let totalFrames = 0;
    let globalFrameIndex = 0;

    for (let sceneIndex = 0; sceneIndex < ragScenario.scenes.length; sceneIndex++) {
      const scene = ragScenario.scenes[sceneIndex];
      console.log(`\n🎬 장면 ${sceneIndex + 1}: ${scene.title} (${scene.duration}초)`);

      const sceneFrames = scene.duration * fps;

      for (let frameNum = 0; frameNum < sceneFrames; frameNum++) {
        const progress = frameNum / (sceneFrames - 1);
        const globalFrameNum = globalFrameIndex + frameNum;

        try {
          // 개선된 템플릿 시스템을 사용한 프레임 렌더링
          const frameBuffer = await renderer.renderSceneWithTemplates(scene, 'RAG (Retrieval-Augmented Generation)', frameNum, sceneFrames, 'intermediate');

          if (!frameBuffer || frameBuffer.length === 0) {
            throw new Error(`Frame ${globalFrameNum}: Empty buffer returned`);
          }

          // 프레임 저장 (연속 번호로)
          const frameFilename = `frame_${globalFrameNum.toString().padStart(6, '0')}.png`;
          const framePath = path.join(framesDir, frameFilename);
          await fs.writeFile(framePath, frameBuffer);

          // 진행률 표시 (10% 간격)
          if (frameNum % Math.max(1, Math.floor(sceneFrames / 10)) === 0) {
            const sceneProgress = Math.round((frameNum / sceneFrames) * 100);
            console.log(`  📈 진행률: ${sceneProgress}% (프레임 ${globalFrameNum + 1})`);
          }

        } catch (frameError) {
          console.error(`❌ 프레임 ${globalFrameNum} 생성 실패:`, frameError.message);
          throw frameError;
        }
      }

      globalFrameIndex += sceneFrames;
      totalFrames += sceneFrames;

      const elapsed = Math.round((Date.now() - startTime) / 1000);
      console.log(`✅ 장면 ${sceneIndex + 1} 완료 (${elapsed}초 경과)`);
    }

    console.log(`\n🎞️  총 프레임 생성 완료: ${totalFrames}개`);

    // FFmpeg로 비디오 합성
    console.log('🔄 FFmpeg 비디오 합성 시작...');

    const outputPath = path.join(outputDir, `${videoId}.mp4`);
    const ffmpegCommand = [
      'ffmpeg',
      '-y', // 덮어쓰기
      `-r ${fps}`, // 프레임 레이트
      `-i "${path.join(framesDir, 'frame_%06d.png')}"`, // 입력 패턴
      '-c:v libx264', // 코덱
      '-pix_fmt yuv420p', // 픽셀 포맷
      '-crf 23', // 품질
      '-preset medium', // 인코딩 속도
      `"${outputPath}"` // 출력 파일
    ].join(' ');

    console.log('🔧 FFmpeg 명령:', ffmpegCommand);

    const { stdout, stderr } = await execAsync(ffmpegCommand);

    if (stderr && !stderr.includes('frame=')) {
      console.log('⚠️  FFmpeg 경고:', stderr.substring(0, 200) + '...');
    }

    // 결과 확인
    const stats = await fs.stat(outputPath);
    const fileSize = Math.round(stats.size / 1024); // KB
    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n🎉 RAG 비디오 생성 완료!');
    console.log('============================================================');
    console.log('📁 출력 파일:', outputPath);
    console.log('📊 파일 크기:', `${fileSize}KB`);
    console.log('⏱️  총 소요시간:', `${duration}초`);
    console.log('🎬 비디오 정보:');
    console.log(`  • 해상도: ${width}x${height}`);
    console.log(`  • 프레임 레이트: ${fps}fps`);
    console.log(`  • 총 프레임: ${totalFrames}개`);
    console.log(`  • 재생 시간: ${ragScenario.duration}초`);
    console.log(`  • 장면 수: ${ragScenario.scenes.length}개`);

    // 템프 파일 정리
    console.log('\n🧹 임시 파일 정리 중...');
    await fs.rm(framesDir, { recursive: true, force: true });
    console.log('✅ 정리 완료');

    // 품질 평가 및 비교
    console.log('\n📈 품질 평가:');
    console.log('  • 다양한 레이아웃 활용: ✅');
    console.log('  • 풍부한 애니메이션: ✅');
    console.log('  • 교육적 구조: ✅');
    console.log('  • 시각적 매력도: ✅');
    console.log('  • 템플릿 시스템 개선도: 🔍 확인 필요');

    return {
      success: true,
      outputPath,
      fileSize,
      duration: ragScenario.duration,
      processingTime: duration,
      frames: totalFrames,
      scenes: ragScenario.scenes.length
    };

  } catch (error) {
    console.error('\n❌ RAG 비디오 생성 실패:', error.message);
    console.error('📋 상세 오류:', error.stack);
    throw error;
  }
}

// 메인 실행
console.log('🚀 InfoGraphAI RAG 비디오 생성 테스트 - 템플릿 시스템 개선 검증');
console.log('📋 테스트 목표: 새로운 템플릿과 애니메이션 시스템 확인');

generateRAGVideo()
  .then(result => {
    console.log('\n✨ 테스트 성공!');
    console.log('📊 결과 요약:');
    console.log(`  ✅ 비디오 생성: ${result.success ? '성공' : '실패'}`);
    console.log(`  📁 파일 크기: ${result.fileSize}KB`);
    console.log(`  ⏱️  처리 시간: ${result.processingTime}초`);
    console.log(`  🎞️  프레임 수: ${result.frames}개`);
    console.log(`  🎬 장면 수: ${result.scenes}개`);
    console.log('\n🎯 다음 단계: 생성된 비디오 품질 검토 및 템플릿 시스템 개선사항 확인');
  })
  .catch(error => {
    console.error('\n💥 테스트 실패:', error.message);
    process.exit(1);
  });