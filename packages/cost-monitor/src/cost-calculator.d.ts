/**
 * 비용 계산기 - 각 서비스별 정확한 비용 계산
 */
declare const AWS_PRICING: {
    s3: {
        storage: number;
        request: number;
        bandwidth: number;
    };
    ec2: {
        't3.micro': number;
        't3.small': number;
        't3.medium': number;
        'g4dn.xlarge': number;
    };
};
export declare class CostCalculator {
    /**
     * GPT API 비용 계산
     */
    static calculateGPTCost(model: 'gpt-4' | 'gpt-3.5-turbo', inputTokens: number, outputTokens: number): number;
    /**
     * 스토리지 비용 계산
     */
    static calculateStorageCost(sizeInBytes: number, requests?: number, bandwidthBytes?: number): number;
    /**
     * 컴퓨팅 비용 계산
     */
    static calculateComputeCost(instanceType: keyof typeof AWS_PRICING.ec2, hours: number): number;
    /**
     * 영상 1개 생성 예상 비용
     */
    static estimateVideoCost(duration: number, // seconds
    quality: '720p' | '1080p' | '4k'): number;
    /**
     * 월간 예상 비용 계산
     */
    static estimateMonthlyCost(dailyVideos: number, averageDuration: number, quality?: '720p' | '1080p' | '4k'): number;
    /**
     * 비용 최적화 제안
     */
    static getCostOptimizationSuggestions(currentUsage: any): string[];
}
export {};
//# sourceMappingURL=cost-calculator.d.ts.map