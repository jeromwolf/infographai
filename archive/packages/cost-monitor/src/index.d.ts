/**
 * Cost Monitor - 비용 통제 시스템 (CRITICAL)
 * 이 시스템이 실패하면 하루에 수백만원이 날아갈 수 있습니다!
 */
import { EventEmitter } from 'events';
export interface CostLimits {
    daily: {
        soft: number;
        hard: number;
    };
    hourly: {
        soft: number;
        hard: number;
    };
    perUser: {
        daily: number;
        monthly: number;
    };
}
export interface ServiceCost {
    service: 'gpt4' | 'gpt3.5' | 'storage' | 'compute' | 'network';
    amount: number;
    timestamp: Date;
    userId?: string;
    metadata?: Record<string, any>;
}
export interface CostStatus {
    current: {
        daily: number;
        hourly: number;
        monthly: number;
    };
    limits: CostLimits;
    percentage: {
        daily: number;
        hourly: number;
    };
    alert: 'normal' | 'warning' | 'critical' | 'blocked';
}
export declare class CostMonitor extends EventEmitter {
    private redis;
    private logger;
    private limits;
    private checkInterval;
    private isBlocked;
    private isInitialized;
    constructor();
    initialize(redisUrl?: string, limits?: CostLimits): Promise<void>;
    /**
     * 비용 추가 및 한도 체크
     */
    addCost(cost: ServiceCost): Promise<boolean>;
    /**
     * 현재 비용 상태 조회
     */
    getCurrentStatus(): Promise<CostStatus>;
    /**
     * 서비스 차단
     */
    private blockService;
    /**
     * 서비스 차단 해제
     */
    unblockService(): void;
    /**
     * 비용 상태 주기적 체크
     */
    private checkCostStatus;
    /**
     * 긴급 알림 발송
     */
    private sendEmergencyAlert;
    /**
     * 서비스별 대체 옵션 제공
     */
    getServiceAlternative(service: string): any;
    /**
     * 비용 추적 (trackUsage 별칭)
     */
    trackUsage(cost: ServiceCost): Promise<boolean>;
    /**
     * 한도 체크
     */
    checkLimit(): Promise<boolean>;
    /**
     * 현재 사용량 조회
     */
    getCurrentUsage(): Promise<{
        daily: number;
        hourly: number;
        monthly: number;
    }>;
    /**
     * 정리
     */
    cleanup(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map