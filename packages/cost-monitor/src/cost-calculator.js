"use strict";
/**
 * 비용 계산기 - 각 서비스별 정확한 비용 계산
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostCalculator = void 0;
// OpenAI 가격 (2024년 기준)
const OPENAI_PRICING = {
    'gpt-4': {
        input: 0.03 / 1000, // $0.03 per 1K tokens
        output: 0.06 / 1000 // $0.06 per 1K tokens
    },
    'gpt-3.5-turbo': {
        input: 0.0005 / 1000, // $0.0005 per 1K tokens
        output: 0.0015 / 1000 // $0.0015 per 1K tokens
    }
};
// AWS 가격 (Seoul region)
const AWS_PRICING = {
    s3: {
        storage: 0.023 / 1000 / 1000 / 1000, // per byte per month
        request: 0.0004 / 1000, // per request
        bandwidth: 0.09 / 1000 / 1000 / 1000 // per byte
    },
    ec2: {
        't3.micro': 0.0104, // per hour
        't3.small': 0.0208, // per hour
        't3.medium': 0.0416, // per hour
        'g4dn.xlarge': 0.526 // GPU instance per hour
    }
};
class CostCalculator {
    /**
     * GPT API 비용 계산
     */
    static calculateGPTCost(model, inputTokens, outputTokens) {
        const pricing = OPENAI_PRICING[model];
        return (inputTokens * pricing.input) + (outputTokens * pricing.output);
    }
    /**
     * 스토리지 비용 계산
     */
    static calculateStorageCost(sizeInBytes, requests = 1, bandwidthBytes = 0) {
        const storageCost = sizeInBytes * AWS_PRICING.s3.storage;
        const requestCost = requests * AWS_PRICING.s3.request;
        const bandwidthCost = bandwidthBytes * AWS_PRICING.s3.bandwidth;
        return storageCost + requestCost + bandwidthCost;
    }
    /**
     * 컴퓨팅 비용 계산
     */
    static calculateComputeCost(instanceType, hours) {
        return AWS_PRICING.ec2[instanceType] * hours;
    }
    /**
     * 영상 1개 생성 예상 비용
     */
    static estimateVideoCost(duration, // seconds
    quality) {
        // 스크립트 생성 (GPT)
        const scriptTokens = duration * 10; // 추정: 초당 10토큰
        const gptCost = this.calculateGPTCost('gpt-3.5-turbo', scriptTokens, scriptTokens * 2);
        // 스토리지
        const videoSize = quality === '4k' ? duration * 10000000 :
            quality === '1080p' ? duration * 5000000 :
                duration * 2500000; // bytes
        const storageCost = this.calculateStorageCost(videoSize, 10, videoSize);
        // 렌더링 (GPU 사용)
        const renderTime = duration / 60 / 10; // 10배속 렌더링 가정
        const computeCost = this.calculateComputeCost('g4dn.xlarge', renderTime);
        return gptCost + storageCost + computeCost;
    }
    /**
     * 월간 예상 비용 계산
     */
    static estimateMonthlyCost(dailyVideos, averageDuration, quality = '1080p') {
        const perVideoCost = this.estimateVideoCost(averageDuration, quality);
        return perVideoCost * dailyVideos * 30;
    }
    /**
     * 비용 최적화 제안
     */
    static getCostOptimizationSuggestions(currentUsage) {
        const suggestions = [];
        if (currentUsage.gptModel === 'gpt-4') {
            suggestions.push('Consider using GPT-3.5 for non-critical tasks (95% cost reduction)');
        }
        if (currentUsage.videoQuality === '4k') {
            suggestions.push('Use 1080p instead of 4K for 50% storage savings');
        }
        if (!currentUsage.caching) {
            suggestions.push('Enable caching to reduce duplicate API calls by 60%');
        }
        if (currentUsage.renderingInstance === 'g4dn.xlarge') {
            suggestions.push('Use spot instances for 70% compute cost reduction');
        }
        return suggestions;
    }
}
exports.CostCalculator = CostCalculator;
