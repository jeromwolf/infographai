export declare class RemotionVideoGenerator {
    private outputDir;
    constructor();
    /**
     * Remotion을 사용하여 비디오 생성
     */
    generate(videoId: string, projectId: string, scenarioId?: string): Promise<void>;
    /**
     * 시나리오 데이터 조회
     */
    private getScenarioData;
    /**
     * 시나리오 데이터를 Remotion Props로 변환
     */
    private convertToRemotionProps;
    /**
     * 기본 배경색 생성
     */
    private getDefaultBackgroundColor;
    /**
     * 기본 강조색 생성
     */
    private getDefaultAccentColor;
    /**
     * Remotion으로 비디오 렌더링
     * 현재는 모의 구현 - 실제 Remotion 패키지 설치 후 활성화
     */
    private renderWithRemotion;
    /**
     * 비디오 생성 완료 처리
     */
    private finalizeVideo;
    /**
     * 비디오 상태 업데이트
     */
    private updateVideoStatus;
}
/**
 * 비디오 생성 시작 함수 (기존 API와의 호환성 유지)
 */
export declare function startRemotionVideoGeneration(videoId: string, projectId: string, scenarioId?: string): Promise<void>;
//# sourceMappingURL=remotion-video-generator.d.ts.map