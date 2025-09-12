// Canvas 직접 렌더링 테스트
const { createCanvas } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

async function testCanvasDirectly() {
  console.log('🎨 Canvas 직접 렌더링 테스트');
  
  const width = 1920;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // 배경 그리기
  ctx.fillStyle = '#2d3748';
  ctx.fillRect(0, 0, width, height);
  
  // 제목 그리기
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('RAG 테스트', width / 2, height / 2 - 100);
  
  // 씬 타입 그리기
  ctx.fillStyle = '#a0aec0';
  ctx.font = '32px Arial';
  ctx.fillText('Scene Type: intro', width / 2, height / 2 - 40);
  
  // 프로그레스 그리기
  ctx.fillStyle = '#4fd1c7';
  ctx.font = '28px Arial';
  ctx.fillText('Frame: 1 | Progress: 50%', width / 2, height / 2 + 20);
  
  // 설명 그리기
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '24px Arial';
  ctx.fillText('RAG는 Retrieval-Augmented Generation의 줄임말입니다.', width / 2, height / 2 + 80);
  
  // 애니메이션 요소 - 원
  ctx.strokeStyle = '#4fd1c7';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width / 2 + 200, height / 2 + 150, 30, 0, Math.PI * 2);
  ctx.stroke();
  
  // 프레임 저장
  const outputDir = path.join(process.cwd(), 'public', 'videos');
  await fs.mkdir(outputDir, { recursive: true });
  
  const framePath = path.join(outputDir, 'canvas-test-frame.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(framePath, buffer);
  
  console.log('✅ Canvas 테스트 프레임 생성:', framePath);
  
  return framePath;
}

testCanvasDirectly().catch(console.error);