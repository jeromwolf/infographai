// Canvas 디버그 테스트
const { createCanvas } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

async function debugCanvas() {
  console.log('🔍 Canvas 디버그 테스트');
  
  const width = 400;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  console.log('Canvas 크기:', canvas.width, 'x', canvas.height);
  
  // 배경 - 빨간색으로 확실히
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, width, height);
  console.log('빨간 배경 그림 완료');
  
  // 파란색 사각형
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(50, 50, 100, 100);
  console.log('파란 사각형 그림 완료');
  
  // 버퍼 확인
  const buffer = canvas.toBuffer('image/png');
  console.log('버퍼 크기:', buffer.length, 'bytes');
  console.log('버퍼 처음 20바이트:', buffer.slice(0, 20));
  
  // 프레임 저장
  const outputDir = path.join(process.cwd(), 'public', 'videos');
  await fs.mkdir(outputDir, { recursive: true });
  
  const framePath = path.join(outputDir, 'canvas-debug-test.png');
  await fs.writeFile(framePath, buffer);
  
  console.log('✅ Canvas 디버그 완료:', framePath);
  
  return framePath;
}

debugCanvas().catch(console.error);