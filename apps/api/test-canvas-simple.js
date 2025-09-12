// Canvas 간단 테스트 - 폰트 없이
const { createCanvas } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

async function testCanvasSimple() {
  console.log('🎨 Canvas 간단 테스트 (도형만)');
  
  const width = 1920;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // 배경 - 파란색
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(0, 0, width, height);
  
  // 흰색 사각형
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(width/2 - 200, height/2 - 100, 400, 200);
  
  // 빨간색 원
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(width/2, height/2, 50, 0, Math.PI * 2);
  ctx.fill();
  
  // 초록색 선
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(width/2 - 150, height/2 - 150);
  ctx.lineTo(width/2 + 150, height/2 + 150);
  ctx.stroke();
  
  // 프레임 저장
  const outputDir = path.join(process.cwd(), 'public', 'videos');
  await fs.mkdir(outputDir, { recursive: true });
  
  const framePath = path.join(outputDir, 'canvas-simple-test.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(framePath, buffer);
  
  console.log('✅ Canvas 간단 테스트 완료:', framePath);
  
  return framePath;
}

testCanvasSimple().catch(console.error);