/**
 * Template Performance Optimizer
 * Phase 3: 성능 최적화 및 캐싱 시스템
 */
interface PerformanceMetrics {
    templatePath: string;
    averageRenderTime: number;
    cacheHitRate: number;
    totalRequests: number;
    totalCacheHits: number;
    lastOptimized: Date;
}
interface OptimizationResult {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    renderTimeImprovement: number;
    recommendations: string[];
}
export declare class TemplatePerformanceOptimizer {
    private redis;
    private memoryCache;
    private performanceMetrics;
    private readonly maxMemoryCacheSize;
    private currentMemoryUsage;
    private readonly cacheDir;
    constructor();
    /**
     * Redis 초기화
     */
    private initializeRedis;
    /**
     * 파일 캐시 초기화
     */
    private initializeFileCache;
    /**
     * 캐시 키 생성
     */
    private generateCacheKey;
    /**
     * 템플릿 캐시 조회
     */
    getFromCache(templatePath: string, width: number, height: number, options?: any): Promise<Buffer | null>;
    /**
     * 템플릿 캐시 저장
     */
    saveToCache(templatePath: string, width: number, height: number, content: Buffer, options: any, renderTime: number): Promise<void>;
    /**
     * 메모리 캐시 추가
     */
    private addToMemoryCache;
    /**
     * 메모리 캐시 제거 (LRU)
     */
    private evictFromMemoryCache;
    /**
     * 템플릿 최적화
     */
    optimizeTemplate(templatePath: string, content: Buffer): Promise<{
        optimized: Buffer;
        result: OptimizationResult;
    }>;
    /**
     * SVG 속성 최적화
     */
    private optimizeSvgAttributes;
    /**
     * 성능 메트릭 업데이트
     */
    private updateMetrics;
    /**
     * 성능 리포트 생성
     */
    generatePerformanceReport(): {
        summary: {
            totalTemplates: number;
            averageCacheHitRate: number;
            averageRenderTime: number;
            totalCacheSize: number;
        };
        topPerformers: PerformanceMetrics[];
        needsOptimization: PerformanceMetrics[];
    };
    /**
     * 캐시 정리
     */
    clearCache(olderThan?: Date): Promise<number>;
    /**
     * 프리로드 자주 사용되는 템플릿
     */
    preloadFrequentTemplates(): Promise<void>;
    /**
     * 자동 최적화 스케줄링
     */
    scheduleAutoOptimization(intervalMs?: number): void;
}
export declare const templateOptimizer: TemplatePerformanceOptimizer;
export {};
//# sourceMappingURL=template-performance-optimizer.d.ts.map