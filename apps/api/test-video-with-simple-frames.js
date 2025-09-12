// 간단한 프레임으로 비디오 생성 테스트
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function createSimpleFrames() {
  console.log('🎬 간단한 프레임으로 비디오 생성 테스트');
  
  const outputDir = path.join(process.cwd(), 'public', 'videos');
  await fs.mkdir(outputDir, { recursive: true });
  
  const videoId = 'simple-test-' + Date.now();
  const framePaths = [];
  
  // 30프레임 생성 (1초, 30fps)
  for (let i = 0; i < 30; i++) {
    const framePath = path.join(outputDir, `${videoId}_frame_${i.toString().padStart(8, '0')}.png`);
    
    // ImageMagick을 사용해서 간단한 프레임 생성
    const color = `hsl(${(i * 12) % 360}, 70%, 50%)`; // 색상이 변하는 애니메이션
    
    try {
      await execAsync(`convert -size 1920x1080 "xc:${color}" -gravity center -pointsize 72 -fill white -annotate +0+0 "Frame ${i + 1}" "${framePath}"`);
      framePaths.push(framePath);
      console.log(`✅ 프레임 ${i + 1}/30 생성 완료`);
    } catch (error) {
      console.error(`❌ 프레임 ${i + 1} 생성 실패:`, error.message);
      break;
    }
  }
  
  if (framePaths.length === 0) {
    console.log('⚠️  ImageMagick이 없습니다. 단색 PNG 파일을 생성합니다...');
    
    // ImageMagick이 없으면 단순한 방법 사용
    for (let i = 0; i < 30; i++) {
      const framePath = path.join(outputDir, `${videoId}_frame_${i.toString().padStart(8, '0')}.png`);
      
      // 1x1 픽셀 PNG 생성 (임시)
      const pngData = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, // width: 1
        0x00, 0x00, 0x00, 0x01, // height: 1
        0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, etc.
        0x1F, 0x15, 0xC4, 0x89, // CRC
        0x00, 0x00, 0x00, 0x0A, // IDAT chunk length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, // compressed data
        0x0D, 0x0A, 0x2D, 0xB4, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND chunk length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
      ]);
      
      await fs.writeFile(framePath, pngData);
      framePaths.push(framePath);
    }
    console.log('✅ 30개의 단순 프레임 생성 완료');
  }
  
  // FFmpeg으로 비디오 생성
  console.log('🎥 FFmpeg으로 비디오 생성 시작...');
  const videoPath = path.join(outputDir, `${videoId}.mp4`);
  const ffmpegCmd = `ffmpeg -y -r 30 -i "${path.join(outputDir, videoId)}_frame_%08d.png" -c:v libx264 -pix_fmt yuv420p "${videoPath}"`;
  
  try {
    const { stdout, stderr } = await execAsync(ffmpegCmd);
    console.log('FFmpeg stdout:', stdout);
    console.log('FFmpeg stderr:', stderr);
    console.log('✅ 비디오 생성 완료:', videoPath);
    return videoPath;
  } catch (error) {
    console.error('❌ FFmpeg 비디오 생성 실패:', error);
    throw error;
  }
}

createSimpleFrames().catch(console.error);