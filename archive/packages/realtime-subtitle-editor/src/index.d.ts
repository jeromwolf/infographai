/**
 * Realtime Subtitle Editor
 * Figma Make 스타일 실시간 자막 편집 시스템
 * 1초 내 즉시 미리보기 지원
 */
import { EventEmitter } from 'eventemitter3';
export interface Subtitle {
    id: string;
    startTime: number;
    endTime: number;
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
export interface EditEvent {
    subtitleId: string;
    field: 'text' | 'startTime' | 'endTime' | 'style';
    oldValue: any;
    newValue: any;
    timestamp: number;
}
export declare class RealtimeSubtitleEditor extends EventEmitter {
    private subtitles;
    private history;
    private currentTime;
    private previewCache;
    private undoStack;
    private redoStack;
    constructor();
    /**
     * 자막 목록 로드
     */
    loadSubtitles(subtitles: Subtitle[]): void;
    /**
     * 실시간 텍스트 편집 (1초 내 반영)
     */
    editText(subtitleId: string, newText: string): Promise<void>;
    /**
     * 타임라인 드래그&드롭
     */
    moveSubtitle(subtitleId: string, newStartTime: number): void;
    /**
     * 실시간 스타일 변경
     */
    updateStyle(subtitleId: string, style: Partial<SubtitleStyle>): void;
    /**
     * 자막 분할 (긴 자막을 여러 개로)
     */
    splitSubtitle(subtitleId: string, splitPoint: number): [Subtitle, Subtitle];
    /**
     * 자막 병합
     */
    mergeSubtitles(subtitleIds: string[]): Subtitle;
    /**
     * 실행 취소
     */
    undo(): void;
    /**
     * 다시 실행
     */
    redo(): void;
    /**
     * 자막 검색
     */
    searchSubtitles(query: string): Subtitle[];
    /**
     * 자막 시간 자동 조정 (음성 인식 기반)
     */
    autoAlign(audioData?: ArrayBuffer): Promise<void>;
    /**
     * 한글 조사 자동 수정
     */
    autoFixKoreanParticles(): void;
    /**
     * 즉시 미리보기 생성 (1초 내)
     */
    private generateInstantPreview;
    /**
     * 타임라인 충돌 검사
     */
    private detectTimelineConflicts;
    /**
     * 충돌 자동 해결
     */
    private resolveConflicts;
    /**
     * 즉시 스타일 적용
     */
    private applyStyleInstantly;
    /**
     * 한글 조사 수정
     */
    private fixKoreanParticles;
    private hasKoreanFinalConsonant;
    /**
     * 자막 내보내기
     */
    exportSubtitles(format: 'srt' | 'vtt' | 'json'): string;
    private toSRT;
    private toVTT;
    private formatTime;
}
export default RealtimeSubtitleEditor;
//# sourceMappingURL=index.d.ts.map