"use strict";
/**
 * Cost Monitor - 비용 통제 시스템 (CRITICAL)
 * 이 시스템이 실패하면 하루에 수백만원이 날아갈 수 있습니다!
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostMonitor = void 0;
const events_1 = require("events");
const redis_1 = require("redis");
const winston_1 = __importDefault(require("winston"));
class CostMonitor extends events_1.EventEmitter {
    redis = null;
    logger;
    limits;
    checkInterval = null;
    isBlocked = false;
    isInitialized = false;
    constructor() {
        super();
        // Default limits - will be overridden by initialize()
        this.limits = {
            daily: { soft: 8, hard: 10 },
            hourly: { soft: 1.5, hard: 2 },
            perUser: { daily: 1, monthly: 20 }
        };
        // Winston logger 설정
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'cost-monitor.log' })
            ]
        });
    }
    async initialize(redisUrl, limits) {
        if (this.isInitialized) {
            this.logger.warn('Cost Monitor already initialized');
            return;
        }
        try {
            // Use provided values or environment defaults
            const url = redisUrl || process.env.REDIS_URL || 'redis://localhost:6379';
            if (limits) {
                this.limits = limits;
            }
            else {
                this.limits = {
                    daily: {
                        soft: Number(process.env.DAILY_COST_LIMIT) * 0.8 || 8,
                        hard: Number(process.env.DAILY_COST_LIMIT) || 10
                    },
                    hourly: {
                        soft: Number(process.env.HOURLY_COST_LIMIT) * 0.8 || 1.5,
                        hard: Number(process.env.HOURLY_COST_LIMIT) || 2
                    },
                    perUser: { daily: 1, monthly: 20 }
                };
            }
            this.redis = (0, redis_1.createClient)({ url });
            await this.redis.connect();
            this.isInitialized = true;
            this.logger.info('Cost Monitor initialized', { limits: this.limits });
            // 1분마다 비용 체크
            this.checkInterval = setInterval(() => {
                this.checkCostStatus();
            }, 60000);
        }
        catch (error) {
            this.logger.error('Failed to initialize Cost Monitor', error);
            throw error;
        }
    }
    /**
     * 비용 추가 및 한도 체크
     */
    async addCost(cost) {
        if (!this.isInitialized || !this.redis) {
            this.logger.error('Cost Monitor not initialized');
            return false;
        }
        if (this.isBlocked) {
            this.logger.warn('Service blocked due to cost limit', { cost });
            return false;
        }
        const now = new Date();
        const dayKey = `cost:daily:${now.toISOString().split('T')[0]}`;
        const hourKey = `cost:hourly:${now.getHours()}`;
        const userKey = cost.userId ? `cost:user:${cost.userId}:${dayKey}` : null;
        try {
            // Redis에 비용 추가
            await this.redis.incrByFloat(dayKey, cost.amount);
            await this.redis.incrByFloat(hourKey, cost.amount);
            if (userKey) {
                await this.redis.incrByFloat(userKey, cost.amount);
            }
            // TTL 설정 (24시간)
            await this.redis.expire(dayKey, 86400);
            await this.redis.expire(hourKey, 3600);
            // 비용 체크
            const status = await this.getCurrentStatus();
            // 한도 초과 체크
            if (status.percentage.daily >= 100) {
                this.blockService('DAILY_LIMIT_EXCEEDED');
                return false;
            }
            if (status.percentage.hourly >= 100) {
                this.blockService('HOURLY_LIMIT_EXCEEDED');
                return false;
            }
            // 경고 발생
            if (status.percentage.daily >= 80) {
                this.emit('warning', {
                    type: 'APPROACHING_DAILY_LIMIT',
                    percentage: status.percentage.daily,
                    current: status.current.daily,
                    limit: this.limits.daily.hard
                });
            }
            this.logger.info('Cost added', {
                cost,
                status: status.alert,
                dailyPercentage: status.percentage.daily
            });
            return true;
        }
        catch (error) {
            this.logger.error('Failed to add cost', error);
            // 에러 시 안전을 위해 차단
            this.blockService('COST_MONITOR_ERROR');
            return false;
        }
    }
    /**
     * 현재 비용 상태 조회
     */
    async getCurrentStatus() {
        if (!this.redis) {
            return {
                current: { daily: 0, hourly: 0, monthly: 0 },
                limits: this.limits,
                percentage: { daily: 0, hourly: 0 },
                alert: 'normal'
            };
        }
        const now = new Date();
        const dayKey = `cost:daily:${now.toISOString().split('T')[0]}`;
        const hourKey = `cost:hourly:${now.getHours()}`;
        const monthKey = `cost:monthly:${now.getFullYear()}-${now.getMonth() + 1}`;
        const [daily, hourly, monthly] = await Promise.all([
            this.redis.get(dayKey).then(v => parseFloat(v || '0')),
            this.redis.get(hourKey).then(v => parseFloat(v || '0')),
            this.redis.get(monthKey).then(v => parseFloat(v || '0'))
        ]);
        const dailyPercentage = (daily / this.limits.daily.hard) * 100;
        const hourlyPercentage = (hourly / this.limits.hourly.hard) * 100;
        let alert = 'normal';
        if (dailyPercentage >= 100 || hourlyPercentage >= 100) {
            alert = 'blocked';
        }
        else if (dailyPercentage >= 80 || hourlyPercentage >= 80) {
            alert = 'critical';
        }
        else if (dailyPercentage >= 50 || hourlyPercentage >= 50) {
            alert = 'warning';
        }
        return {
            current: { daily, hourly, monthly },
            limits: this.limits,
            percentage: {
                daily: dailyPercentage,
                hourly: hourlyPercentage
            },
            alert
        };
    }
    /**
     * 서비스 차단
     */
    blockService(reason) {
        this.isBlocked = true;
        this.logger.error('SERVICE BLOCKED', { reason });
        this.emit('blocked', { reason, timestamp: new Date() });
        // Slack, Email 등 긴급 알림 발송
        this.sendEmergencyAlert(reason);
    }
    /**
     * 서비스 차단 해제
     */
    unblockService() {
        this.isBlocked = false;
        this.logger.info('Service unblocked');
        this.emit('unblocked', { timestamp: new Date() });
    }
    /**
     * 비용 상태 주기적 체크
     */
    async checkCostStatus() {
        const status = await this.getCurrentStatus();
        if (status.alert === 'blocked' && !this.isBlocked) {
            this.blockService('AUTO_CHECK_LIMIT_EXCEEDED');
        }
        // 매 시간 정각에 상태 로깅
        if (new Date().getMinutes() === 0) {
            this.logger.info('Hourly cost status', status);
        }
    }
    /**
     * 긴급 알림 발송
     */
    sendEmergencyAlert(reason) {
        // TODO: Slack webhook, Email, SMS 등 구현
        console.error(`🚨 EMERGENCY ALERT: ${reason}`);
    }
    /**
     * 서비스별 대체 옵션 제공
     */
    getServiceAlternative(service) {
        if (!this.isBlocked)
            return null;
        switch (service) {
            case 'gpt4':
                return { model: 'gpt-3.5-turbo', reason: 'cost_saving' };
            case 'storage':
                return { quality: 'low', compression: true };
            case 'compute':
                return { throttle: true, maxConcurrent: 1 };
            default:
                return { blocked: true };
        }
    }
    /**
     * 비용 추적 (trackUsage 별칭)
     */
    async trackUsage(cost) {
        return this.addCost(cost);
    }
    /**
     * 현재 사용량 조회
     */
    async getCurrentUsage() {
        if (!this.isInitialized || !this.redis) {
            return { daily: 0, hourly: 0, monthly: 0 };
        }
        const now = new Date();
        const dayKey = `cost:daily:${now.toISOString().split('T')[0]}`;
        const hourKey = `cost:hourly:${now.getHours()}`;
        const monthKey = `cost:monthly:${now.getFullYear()}-${now.getMonth() + 1}`;
        const [daily, hourly, monthly] = await Promise.all([
            this.redis.get(dayKey).then(v => parseFloat(v || '0')),
            this.redis.get(hourKey).then(v => parseFloat(v || '0')),
            this.redis.get(monthKey).then(v => parseFloat(v || '0'))
        ]);
        return { daily, hourly, monthly };
    }
    /**
     * 정리
     */
    async cleanup() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        if (this.redis) {
            await this.redis.quit();
        }
        this.isInitialized = false;
    }
}
exports.CostMonitor = CostMonitor;
