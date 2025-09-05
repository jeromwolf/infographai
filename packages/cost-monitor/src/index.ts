/**
 * Cost Monitor - 비용 통제 시스템 (CRITICAL)
 * 이 시스템이 실패하면 하루에 수백만원이 날아갈 수 있습니다!
 */

import { EventEmitter } from 'events';
import { createClient, RedisClientType } from 'redis';
import winston from 'winston';

// 비용 한도 설정
export interface CostLimits {
  daily: { soft: number; hard: number };
  hourly: { soft: number; hard: number };
  perUser: { daily: number; monthly: number };
}

// 서비스별 비용 추적
export interface ServiceCost {
  service: 'gpt4' | 'gpt3.5' | 'storage' | 'compute' | 'network';
  amount: number;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

// 비용 상태
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

export class CostMonitor extends EventEmitter {
  private redis: RedisClientType;
  private logger: winston.Logger;
  private limits: CostLimits;
  private checkInterval: NodeJS.Timer | null = null;
  private isBlocked: boolean = false;

  constructor(redisUrl: string, limits: CostLimits) {
    super();
    
    this.limits = limits;
    this.redis = createClient({ url: redisUrl });
    
    // Winston logger 설정
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'cost-monitor.log' })
      ]
    });

    this.initialize();
  }

  private async initialize() {
    try {
      await this.redis.connect();
      this.logger.info('Cost Monitor initialized', { limits: this.limits });
      
      // 1분마다 비용 체크
      this.checkInterval = setInterval(() => {
        this.checkCostStatus();
      }, 60000);

    } catch (error) {
      this.logger.error('Failed to initialize Cost Monitor', error);
      throw error;
    }
  }

  /**
   * 비용 추가 및 한도 체크
   */
  public async addCost(cost: ServiceCost): Promise<boolean> {
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

    } catch (error) {
      this.logger.error('Failed to add cost', error);
      // 에러 시 안전을 위해 차단
      this.blockService('COST_MONITOR_ERROR');
      return false;
    }
  }

  /**
   * 현재 비용 상태 조회
   */
  public async getCurrentStatus(): Promise<CostStatus> {
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

    let alert: CostStatus['alert'] = 'normal';
    if (dailyPercentage >= 100 || hourlyPercentage >= 100) {
      alert = 'blocked';
    } else if (dailyPercentage >= 80 || hourlyPercentage >= 80) {
      alert = 'critical';
    } else if (dailyPercentage >= 50 || hourlyPercentage >= 50) {
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
  private blockService(reason: string) {
    this.isBlocked = true;
    this.logger.error('SERVICE BLOCKED', { reason });
    this.emit('blocked', { reason, timestamp: new Date() });
    
    // Slack, Email 등 긴급 알림 발송
    this.sendEmergencyAlert(reason);
  }

  /**
   * 서비스 차단 해제
   */
  public unblockService() {
    this.isBlocked = false;
    this.logger.info('Service unblocked');
    this.emit('unblocked', { timestamp: new Date() });
  }

  /**
   * 비용 상태 주기적 체크
   */
  private async checkCostStatus() {
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
  private sendEmergencyAlert(reason: string) {
    // TODO: Slack webhook, Email, SMS 등 구현
    console.error(`🚨 EMERGENCY ALERT: ${reason}`);
  }

  /**
   * 서비스별 대체 옵션 제공
   */
  public getServiceAlternative(service: string): any {
    if (!this.isBlocked) return null;

    switch(service) {
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
   * 정리
   */
  public async cleanup() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    await this.redis.quit();
  }
}