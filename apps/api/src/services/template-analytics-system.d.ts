/**
 * Template Analytics System
 * Phase 3: 템플릿 사용 분석 및 A/B 테스팅
 */
import { EventEmitter } from 'events';
export declare enum AnalyticsEventType {
    TEMPLATE_SELECTED = "template_selected",
    TEMPLATE_RENDERED = "template_rendered",
    TEMPLATE_CACHED = "template_cached",
    TEMPLATE_ERROR = "template_error",
    VIDEO_COMPLETED = "video_completed",
    USER_ENGAGEMENT = "user_engagement"
}
export interface ABTestVariant {
    id: string;
    name: string;
    templatePath: string;
    config: {
        animationSpeed?: 'slow' | 'medium' | 'fast';
        colorScheme?: 'professional' | 'vibrant' | 'minimal';
        informationDensity?: 'detailed' | 'summary' | 'minimal';
        layoutType?: 'single' | 'split' | 'grid' | 'timeline';
    };
    weight: number;
}
export interface ABTest {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    variants: ABTestVariant[];
    targetMetric: 'completion_rate' | 'engagement_score' | 'render_time' | 'user_satisfaction';
    minimumSampleSize: number;
}
export interface AnalyticsEvent {
    type: AnalyticsEventType;
    timestamp: Date;
    userId?: string;
    sessionId: string;
    templatePath: string;
    metadata: {
        scenarioId?: string;
        videoId?: string;
        renderTime?: number;
        cacheHit?: boolean;
        errorMessage?: string;
        engagementScore?: number;
        completionRate?: number;
        abTestId?: string;
        variantId?: string;
    };
}
export interface TemplateStats {
    templatePath: string;
    totalUses: number;
    averageRenderTime: number;
    cacheHitRate: number;
    errorRate: number;
    averageEngagementScore: number;
    completionRate: number;
    lastUsed: Date;
    trend: 'increasing' | 'stable' | 'decreasing';
}
export interface ABTestResults {
    testId: string;
    status: 'running' | 'completed' | 'stopped';
    sampleSize: number;
    variants: {
        variantId: string;
        sampleSize: number;
        metricValue: number;
        confidenceInterval: [number, number];
        isWinner?: boolean;
    }[];
    statisticalSignificance: number;
    recommendations: string[];
}
export declare class TemplateAnalyticsSystem extends EventEmitter {
    private prisma;
    private events;
    private abTests;
    private templateStats;
    private sessionEngagement;
    constructor();
    /**
     * Track analytics event
     */
    trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): void;
    /**
     * Initialize default A/B tests
     */
    private initializeABTests;
    /**
     * Select A/B test variant
     */
    selectABTestVariant(testId: string): ABTestVariant | null;
    /**
     * Update template statistics
     */
    private updateTemplateStats;
    /**
     * Calculate usage trend
     */
    private calculateTrend;
    /**
     * Process A/B test event
     */
    private processABTestEvent;
    /**
     * Get A/B test results
     */
    getABTestResults(testId: string): ABTestResults | null;
    /**
     * Extract metric values from events
     */
    private extractMetricValues;
    /**
     * Calculate standard deviation
     */
    private calculateStandardDeviation;
    /**
     * Calculate confidence interval (95%)
     */
    private calculateConfidenceInterval;
    /**
     * Calculate statistical significance
     */
    private calculateStatisticalSignificance;
    /**
     * Generate recommendations
     */
    private generateRecommendations;
    /**
     * Get template recommendations
     */
    getTemplateRecommendations(topic: string, userLevel: string): {
        recommended: string[];
        avoid: string[];
        trending: string[];
    };
    /**
     * Export analytics data
     */
    exportAnalytics(startDate: Date, endDate: Date, format?: 'json' | 'csv'): Promise<string>;
    /**
     * Start analytics processor
     */
    private startAnalyticsProcessor;
    /**
     * Process analytics batch
     */
    private processAnalyticsBatch;
    /**
     * Calculate session engagement score
     */
    private calculateSessionEngagement;
    /**
     * Persist analytics to database
     */
    private persistAnalytics;
}
export declare const templateAnalytics: TemplateAnalyticsSystem;
//# sourceMappingURL=template-analytics-system.d.ts.map