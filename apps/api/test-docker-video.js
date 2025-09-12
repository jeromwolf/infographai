// Docker 입문 AI 비디오 생성 테스트
const { ProfessionalAnimationRenderer } = require('./src/services/professional-animation-renderer');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Docker 입문 시나리오 (AI가 생성할 내용 시뮬레이션)
const dockerScenario = {
  topic: 'Docker 입문',
  duration: 30,
  scenes: [
    {
      id: 'scene_001',
      type: 'intro',
      duration: 5,
      title: 'Docker 완벽 가이드',
      subtitle: '컨테이너 혁명의 시작',
      narration: 'Docker는 애플리케이션을 컨테이너로 패키징하는 혁신적인 플랫폼입니다.',
      layout: 'center',
      visualElements: [
        { type: 'icon', id: 'docker_logo', content: '🐳', style: { size: 'large', color: '#0db7ed' } },
        { type: 'text', id: 'title', content: 'Docker', style: { size: 'large' } }
      ],
      animations: [
        { type: 'zoomIn', target: 'docker_logo', duration: 1, delay: 0 },
        { type: 'fadeIn', target: 'title', duration: 1, delay: 0.5 }
      ]
    },
    {
      id: 'scene_002',
      type: 'concept',
      duration: 5,
      title: '컨테이너란?',
      subtitle: 'VM vs Container',
      narration: '컨테이너는 가상머신보다 가볍고 빠르게 애플리케이션을 실행합니다.',
      layout: 'comparison',
      visualElements: [
        { type: 'diagram', id: 'vm', content: 'Virtual Machine' },
        { type: 'diagram', id: 'container', content: 'Container' }
      ],
      animations: [
        { type: 'slideIn', target: 'vm', duration: 1, delay: 0 },
        { type: 'slideIn', target: 'container', duration: 1, delay: 0.5 }
      ],
      dataPoints: [
        { label: '시작 시간', value: '수초', highlight: true },
        { label: '리소스 사용', value: '최소화', highlight: false }
      ]
    },
    {
      id: 'scene_003',
      type: 'process',
      duration: 5,
      title: 'Docker 워크플로우',
      narration: 'Build → Ship → Run의 간단한 3단계 프로세스',
      layout: 'timeline',
      visualElements: [
        { type: 'icon', id: 'build', content: 'Build' },
        { type: 'icon', id: 'ship', content: 'Ship' },
        { type: 'icon', id: 'run', content: 'Run' }
      ],
      animations: [
        { type: 'fadeIn', target: 'build', duration: 1, delay: 0 },
        { type: 'fadeIn', target: 'ship', duration: 1, delay: 1 },
        { type: 'fadeIn', target: 'run', duration: 1, delay: 2 }
      ]
    },
    {
      id: 'scene_004',
      type: 'benefits',
      duration: 5,
      title: 'Docker의 장점',
      narration: '일관성, 이식성, 확장성, 그리고 효율성을 제공합니다.',
      layout: 'grid',
      visualElements: [
        { type: 'icon', id: 'consistency', content: '✓', style: { color: '#4caf50' } },
        { type: 'icon', id: 'portability', content: '📦', style: { color: '#2196f3' } },
        { type: 'icon', id: 'scalability', content: '📈', style: { color: '#ff9800' } },
        { type: 'icon', id: 'efficiency', content: '⚡', style: { color: '#9c27b0' } }
      ],
      animations: [
        { type: 'zoomIn', target: 'consistency', duration: 0.5, delay: 0 },
        { type: 'zoomIn', target: 'portability', duration: 0.5, delay: 0.5 },
        { type: 'zoomIn', target: 'scalability', duration: 0.5, delay: 1 },
        { type: 'zoomIn', target: 'efficiency', duration: 0.5, delay: 1.5 }
      ]
    },
    {
      id: 'scene_005',
      type: 'example',
      duration: 5,
      title: 'Docker 명령어',
      narration: 'docker run, docker build, docker push - 핵심 명령어들',
      layout: 'split',
      visualElements: [
        { type: 'code', id: 'commands', content: 'docker run nginx\ndocker build -t app .\ndocker push app:latest' }
      ],
      animations: [
        { type: 'typewriter', target: 'commands', duration: 3, delay: 0 }
      ]
    },
    {
      id: 'scene_006',
      type: 'conclusion',
      duration: 5,
      title: '지금 시작하세요!',
      subtitle: 'Docker로 DevOps 혁신',
      narration: 'Docker를 통해 더 빠르고 안정적인 배포를 경험하세요.',
      layout: 'center',
      visualElements: [
        { type: 'text', id: 'cta', content: 'Get Started with Docker', style: { size: 'large' } },
        { type: 'icon', id: 'arrow', content: '→', style: { size: 'medium', color: '#0db7ed' } }
      ],
      animations: [
        { type: 'fadeIn', target: 'cta', duration: 1, delay: 0 },
        { type: 'slideIn', target: 'arrow', duration: 1, delay: 1 }
      ]
    }
  ]
};

async function generateDockerVideo() {
  console.log('🐳 Docker 입문 비디오 생성 시작');
  
  const videoId = 'docker-intro-' + Date.now();
  const outputDir = path.join(process.cwd(), 'public', 'videos');
  await fs.mkdir(outputDir, { recursive: true });
  
  const renderer = new ProfessionalAnimationRenderer();
  const fps = 30;
  const allFramePaths = [];
  
  console.log('📝 시나리오 정보:');
  console.log(`  - 주제: ${dockerScenario.topic}`);
  console.log(`  - 길이: ${dockerScenario.duration}초`);
  console.log(`  - 씬 개수: ${dockerScenario.scenes.length}개`);
  
  // 각 씬별로 프레임 생성
  let globalFrameIndex = 0;
  
  for (let sceneIndex = 0; sceneIndex < dockerScenario.scenes.length; sceneIndex++) {
    const scene = dockerScenario.scenes[sceneIndex];
    const frameCount = scene.duration * fps;
    
    console.log(`\n🎬 씬 ${sceneIndex + 1}: ${scene.title} (${scene.type})`);
    console.log(`  - 레이아웃: ${scene.layout}`);
    console.log(`  - 프레임 수: ${frameCount}개`);
    
    for (let frameNum = 0; frameNum < frameCount; frameNum++) {
      const frameBuffer = await renderer.renderScene(scene, frameNum, frameCount);
      const framePath = path.join(outputDir, `${videoId}_frame_${globalFrameIndex.toString().padStart(8, '0')}.png`);
      
      await fs.writeFile(framePath, frameBuffer);
      allFramePaths.push(framePath);
      globalFrameIndex++;
      
      // 진행상황 표시 (10프레임마다)
      if (frameNum % 10 === 0) {
        process.stdout.write(`  프레임 ${frameNum}/${frameCount}\r`);
      }
    }
    
    console.log(`  ✅ ${frameCount}개 프레임 생성 완료`);
  }
  
  // FFmpeg으로 비디오 생성
  console.log('\n🎥 비디오 인코딩 시작...');
  const videoPath = path.join(outputDir, `${videoId}.mp4`);
  const ffmpegCmd = `ffmpeg -y -r ${fps} -i "${path.join(outputDir, videoId)}_frame_%08d.png" -c:v libx264 -pix_fmt yuv420p -preset fast "${videoPath}"`;
  
  try {
    await execAsync(ffmpegCmd);
    console.log('✅ 비디오 생성 완료!');
    console.log(`📹 파일 위치: ${videoPath}`);
    
    // 프레임 파일 정리
    console.log('🧹 임시 파일 정리 중...');
    for (const framePath of allFramePaths) {
      await fs.unlink(framePath).catch(() => {});
    }
    
    // 비디오 정보 확인
    const stats = await fs.stat(videoPath);
    console.log(`\n📊 비디오 정보:`);
    console.log(`  - 크기: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - 길이: ${dockerScenario.duration}초`);
    console.log(`  - 해상도: 1920x1080`);
    console.log(`  - FPS: ${fps}`);
    
    // 비디오 재생
    console.log('\n▶️  비디오 재생:');
    console.log(`open ${videoPath}`);
    execAsync(`open ${videoPath}`);
    
  } catch (error) {
    console.error('❌ 비디오 생성 실패:', error);
  }
}

// 실행
generateDockerVideo().catch(console.error);