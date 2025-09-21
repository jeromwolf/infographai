"use strict";
/**
 * Template Analytics System
 * Phase 3: 템플릿 사용 분석 및 A/B 테스팅
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateAnalytics = exports.TemplateAnalyticsSystem = exports.AnalyticsEventType = void 0;
const client_1 = require("@prisma/client");
const events_1 = require("events");
// Analytics Event Types
var AnalyticsEventType;
(function (AnalyticsEventType) {
    AnalyticsEventType["TEMPLATE_SELECTED"] = "template_selected";
    AnalyticsEventType["TEMPLATE_RENDERED"] = "template_rendered";
    AnalyticsEventType["TEMPLATE_CACHED"] = "template_cached";
    AnalyticsEventType["TEMPLATE_ERROR"] = "template_error";
    AnalyticsEventType["VIDEO_COMPLETED"] = "video_completed";
    AnalyticsEventType["USER_ENGAGEMENT"] = "user_engagement";
})(AnalyticsEventType || (exports.AnalyticsEventType = AnalyticsEventType = {}));
class TemplateAnalyticsSystem extends events_1.EventEmitter {
    prisma;
    events = [];
    abTests = new Map();
    templateStats = new Map();
    sessionEngagement = new Map();
    constructor() {
        super();
        this.prisma = new client_1.PrismaClient();
        this.initializeABTests();
        this.startAnalyticsProcessor();
    }
    /**
     * Track analytics event
     */
    trackEvent(event) {
        const fullEvent = {
            ...event,
            timestamp: new Date()
        };
        this.events.push(fullEvent);
        this.emit('event', fullEvent);
        // Update real-time stats
        this.updateTemplateStats(fullEvent);
        // Process for A/B testing
        if (fullEvent.metadata.abTestId) {
            this.processABTestEvent(fullEvent);
        }
    }
    /**
     * Initialize default A/B tests
     */
    initializeABTests() {
        // Animation Speed Test
        this.abTests.set('animation-speed-test', {
            id: 'animation-speed-test',
            name: 'Animation Speed Optimization',
            description: 'Test optimal animation speed for user engagement',
            startDate: new Date(),
            isActive: true,
            variants: [
                {
                    id: 'slow',
                    name: 'Slow Animations',
                    templatePath: 'default',
                    config: { animationSpeed: 'slow' },
                    weight: 0.33
                },
                {
                    id: 'medium',
                    name: 'Medium Animations',
                    templatePath: 'default',
                    config: { animationSpeed: 'medium' },
                    weight: 0.34
                },
                {
                    id: 'fast',
                    name: 'Fast Animations',
                    templatePath: 'default',
                    config: { animationSpeed: 'fast' },
                    weight: 0.33
                }
            ],
            targetMetric: 'completion_rate',
            minimumSampleSize: 100
        });
        // Color Scheme Test
        this.abTests.set('color-scheme-test', {
            id: 'color-scheme-test',
            name: 'Color Scheme Preference',
            description: 'Test which color scheme leads to better engagement',
            startDate: new Date(),
            isActive: true,
            variants: [
                {
                    id: 'professional',
                    name: 'Professional Colors',
                    templatePath: 'default',
                    config: { colorScheme: 'professional' },
                    weight: 0.33
                },
                {
                    id: 'vibrant',
                    name: 'Vibrant Colors',
                    templatePath: 'default',
                    config: { colorScheme: 'vibrant' },
                    weight: 0.34
                },
                {
                    id: 'minimal',
                    name: 'Minimal Colors',
                    templatePath: 'default',
                    config: { colorScheme: 'minimal' },
                    weight: 0.33
                }
            ],
            targetMetric: 'engagement_score',
            minimumSampleSize: 100
        });
        // Information Density Test
        this.abTests.set('info-density-test', {
            id: 'info-density-test',
            name: 'Information Density Optimization',
            description: 'Find optimal information density for learning',
            startDate: new Date(),
            isActive: true,
            variants: [
                {
                    id: 'detailed',
                    name: 'Detailed Information',
                    templatePath: 'default',
                    config: { informationDensity: 'detailed' },
                    weight: 0.33
                },
                {
                    id: 'summary',
                    name: 'Summary Information',
                    templatePath: 'default',
                    config: { informationDensity: 'summary' },
                    weight: 0.34
                },
                {
                    id: 'minimal',
                    name: 'Minimal Information',
                    templatePath: 'default',
                    config: { informationDensity: 'minimal' },
                    weight: 0.33
                }
            ],
            targetMetric: 'user_satisfaction',
            minimumSampleSize: 100
        });
    }
    /**
     * Select A/B test variant
     */
    selectABTestVariant(testId) {
        const test = this.abTests.get(testId);
        if (!test || !test.isActive)
            return null;
        // Weighted random selection
        const random = Math.random();
        let cumulativeWeight = 0;
        for (const variant of test.variants) {
            cumulativeWeight += variant.weight;
            if (random <= cumulativeWeight) {
                return variant;
            }
        }
        return test.variants[test.variants.length - 1];
    }
    /**
     * Update template statistics
     */
    updateTemplateStats(event) {
        const stats = this.templateStats.get(event.templatePath) || {
            templatePath: event.templatePath,
            totalUses: 0,
            averageRenderTime: 0,
            cacheHitRate: 0,
            errorRate: 0,
            averageEngagementScore: 0,
            completionRate: 0,
            lastUsed: new Date(),
            trend: 'stable'
        };
        stats.totalUses++;
        stats.lastUsed = event.timestamp;
        // Update render time
        if (event.metadata.renderTime !== undefined) {
            stats.averageRenderTime =
                (stats.averageRenderTime * (stats.totalUses - 1) + event.metadata.renderTime) /
                    stats.totalUses;
        }
        // Update cache hit rate
        if (event.metadata.cacheHit !== undefined) {
            const cacheHits = stats.cacheHitRate * (stats.totalUses - 1) / 100;
            stats.cacheHitRate = ((cacheHits + (event.metadata.cacheHit ? 1 : 0)) / stats.totalUses) * 100;
        }
        // Update error rate
        if (event.type === AnalyticsEventType.TEMPLATE_ERROR) {
            const errors = stats.errorRate * (stats.totalUses - 1) / 100;
            stats.errorRate = ((errors + 1) / stats.totalUses) * 100;
        }
        // Update engagement score
        if (event.metadata.engagementScore !== undefined) {
            stats.averageEngagementScore =
                (stats.averageEngagementScore * (stats.totalUses - 1) + event.metadata.engagementScore) /
                    stats.totalUses;
        }
        // Update completion rate
        if (event.metadata.completionRate !== undefined) {
            stats.completionRate =
                (stats.completionRate * (stats.totalUses - 1) + event.metadata.completionRate) /
                    stats.totalUses;
        }
        // Calculate trend
        stats.trend = this.calculateTrend(event.templatePath);
        this.templateStats.set(event.templatePath, stats);
    }
    /**
     * Calculate usage trend
     */
    calculateTrend(templatePath) {
        const recentEvents = this.events
            .filter(e => e.templatePath === templatePath)
            .slice(-100); // Last 100 events
        if (recentEvents.length < 10)
            return 'stable';
        const midpoint = Math.floor(recentEvents.length / 2);
        const firstHalf = recentEvents.slice(0, midpoint);
        const secondHalf = recentEvents.slice(midpoint);
        const firstHalfRate = firstHalf.length /
            ((firstHalf[firstHalf.length - 1]?.timestamp.getTime() || 0) -
                (firstHalf[0]?.timestamp.getTime() || 0));
        const secondHalfRate = secondHalf.length /
            ((secondHalf[secondHalf.length - 1]?.timestamp.getTime() || 0) -
                (secondHalf[0]?.timestamp.getTime() || 0));
        if (secondHalfRate > firstHalfRate * 1.2)
            return 'increasing';
        if (secondHalfRate < firstHalfRate * 0.8)
            return 'decreasing';
        return 'stable';
    }
    /**
     * Process A/B test event
     */
    processABTestEvent(event) {
        const { abTestId, variantId } = event.metadata;
        if (!abTestId || !variantId)
            return;
        const test = this.abTests.get(abTestId);
        if (!test || !test.isActive)
            return;
        // Store event for later analysis
        // In production, this would be stored in database
    }
    /**
     * Get A/B test results
     */
    getABTestResults(testId) {
        const test = this.abTests.get(testId);
        if (!test)
            return null;
        const testEvents = this.events.filter(e => e.metadata.abTestId === testId);
        const variantResults = test.variants.map(variant => {
            const variantEvents = testEvents.filter(e => e.metadata.variantId === variant.id);
            const metricValues = this.extractMetricValues(variantEvents, test.targetMetric);
            const mean = metricValues.reduce((a, b) => a + b, 0) / metricValues.length || 0;
            const stdDev = this.calculateStandardDeviation(metricValues, mean);
            const confidenceInterval = this.calculateConfidenceInterval(mean, stdDev, metricValues.length);
            return {
                variantId: variant.id,
                sampleSize: variantEvents.length,
                metricValue: mean,
                confidenceInterval,
                isWinner: false
            };
        });
        // Determine winner if sample size is sufficient
        const totalSamples = variantResults.reduce((sum, v) => sum + v.sampleSize, 0);
        const hasEnoughSamples = totalSamples >= test.minimumSampleSize;
        if (hasEnoughSamples) {
            const bestVariant = variantResults.reduce((best, current) => current.metricValue > best.metricValue ? current : best);
            bestVariant.isWinner = true;
        }
        // Calculate statistical significance
        const significance = this.calculateStatisticalSignificance(variantResults);
        // Generate recommendations
        const recommendations = this.generateRecommendations(test, variantResults, significance);
        return {
            testId,
            status: test.isActive ? 'running' : 'completed',
            sampleSize: totalSamples,
            variants: variantResults,
            statisticalSignificance: significance,
            recommendations
        };
    }
    /**
     * Extract metric values from events
     */
    extractMetricValues(events, metric) {
        return events
            .map(e => {
            switch (metric) {
                case 'completion_rate':
                    return e.metadata.completionRate;
                case 'engagement_score':
                    return e.metadata.engagementScore;
                case 'render_time':
                    return e.metadata.renderTime;
                case 'user_satisfaction':
                    return e.metadata.engagementScore; // Proxy for satisfaction
                default:
                    return undefined;
            }
        })
            .filter((v) => v !== undefined);
    }
    /**
     * Calculate standard deviation
     */
    calculateStandardDeviation(values, mean) {
        if (values.length === 0)
            return 0;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }
    /**
     * Calculate confidence interval (95%)
     */
    calculateConfidenceInterval(mean, stdDev, sampleSize) {
        const zScore = 1.96; // 95% confidence
        const marginOfError = zScore * (stdDev / Math.sqrt(sampleSize));
        return [mean - marginOfError, mean + marginOfError];
    }
    /**
     * Calculate statistical significance
     */
    calculateStatisticalSignificance(variants) {
        if (variants.length < 2)
            return 0;
        // Simplified chi-square test
        const totalSamples = variants.reduce((sum, v) => sum + v.sampleSize, 0);
        const expectedValue = totalSamples / variants.length;
        const chiSquare = variants.reduce((sum, v) => {
            const observed = v.sampleSize;
            return sum + Math.pow(observed - expectedValue, 2) / expectedValue;
        }, 0);
        // Convert to p-value approximation (simplified)
        const pValue = Math.exp(-chiSquare / 2);
        return (1 - pValue) * 100; // Return as percentage
    }
    /**
     * Generate recommendations
     */
    generateRecommendations(test, results, significance) {
        const recommendations = [];
        // Check sample size
        const totalSamples = results.reduce((sum, v) => sum + v.sampleSize, 0);
        if (totalSamples < test.minimumSampleSize) {
            recommendations.push(`Continue testing: Need ${test.minimumSampleSize - totalSamples} more samples`);
        }
        // Check statistical significance
        if (significance < 95) {
            recommendations.push(`Results not statistically significant (${significance.toFixed(1)}% confidence)`);
        }
        else {
            recommendations.push(`Results are statistically significant (${significance.toFixed(1)}% confidence)`);
        }
        // Find best performer
        const bestVariant = results.reduce((best, current) => current.metricValue > best.metricValue ? current : best);
        const improvement = results.length > 1
            ? ((bestVariant.metricValue - results[0].metricValue) / results[0].metricValue) * 100
            : 0;
        if (improvement > 10) {
            recommendations.push(`Variant '${bestVariant.variantId}' shows ${improvement.toFixed(1)}% improvement`);
            recommendations.push('Consider implementing this variant as default');
        }
        return recommendations;
    }
    /**
     * Get template recommendations
     */
    getTemplateRecommendations(topic, userLevel) {
        const allStats = Array.from(this.templateStats.values());
        // Recommended: High engagement, low error rate
        const recommended = allStats
            .filter(s => s.averageEngagementScore > 70 && s.errorRate < 5)
            .sort((a, b) => b.averageEngagementScore - a.averageEngagementScore)
            .slice(0, 5)
            .map(s => s.templatePath);
        // Avoid: High error rate or low completion
        const avoid = allStats
            .filter(s => s.errorRate > 10 || s.completionRate < 50)
            .slice(0, 3)
            .map(s => s.templatePath);
        // Trending: Increasing usage
        const trending = allStats
            .filter(s => s.trend === 'increasing')
            .sort((a, b) => b.totalUses - a.totalUses)
            .slice(0, 5)
            .map(s => s.templatePath);
        return { recommended, avoid, trending };
    }
    /**
     * Export analytics data
     */
    async exportAnalytics(startDate, endDate, format = 'json') {
        const filteredEvents = this.events.filter(e => e.timestamp >= startDate && e.timestamp <= endDate);
        if (format === 'json') {
            return JSON.stringify({
                period: { start: startDate, end: endDate },
                totalEvents: filteredEvents.length,
                events: filteredEvents,
                stats: Array.from(this.templateStats.values()),
                abTests: Array.from(this.abTests.entries()).map(([id, test]) => ({
                    ...test,
                    results: this.getABTestResults(id)
                }))
            }, null, 2);
        }
        else {
            // CSV format
            const headers = ['timestamp', 'type', 'templatePath', 'userId', 'sessionId', 'renderTime', 'cacheHit', 'engagementScore'];
            const rows = filteredEvents.map(e => [
                e.timestamp.toISOString(),
                e.type,
                e.templatePath,
                e.userId || '',
                e.sessionId,
                e.metadata.renderTime || '',
                e.metadata.cacheHit || '',
                e.metadata.engagementScore || ''
            ]);
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
    }
    /**
     * Start analytics processor
     */
    startAnalyticsProcessor() {
        // Process events every minute
        setInterval(() => {
            this.processAnalyticsBatch();
        }, 60000);
        // Save to database every 5 minutes
        setInterval(() => {
            this.persistAnalytics();
        }, 300000);
    }
    /**
     * Process analytics batch
     */
    async processAnalyticsBatch() {
        // Group events by session for engagement calculation
        const sessionEvents = new Map();
        for (const event of this.events) {
            const sessionId = event.sessionId;
            if (!sessionEvents.has(sessionId)) {
                sessionEvents.set(sessionId, []);
            }
            sessionEvents.get(sessionId).push(event);
        }
        // Calculate session engagement
        for (const [sessionId, events] of sessionEvents.entries()) {
            const engagementScore = this.calculateSessionEngagement(events);
            this.sessionEngagement.set(sessionId, [
                ...(this.sessionEngagement.get(sessionId) || []),
                engagementScore
            ]);
        }
    }
    /**
     * Calculate session engagement score
     */
    calculateSessionEngagement(events) {
        let score = 0;
        // Factors for engagement
        const completionBonus = events.some(e => e.type === AnalyticsEventType.VIDEO_COMPLETED) ? 30 : 0;
        const errorPenalty = events.filter(e => e.type === AnalyticsEventType.TEMPLATE_ERROR).length * -10;
        const renderTimeBonus = events
            .filter(e => e.metadata.renderTime && e.metadata.renderTime < 100)
            .length * 5;
        score = 50 + completionBonus + errorPenalty + renderTimeBonus;
        return Math.max(0, Math.min(100, score));
    }
    /**
     * Persist analytics to database
     */
    async persistAnalytics() {
        // In production, save events to database
        // For now, just clear old events from memory
        const oneHourAgo = new Date(Date.now() - 3600000);
        this.events = this.events.filter(e => e.timestamp > oneHourAgo);
    }
}
exports.TemplateAnalyticsSystem = TemplateAnalyticsSystem;
// Export singleton instance
exports.templateAnalytics = new TemplateAnalyticsSystem();
