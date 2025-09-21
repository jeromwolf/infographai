import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import sharp from 'sharp';

const execAsync = promisify(exec);
const router = Router();

// FFmpeg를 사용한 MP4 비디오 생성
router.post('/generate-mp4', async (req, res) => {
  try {
    const { frames, fps = 30, duration = 3 } = req.body;

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return res.status(400).json({ error: 'No frames provided' });
    }

    // 임시 디렉토리 생성
    const tempDir = path.join(process.cwd(), 'temp', `video-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    console.log(`Processing ${frames.length} frames for video generation`);

    try {
      // 각 프레임을 이미지 파일로 저장
      for (let i = 0; i < frames.length; i++) {
        const frameData = frames[i];
        const framePath = path.join(tempDir, `frame_${String(i).padStart(4, '0')}.png`);

        // Base64 데이터를 버퍼로 변환
        const base64Data = frameData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Sharp로 이미지 최적화 및 저장
        await sharp(buffer)
          .png({ quality: 95 })
          .toFile(framePath);
      }

      // 출력 파일 경로
      const outputFileName = `scene-${Date.now()}.mp4`;
      const outputPath = path.join(process.cwd(), 'public', 'videos', outputFileName);

      // public/videos 디렉토리 생성
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      // FFmpeg 명령어 구성
      const ffmpegCommand = [
        'ffmpeg',
        '-framerate', String(fps),
        '-i', path.join(tempDir, 'frame_%04d.png'),
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-y',
        outputPath
      ].join(' ');

      console.log('Executing FFmpeg command:', ffmpegCommand);

      // FFmpeg 실행
      const { stdout, stderr } = await execAsync(ffmpegCommand);

      console.log('FFmpeg stdout:', stdout);
      if (stderr) console.log('FFmpeg stderr:', stderr);

      // 파일 크기 확인
      const stats = await fs.stat(outputPath);
      console.log(`Video created: ${outputFileName} (${stats.size} bytes)`);

      // 임시 파일 정리
      const tempFiles = await fs.readdir(tempDir);
      for (const file of tempFiles) {
        await fs.unlink(path.join(tempDir, file));
      }
      await fs.rmdir(tempDir);

      // 응답
      res.json({
        success: true,
        filename: outputFileName,
        url: `/videos/${outputFileName}`,
        size: stats.size,
        frames: frames.length,
        fps,
        duration
      });

    } catch (error) {
      console.error('Video generation error:', error);

      // 에러 발생 시 임시 파일 정리
      try {
        const tempFiles = await fs.readdir(tempDir).catch(() => []);
        for (const file of tempFiles) {
          await fs.unlink(path.join(tempDir, file)).catch(() => {});
        }
        await fs.rmdir(tempDir).catch(() => {});
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      throw error;
    }

  } catch (error: any) {
    console.error('Video generation failed:', error);
    res.status(500).json({
      error: 'Video generation failed',
      message: error.message
    });
  }
});

// FFmpeg 설치 확인
router.get('/check-ffmpeg', async (req, res) => {
  try {
    const { stdout } = await execAsync('ffmpeg -version');
    const version = stdout.split('\n')[0];
    res.json({
      available: true,
      version
    });
  } catch (error) {
    res.json({
      available: false,
      error: 'FFmpeg not installed'
    });
  }
});

export default router;