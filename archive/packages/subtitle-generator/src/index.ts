/**
 * Subtitle Generator
 * 자막 생성 및 타이밍 조정 시스템
 */

import { KoreanSubtitleProcessor } from '@infographai/korean-subtitle';
import { GPTService, ScriptSection } from '@infographai/gpt-service';
import SRTParser from 'srt-parser-2';
import winston from 'winston';
import fs from 'fs/promises';
import path from 'path';

// 자막 형식
export type SubtitleFormat = 'srt' | 'vtt' | 'ass' | 'json';

// 자막 항목
export interface SubtitleEntry {
  id: number;
  startTime: number; // milliseconds
  endTime: number;   // milliseconds
  text: string;
  style?: SubtitleStyle;
}

// 자막 스타일
export interface SubtitleStyle {
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  position?: 'top' | 'center' | 'bottom';
  animation?: 'fade' | 'slide' | 'typewriter' | 'none';
}

// 타이밍 옵션
export interface TimingOptions {
  wordsPerMinute?: number;  // 읽기 속도
  minDuration?: number;     // 최소 표시 시간 (ms)
  maxDuration?: number;     // 최대 표시 시간 (ms)
  gap?: number;            // 자막 간 간격 (ms)
  overlapAllowed?: boolean; // 자막 겹침 허용
}

// 생성 옵션
export interface GenerationOptions {
  language: 'ko' | 'en';
  style?: SubtitleStyle;
  timing?: TimingOptions;
  maxLineLength?: number;
  maxLines?: number;
}

export class SubtitleGenerator {
  private koreanProcessor: KoreanSubtitleProcessor;
  private gptService: GPTService | null = null;
  private logger: winston.Logger;
  private parser: SRTParser;
  private outputDir: string;

  private defaultTiming: TimingOptions = {
    wordsPerMinute: 150,
    minDuration: 1000,
    maxDuration: 5000,
    gap: 100,
    overlapAllowed: false
  };

  constructor(outputDir: string = './output/subtitles', gptService?: GPTService) {
    this.koreanProcessor = new KoreanSubtitleProcessor();
    this.gptService = gptService || null;
    this.parser = new SRTParser();
    this.outputDir = outputDir;

    // Logger 설정
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'subtitle-generator.log' })
      ]
    });

    // 출력 디렉토리 생성
    this.ensureOutputDir();
  }

  private async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create output directory', { error });
    }
  }

  /**
   * 스크립트 섹션에서 자막 생성
   */
  public async generateFromScript(
    sections: ScriptSection[],
    options: GenerationOptions
  ): Promise<SubtitleEntry[]> {
    const subtitles: SubtitleEntry[] = [];
    let currentTime = 0;
    let subtitleId = 1;

    for (const section of sections) {
      const sectionSubtitles = await this.generateSectionSubtitles(
        section,
        currentTime,
        subtitleId,
        options
      );

      subtitles.push(...sectionSubtitles);
      
      // 다음 섹션 시작 시간 계산
      if (sectionSubtitles.length > 0) {
        const lastSubtitle = sectionSubtitles[sectionSubtitles.length - 1];
        currentTime = lastSubtitle.endTime + (options.timing?.gap || this.defaultTiming.gap!);
        subtitleId = lastSubtitle.id + 1;
      }
    }

    this.logger.info('Subtitles generated from script', {
      sections: sections.length,
      subtitles: subtitles.length
    });

    return subtitles;
  }

  /**
   * 섹션별 자막 생성
   */
  private async generateSectionSubtitles(
    section: ScriptSection,
    startTime: number,
    startId: number,
    options: GenerationOptions
  ): Promise<SubtitleEntry[]> {
    const subtitles: SubtitleEntry[] = [];
    const timing = { ...this.defaultTiming, ...options.timing };

    // 텍스트를 자막 단위로 분할
    const chunks = await this.splitTextIntoChunks(
      section.content,
      options
    );

    // 섹션 전체 시간을 자막들에 분배
    const totalDuration = section.duration * 1000; // seconds to ms
    const chunkDuration = Math.min(
      Math.max(
        totalDuration / chunks.length,
        timing.minDuration!
      ),
      timing.maxDuration!
    );

    let currentTime = startTime;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // 한국어 처리
      const processedText = options.language === 'ko' 
        ? this.koreanProcessor.processSubtitle(chunk)
        : chunk;

      const subtitle: SubtitleEntry = {
        id: startId + i,
        startTime: currentTime,
        endTime: currentTime + chunkDuration - timing.gap!,
        text: processedText,
        style: options.style
      };

      subtitles.push(subtitle);
      currentTime += chunkDuration;
    }

    return subtitles;
  }

  /**
   * 텍스트를 자막 청크로 분할
   */
  private async splitTextIntoChunks(
    text: string,
    options: GenerationOptions
  ): Promise<string[]> {
    const maxLength = options.maxLineLength || 40;

    // GPT 서비스가 있으면 최적화된 분할 사용
    if (this.gptService) {
      try {
        return await this.gptService.optimizeSubtitles(text, maxLength);
      } catch (error) {
        this.logger.warn('GPT subtitle optimization failed, using fallback', { error });
      }
    }

    // Fallback: 간단한 분할
    return this.simpleSplit(text, maxLength);
  }

  /**
   * 간단한 텍스트 분할
   */
  private simpleSplit(text: string, maxLength: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];

    for (const sentence of sentences) {
      if (sentence.length <= maxLength) {
        chunks.push(sentence.trim());
      } else {
        // 긴 문장은 단어 단위로 분할
        const words = sentence.split(' ');
        let current = '';

        for (const word of words) {
          if ((current + ' ' + word).length <= maxLength) {
            current = current ? `${current} ${word}` : word;
          } else {
            if (current) chunks.push(current.trim());
            current = word;
          }
        }
        if (current) chunks.push(current.trim());
      }
    }

    return chunks;
  }

  /**
   * 타이밍 자동 조정
   */
  public adjustTiming(
    subtitles: SubtitleEntry[],
    totalDuration: number
  ): SubtitleEntry[] {
    if (subtitles.length === 0) return subtitles;

    const averageDuration = totalDuration / subtitles.length;
    const adjusted: SubtitleEntry[] = [];

    for (let i = 0; i < subtitles.length; i++) {
      const subtitle = { ...subtitles[i] };
      
      // 읽기 속도 기반 지속 시간 계산
      const readingTime = this.calculateReadingTime(subtitle.text);
      const duration = Math.min(
        Math.max(readingTime, this.defaultTiming.minDuration!),
        averageDuration
      );

      subtitle.startTime = i === 0 ? 0 : adjusted[i - 1].endTime + this.defaultTiming.gap!;
      subtitle.endTime = subtitle.startTime + duration;

      adjusted.push(subtitle);
    }

    // 전체 시간에 맞추기
    const lastSubtitle = adjusted[adjusted.length - 1];
    if (lastSubtitle.endTime > totalDuration) {
      const ratio = totalDuration / lastSubtitle.endTime;
      adjusted.forEach(subtitle => {
        subtitle.startTime *= ratio;
        subtitle.endTime *= ratio;
      });
    }

    return adjusted;
  }

  /**
   * 읽기 시간 계산
   */
  private calculateReadingTime(text: string): number {
    const words = text.split(/\s+/).length;
    const wordsPerSecond = (this.defaultTiming.wordsPerMinute || 150) / 60;
    return (words / wordsPerSecond) * 1000; // ms
  }

  /**
   * SRT 형식으로 내보내기
   */
  public async exportToSRT(
    subtitles: SubtitleEntry[],
    filename: string
  ): Promise<string> {
    const srtContent = subtitles.map((subtitle, index) => {
      const startTime = this.formatSRTTime(subtitle.startTime);
      const endTime = this.formatSRTTime(subtitle.endTime);
      
      return `${index + 1}\n${startTime} --> ${endTime}\n${subtitle.text}\n`;
    }).join('\n');

    const filePath = path.join(this.outputDir, `${filename}.srt`);
    await fs.writeFile(filePath, srtContent, 'utf-8');

    this.logger.info('SRT file exported', { path: filePath, subtitles: subtitles.length });

    return filePath;
  }

  /**
   * WebVTT 형식으로 내보내기
   */
  public async exportToVTT(
    subtitles: SubtitleEntry[],
    filename: string
  ): Promise<string> {
    let vttContent = 'WEBVTT\n\n';

    vttContent += subtitles.map((subtitle, index) => {
      const startTime = this.formatVTTTime(subtitle.startTime);
      const endTime = this.formatVTTTime(subtitle.endTime);
      
      let entry = `${index + 1}\n${startTime} --> ${endTime}`;
      
      // 스타일 추가
      if (subtitle.style?.position) {
        entry += ` position:${subtitle.style.position}`;
      }
      
      entry += `\n${subtitle.text}\n`;
      return entry;
    }).join('\n');

    const filePath = path.join(this.outputDir, `${filename}.vtt`);
    await fs.writeFile(filePath, vttContent, 'utf-8');

    this.logger.info('VTT file exported', { path: filePath, subtitles: subtitles.length });

    return filePath;
  }

  /**
   * ASS/SSA 형식으로 내보내기 (고급 스타일링)
   */
  public async exportToASS(
    subtitles: SubtitleEntry[],
    filename: string
  ): Promise<string> {
    let assContent = this.generateASSHeader();

    // 이벤트 섹션
    assContent += '\n[Events]\n';
    assContent += 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';

    subtitles.forEach(subtitle => {
      const startTime = this.formatASSTime(subtitle.startTime);
      const endTime = this.formatASSTime(subtitle.endTime);
      const style = subtitle.style?.animation === 'fade' ? 'Fade' : 'Default';
      
      assContent += `Dialogue: 0,${startTime},${endTime},${style},,0,0,0,,${subtitle.text}\n`;
    });

    const filePath = path.join(this.outputDir, `${filename}.ass`);
    await fs.writeFile(filePath, assContent, 'utf-8');

    this.logger.info('ASS file exported', { path: filePath, subtitles: subtitles.length });

    return filePath;
  }

  /**
   * ASS 헤더 생성
   */
  private generateASSHeader(): string {
    return `[Script Info]
Title: InfoGraphAI Generated Subtitles
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
Style: Fade,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
`;
  }

  /**
   * JSON 형식으로 내보내기
   */
  public async exportToJSON(
    subtitles: SubtitleEntry[],
    filename: string
  ): Promise<string> {
    const jsonData = {
      version: '1.0',
      generated: new Date().toISOString(),
      generator: 'InfoGraphAI Subtitle Generator',
      subtitles: subtitles.map(subtitle => ({
        ...subtitle,
        startTimeFormatted: this.formatTime(subtitle.startTime),
        endTimeFormatted: this.formatTime(subtitle.endTime)
      }))
    };

    const filePath = path.join(this.outputDir, `${filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');

    this.logger.info('JSON file exported', { path: filePath, subtitles: subtitles.length });

    return filePath;
  }

  /**
   * SRT 시간 포맷
   */
  private formatSRTTime(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  }

  /**
   * VTT 시간 포맷
   */
  private formatVTTTime(ms: number): string {
    return this.formatSRTTime(ms).replace(',', '.');
  }

  /**
   * ASS 시간 포맷
   */
  private formatASSTime(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }

  /**
   * 일반 시간 포맷
   */
  private formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes}:${seconds.padStart(4, '0')}`;
  }

  /**
   * 자막 애니메이션 생성 (CSS/JSON)
   */
  public generateAnimations(
    subtitles: SubtitleEntry[]
  ): Record<string, any> {
    const animations: Record<string, any> = {};

    subtitles.forEach(subtitle => {
      const animType = subtitle.style?.animation || 'fade';
      const key = `subtitle-${subtitle.id}`;

      switch (animType) {
        case 'fade':
          animations[key] = {
            keyframes: [
              { opacity: 0, offset: 0 },
              { opacity: 1, offset: 0.2 },
              { opacity: 1, offset: 0.8 },
              { opacity: 0, offset: 1 }
            ],
            duration: subtitle.endTime - subtitle.startTime,
            delay: subtitle.startTime
          };
          break;

        case 'slide':
          animations[key] = {
            keyframes: [
              { transform: 'translateY(50px)', opacity: 0, offset: 0 },
              { transform: 'translateY(0)', opacity: 1, offset: 0.2 },
              { transform: 'translateY(0)', opacity: 1, offset: 0.8 },
              { transform: 'translateY(-50px)', opacity: 0, offset: 1 }
            ],
            duration: subtitle.endTime - subtitle.startTime,
            delay: subtitle.startTime
          };
          break;

        case 'typewriter':
          animations[key] = {
            keyframes: [
              { width: '0%', offset: 0 },
              { width: '100%', offset: 0.5 },
              { width: '100%', offset: 1 }
            ],
            duration: subtitle.endTime - subtitle.startTime,
            delay: subtitle.startTime
          };
          break;
      }
    });

    return animations;
  }

  /**
   * 자막 검증
   */
  public validateSubtitles(subtitles: SubtitleEntry[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    for (let i = 0; i < subtitles.length; i++) {
      const subtitle = subtitles[i];

      // 시간 검증
      if (subtitle.startTime >= subtitle.endTime) {
        errors.push(`Subtitle ${subtitle.id}: Start time must be before end time`);
      }

      // 겹침 검증
      if (i > 0 && !this.defaultTiming.overlapAllowed) {
        const prevSubtitle = subtitles[i - 1];
        if (subtitle.startTime < prevSubtitle.endTime) {
          errors.push(`Subtitle ${subtitle.id}: Overlaps with previous subtitle`);
        }
      }

      // 텍스트 검증
      if (!subtitle.text || subtitle.text.trim().length === 0) {
        errors.push(`Subtitle ${subtitle.id}: Empty text`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default SubtitleGenerator;