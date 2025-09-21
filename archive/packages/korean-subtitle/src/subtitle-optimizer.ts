/**
 * 자막 최적화 엔진
 * 가독성과 타이밍 최적화
 */

export interface SubtitleSegment {
  text: string;
  startTime: number;  // seconds
  endTime: number;    // seconds
  keywords?: string[];
  emphasis?: boolean;
}

export interface OptimizationConfig {
  maxCharsPerLine: number;
  maxLines: number;
  minDuration: number;
  maxDuration: number;
  readingSpeed: number;  // chars per minute
}

export class SubtitleOptimizer {
  private config: OptimizationConfig;

  constructor(config?: Partial<OptimizationConfig>) {
    this.config = {
      maxCharsPerLine: 35,
      maxLines: 2,
      minDuration: 1.5,
      maxDuration: 4.0,
      readingSpeed: 300, // 분당 글자 수
      ...config
    };
  }

  /**
   * 긴 텍스트를 자막 세그먼트로 분할
   */
  public splitIntoSegments(text: string, totalDuration: number): SubtitleSegment[] {
    const sentences = this.splitSentences(text);
    const segments: SubtitleSegment[] = [];
    
    let currentTime = 0;
    
    for (const sentence of sentences) {
      const lines = this.splitIntoLines(sentence);
      
      for (const line of lines) {
        const duration = this.calculateDuration(line);
        
        segments.push({
          text: line,
          startTime: currentTime,
          endTime: currentTime + duration,
          keywords: this.extractKeywords(line)
        });
        
        currentTime += duration;
      }
    }

    // 전체 시간에 맞춰 조정
    if (currentTime > 0) {
      const scaleFactor = totalDuration / currentTime;
      segments.forEach(seg => {
        seg.startTime *= scaleFactor;
        seg.endTime *= scaleFactor;
      });
    }

    return segments;
  }

  /**
   * 문장 분리
   */
  private splitSentences(text: string): string[] {
    // 한국어 문장 종결 패턴
    const sentences = text.split(/(?<=[.!?。])\s+/);
    
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
  }

  /**
   * 한 줄 길이에 맞춰 텍스트 분할
   */
  private splitIntoLines(text: string): string[] {
    const lines: string[] = [];
    const words = text.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (testLine.length <= this.config.maxCharsPerLine) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // 단어 자체가 너무 긴 경우 강제 분할
          lines.push(word.substring(0, this.config.maxCharsPerLine));
          currentLine = word.substring(this.config.maxCharsPerLine);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    // maxLines 제한 적용
    if (lines.length > this.config.maxLines) {
      return this.mergeLines(lines, this.config.maxLines);
    }

    return lines;
  }

  /**
   * 여러 줄을 지정된 수로 병합
   */
  private mergeLines(lines: string[], maxLines: number): string[] {
    if (lines.length <= maxLines) return lines;

    const merged: string[] = [];
    const linesPerGroup = Math.ceil(lines.length / maxLines);

    for (let i = 0; i < lines.length; i += linesPerGroup) {
      const group = lines.slice(i, i + linesPerGroup);
      merged.push(group.join(' '));
    }

    return merged;
  }

  /**
   * 자막 표시 시간 계산
   */
  private calculateDuration(text: string): number {
    const charCount = text.length;
    const readingTime = (charCount / this.config.readingSpeed) * 60; // seconds
    
    return Math.max(
      this.config.minDuration,
      Math.min(this.config.maxDuration, readingTime)
    );
  }

  /**
   * 중요 키워드 추출
   */
  private extractKeywords(text: string): string[] {
    // IT 관련 키워드 패턴
    const patterns = [
      /[A-Z][a-zA-Z]+/g,           // 대문자로 시작하는 영단어 (React, Docker)
      /[A-Z]+/g,                    // 대문자 약어 (API, SQL)
      /\b(함수|클래스|메서드|변수|객체|배열)\b/g,
      /\b(서버|클라이언트|데이터베이스|API)\b/g,
    ];

    const keywords = new Set<string>();

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => keywords.add(match));
      }
    });

    return Array.from(keywords);
  }

  /**
   * 자막 타이밍 검증
   */
  public validateTiming(segments: SubtitleSegment[]): boolean {
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      // 기본 검증
      if (segment.startTime >= segment.endTime) {
        console.warn(`Invalid timing at segment ${i}: start >= end`);
        return false;
      }
      
      // 최소/최대 지속 시간 검증
      const duration = segment.endTime - segment.startTime;
      if (duration < this.config.minDuration || duration > this.config.maxDuration) {
        console.warn(`Duration out of range at segment ${i}: ${duration}s`);
      }
      
      // 겹침 검증
      if (i > 0 && segments[i - 1].endTime > segment.startTime) {
        console.warn(`Overlapping segments at ${i - 1} and ${i}`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * 자연스러운 끊김 위치 찾기
   */
  public findNaturalBreaks(text: string): number[] {
    const breaks: number[] = [];
    
    // 조사 위치 (조사 앞에서 끊지 않음)
    const particlePattern = /\s+(은|는|이|가|을|를|의|에|에서|에게|한테|와|과|도|만|부터|까지)\b/g;
    
    // 자연스러운 끊김 포인트
    const breakPoints = [
      /[,，]/g,           // 쉼표
      /\s+(그리고|또한|하지만|그러나|따라서|즉)\s+/g,  // 접속사
      /\s+/g,            // 공백 (마지막 우선순위)
    ];

    // 조사 위치 마킹 (끊으면 안 되는 곳)
    const noBreakZones: Array<[number, number]> = [];
    let match;
    
    while ((match = particlePattern.exec(text)) !== null) {
      noBreakZones.push([match.index, match.index + match[0].length]);
    }

    // 끊김 포인트 찾기
    breakPoints.forEach(pattern => {
      pattern.lastIndex = 0;
      while ((match = pattern.exec(text)) !== null) {
        // 조사 앞이 아닌지 확인
        const pos = match.index;
        const isInNoBreakZone = noBreakZones.some(
          ([start, end]) => pos >= start && pos < end
        );
        
        if (!isInNoBreakZone) {
          breaks.push(pos);
        }
      }
    });

    // 중복 제거 및 정렬
    return [...new Set(breaks)].sort((a, b) => a - b);
  }
}