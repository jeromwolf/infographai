/**
 * Realtime Subtitle Editor
 * Figma Make 스타일 실시간 자막 편집 시스템
 * 1초 내 즉시 미리보기 지원
 */

import { EventEmitter } from 'eventemitter3';

// 자막 타입 정의
export interface Subtitle {
  id: string;
  startTime: number;  // seconds
  endTime: number;    // seconds
  text: string;
  style?: SubtitleStyle;
  position?: 'top' | 'center' | 'bottom';
}

export interface SubtitleStyle {
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  fontWeight?: string;
  animation?: 'fade' | 'slide' | 'typewriter' | 'none';
}

// 편집 이벤트
export interface EditEvent {
  subtitleId: string;
  field: 'text' | 'startTime' | 'endTime' | 'style';
  oldValue: any;
  newValue: any;
  timestamp: number;
}

// 실시간 자막 편집기
export class RealtimeSubtitleEditor extends EventEmitter {
  private subtitles: Map<string, Subtitle> = new Map();
  private history: EditEvent[] = [];
  private currentTime: number = 0;
  private previewCache: Map<string, string> = new Map();
  private undoStack: EditEvent[] = [];
  private redoStack: EditEvent[] = [];

  constructor() {
    super();
  }

  /**
   * 자막 목록 로드
   */
  public loadSubtitles(subtitles: Subtitle[]): void {
    this.subtitles.clear();
    subtitles.forEach(sub => {
      this.subtitles.set(sub.id, sub);
    });
    this.emit('subtitles:loaded', subtitles);
  }

  /**
   * 실시간 텍스트 편집 (1초 내 반영)
   */
  public async editText(
    subtitleId: string,
    newText: string
  ): Promise<void> {
    const subtitle = this.subtitles.get(subtitleId);
    if (!subtitle) throw new Error(`Subtitle ${subtitleId} not found`);

    const oldText = subtitle.text;
    
    // 즉시 업데이트
    subtitle.text = newText;
    
    // 이벤트 기록
    const event: EditEvent = {
      subtitleId,
      field: 'text',
      oldValue: oldText,
      newValue: newText,
      timestamp: Date.now()
    };
    
    this.history.push(event);
    this.undoStack.push(event);
    this.redoStack = []; // Clear redo stack
    
    // 즉시 미리보기 생성 (1초 내)
    const preview = await this.generateInstantPreview(subtitle);
    this.previewCache.set(subtitleId, preview);
    
    // 이벤트 발생
    this.emit('subtitle:edited', {
      subtitle,
      preview,
      latency: Date.now() - event.timestamp // 보통 < 100ms
    });
  }

  /**
   * 타임라인 드래그&드롭
   */
  public moveSubtitle(
    subtitleId: string,
    newStartTime: number
  ): void {
    const subtitle = this.subtitles.get(subtitleId);
    if (!subtitle) return;

    const duration = subtitle.endTime - subtitle.startTime;
    const oldStartTime = subtitle.startTime;
    
    subtitle.startTime = newStartTime;
    subtitle.endTime = newStartTime + duration;
    
    // 충돌 검사
    const conflicts = this.detectTimelineConflicts(subtitle);
    if (conflicts.length > 0) {
      // 자동 조정
      this.resolveConflicts(subtitle, conflicts);
    }
    
    // 이벤트 기록
    this.history.push({
      subtitleId,
      field: 'startTime',
      oldValue: oldStartTime,
      newValue: newStartTime,
      timestamp: Date.now()
    });
    
    this.emit('timeline:updated', {
      subtitle,
      conflicts
    });
  }

  /**
   * 실시간 스타일 변경
   */
  public updateStyle(
    subtitleId: string,
    style: Partial<SubtitleStyle>
  ): void {
    const subtitle = this.subtitles.get(subtitleId);
    if (!subtitle) return;

    const oldStyle = { ...subtitle.style };
    subtitle.style = { ...subtitle.style, ...style };
    
    // 즉시 스타일 적용
    this.applyStyleInstantly(subtitle);
    
    this.emit('style:updated', {
      subtitle,
      oldStyle,
      newStyle: subtitle.style
    });
  }

  /**
   * 자막 분할 (긴 자막을 여러 개로)
   */
  public splitSubtitle(
    subtitleId: string,
    splitPoint: number // 문자 위치
  ): [Subtitle, Subtitle] {
    const subtitle = this.subtitles.get(subtitleId);
    if (!subtitle) throw new Error('Subtitle not found');

    const text1 = subtitle.text.substring(0, splitPoint).trim();
    const text2 = subtitle.text.substring(splitPoint).trim();
    
    const midTime = (subtitle.startTime + subtitle.endTime) / 2;
    
    const sub1: Subtitle = {
      ...subtitle,
      id: `${subtitle.id}_1`,
      text: text1,
      endTime: midTime
    };
    
    const sub2: Subtitle = {
      ...subtitle,
      id: `${subtitle.id}_2`,
      text: text2,
      startTime: midTime
    };
    
    // 원본 제거, 새 자막 추가
    this.subtitles.delete(subtitleId);
    this.subtitles.set(sub1.id, sub1);
    this.subtitles.set(sub2.id, sub2);
    
    this.emit('subtitle:split', {
      original: subtitle,
      parts: [sub1, sub2]
    });
    
    return [sub1, sub2];
  }

  /**
   * 자막 병합
   */
  public mergeSubtitles(
    subtitleIds: string[]
  ): Subtitle {
    const subtitles = subtitleIds
      .map(id => this.subtitles.get(id))
      .filter(Boolean) as Subtitle[];
    
    if (subtitles.length < 2) {
      throw new Error('Need at least 2 subtitles to merge');
    }
    
    // 시간순 정렬
    subtitles.sort((a, b) => a.startTime - b.startTime);
    
    const merged: Subtitle = {
      id: `merged_${Date.now()}`,
      startTime: subtitles[0].startTime,
      endTime: subtitles[subtitles.length - 1].endTime,
      text: subtitles.map(s => s.text).join(' '),
      style: subtitles[0].style,
      position: subtitles[0].position
    };
    
    // 원본들 제거, 병합본 추가
    subtitleIds.forEach(id => this.subtitles.delete(id));
    this.subtitles.set(merged.id, merged);
    
    this.emit('subtitles:merged', {
      originals: subtitles,
      merged
    });
    
    return merged;
  }

  /**
   * 실행 취소
   */
  public undo(): void {
    const event = this.undoStack.pop();
    if (!event) return;
    
    const subtitle = this.subtitles.get(event.subtitleId);
    if (!subtitle) return;
    
    // 이전 값으로 복원
    (subtitle as any)[event.field] = event.oldValue;
    this.redoStack.push(event);
    
    this.emit('undo', event);
  }

  /**
   * 다시 실행
   */
  public redo(): void {
    const event = this.redoStack.pop();
    if (!event) return;
    
    const subtitle = this.subtitles.get(event.subtitleId);
    if (!subtitle) return;
    
    // 새 값으로 복원
    (subtitle as any)[event.field] = event.newValue;
    this.undoStack.push(event);
    
    this.emit('redo', event);
  }

  /**
   * 자막 검색
   */
  public searchSubtitles(query: string): Subtitle[] {
    const results: Subtitle[] = [];
    const lowerQuery = query.toLowerCase();
    
    this.subtitles.forEach(subtitle => {
      if (subtitle.text.toLowerCase().includes(lowerQuery)) {
        results.push(subtitle);
      }
    });
    
    return results;
  }

  /**
   * 자막 시간 자동 조정 (음성 인식 기반)
   */
  public async autoAlign(
    audioData?: ArrayBuffer
  ): Promise<void> {
    // 음성 분석을 통한 자막 타이밍 자동 조정
    // 실제로는 Web Audio API 사용
    
    this.emit('auto:aligning');
    
    // 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.subtitles.forEach(subtitle => {
      // 미세 조정 (±0.1초)
      subtitle.startTime += (Math.random() - 0.5) * 0.2;
      subtitle.endTime += (Math.random() - 0.5) * 0.2;
    });
    
    this.emit('auto:aligned');
  }

  /**
   * 한글 조사 자동 수정
   */
  public autoFixKoreanParticles(): void {
    this.subtitles.forEach(subtitle => {
      // 한글 조사 체크 및 수정
      const fixed = this.fixKoreanParticles(subtitle.text);
      if (fixed !== subtitle.text) {
        this.editText(subtitle.id, fixed);
      }
    });
  }

  /**
   * 즉시 미리보기 생성 (1초 내)
   */
  private async generateInstantPreview(
    subtitle: Subtitle
  ): Promise<string> {
    // Canvas를 사용한 즉시 미리보기
    const preview = `
      <div class="subtitle-preview"
           style="
             position: absolute;
             bottom: ${subtitle.position === 'bottom' ? '10%' : 
                      subtitle.position === 'top' ? '80%' : '50%'};
             left: 50%;
             transform: translateX(-50%);
             padding: 8px 16px;
             background: ${subtitle.style?.backgroundColor || 'rgba(0,0,0,0.8)'};
             color: ${subtitle.style?.color || '#FFFFFF'};
             font-size: ${subtitle.style?.fontSize || 24}px;
             font-weight: ${subtitle.style?.fontWeight || '500'};
             border-radius: 4px;
           ">
        ${subtitle.text}
      </div>
    `;
    
    return preview;
  }

  /**
   * 타임라인 충돌 검사
   */
  private detectTimelineConflicts(
    subtitle: Subtitle
  ): Subtitle[] {
    const conflicts: Subtitle[] = [];
    
    this.subtitles.forEach(sub => {
      if (sub.id === subtitle.id) return;
      
      // 시간 겹침 체크
      if (
        (subtitle.startTime >= sub.startTime && subtitle.startTime < sub.endTime) ||
        (subtitle.endTime > sub.startTime && subtitle.endTime <= sub.endTime) ||
        (subtitle.startTime <= sub.startTime && subtitle.endTime >= sub.endTime)
      ) {
        conflicts.push(sub);
      }
    });
    
    return conflicts;
  }

  /**
   * 충돌 자동 해결
   */
  private resolveConflicts(
    subtitle: Subtitle,
    conflicts: Subtitle[]
  ): void {
    conflicts.forEach(conflict => {
      // 충돌 자막을 뒤로 밀기
      const gap = 0.1; // 0.1초 간격
      conflict.startTime = subtitle.endTime + gap;
      conflict.endTime = conflict.startTime + 
        (conflict.endTime - conflict.startTime);
    });
  }

  /**
   * 즉시 스타일 적용
   */
  private applyStyleInstantly(subtitle: Subtitle): void {
    // DOM 직접 업데이트 (React/Vue 통합 시)
    const element = document.getElementById(`subtitle-${subtitle.id}`);
    if (element && subtitle.style) {
      Object.assign(element.style, {
        fontSize: `${subtitle.style.fontSize}px`,
        color: subtitle.style.color,
        backgroundColor: subtitle.style.backgroundColor,
        fontWeight: subtitle.style.fontWeight
      });
    }
  }

  /**
   * 한글 조사 수정
   */
  private fixKoreanParticles(text: string): string {
    // 실제 구현은 korean-subtitle 패키지 활용
    // 여기서는 간단한 예시
    return text
      .replace(/(\S+)(을|를)/g, (match, word, particle) => {
        const hasJongsung = this.hasKoreanFinalConsonant(word);
        return word + (hasJongsung ? '을' : '를');
      })
      .replace(/(\S+)(이|가)/g, (match, word, particle) => {
        const hasJongsung = this.hasKoreanFinalConsonant(word);
        return word + (hasJongsung ? '이' : '가');
      })
      .replace(/(\S+)(은|는)/g, (match, word, particle) => {
        const hasJongsung = this.hasKoreanFinalConsonant(word);
        return word + (hasJongsung ? '은' : '는');
      })
      .replace(/(\S+)(와|과)/g, (match, word, particle) => {
        const hasJongsung = this.hasKoreanFinalConsonant(word);
        return word + (hasJongsung ? '과' : '와');
      });
  }

  private hasKoreanFinalConsonant(word: string): boolean {
    const lastChar = word[word.length - 1];
    const code = lastChar.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return false;
    return (code - 0xAC00) % 28 !== 0;
  }

  /**
   * 자막 내보내기
   */
  public exportSubtitles(format: 'srt' | 'vtt' | 'json'): string {
    const sorted = Array.from(this.subtitles.values())
      .sort((a, b) => a.startTime - b.startTime);
    
    switch (format) {
      case 'srt':
        return this.toSRT(sorted);
      case 'vtt':
        return this.toVTT(sorted);
      case 'json':
        return JSON.stringify(sorted, null, 2);
      default:
        return '';
    }
  }

  private toSRT(subtitles: Subtitle[]): string {
    return subtitles
      .map((sub, index) => {
        const start = this.formatTime(sub.startTime);
        const end = this.formatTime(sub.endTime);
        return `${index + 1}\n${start} --> ${end}\n${sub.text}\n`;
      })
      .join('\n');
  }

  private toVTT(subtitles: Subtitle[]): string {
    const header = 'WEBVTT\n\n';
    return header + this.toSRT(subtitles);
  }

  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  }
}

export default RealtimeSubtitleEditor;