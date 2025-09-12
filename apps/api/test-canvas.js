// Canvas 테스트 스크립트
const { createCanvas } = require('canvas');
const fs = require('fs');

console.log('Canvas 테스트 시작...');

try {
  // 캔버스 생성
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  console.log('Canvas 생성 성공:', canvas.width, 'x', canvas.height);
  
  // 배경 그리기
  ctx.fillStyle = '#667eea';
  ctx.fillRect(0, 0, 800, 600);
  
  // 텍스트 그리기
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Canvas 테스트', 400, 200);
  
  // 원 그리기
  ctx.fillStyle = '#f093fb';
  ctx.beginPath();
  ctx.arc(400, 350, 50, 0, Math.PI * 2);
  ctx.fill();
  
  // PNG로 저장
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./test-canvas.png', buffer);
  
  console.log('✅ Canvas 테스트 성공! test-canvas.png 파일이 생성되었습니다.');
  
} catch (error) {
  console.error('❌ Canvas 테스트 실패:', error.message);
}