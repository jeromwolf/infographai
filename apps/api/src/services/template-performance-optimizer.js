"use strict";
/**
 * Template Performance Optimizer
 * Phase 3: 성능 최적화 및 캐싱 시스템
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateOptimizer = exports.TemplatePerformanceOptimizer = void 0;
const ioredis_1 = require("ioredis");
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
class TemplatePerformanceOptimizer {
    redis = null;
    memoryCache;
    performanceMetrics;
    maxMemoryCacheSize = 100; // MB
    currentMemoryUsage = 0;
    cacheDir;
    constructor() {
        this.memoryCache = new Map();
        this.performanceMetrics = new Map();
        this.cacheDir = path_1.default.join(__dirname, '../../../../cache/templates');
        this.initializeRedis();
        this.initializeFileCache();
    }
    /**
     * Redis 초기화
     */
    async initializeRedis() {
        try {
            this.redis = new ioredis_1.Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                db: 1, // Use DB 1 for template cache
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                }
            });
            this.redis.on('error', (err) => {
                console.error('Redis connection error:', err);
                // Fallback to memory cache only
                this.redis = null;
            });
            this.redis.on('connect', () => {
                console.log('✅ Redis connected for template caching');
            });
        }
        catch (error) {
            console.warn('Redis not available, using memory cache only');
            this.redis = null;
        }
    }
    /**
     * 파일 캐시 초기화
     */
    async initializeFileCache() {
        try {
            await promises_1.default.mkdir(this.cacheDir, { recursive: true });
        }
        catch (error) {
            console.error('Failed to create cache directory:', error);
        }
    }
    /**
     * 캐시 키 생성
     */
    generateCacheKey(templatePath, width, height, options = {}) {
        const data = `${templatePath}-${width}x${height}-${JSON.stringify(options)}`;
        return crypto_1.default.createHash('sha256').update(data).digest('hex');
    }
    /**
     * 템플릿 캐시 조회
     */
    async getFromCache(templatePath, width, height, options = {}) {
        const startTime = Date.now();
        const cacheKey = this.generateCacheKey(templatePath, width, height, options);
        // 1. Memory cache check (L1)
        const memoryEntry = this.memoryCache.get(cacheKey);
        if (memoryEntry) {
            this.updateMetrics(templatePath, true, Date.now() - startTime);
            memoryEntry.metadata.lastAccessed = new Date();
            memoryEntry.metadata.accessCount++;
            return memoryEntry.content;
        }
        // 2. Redis cache check (L2)
        if (this.redis) {
            try {
                const redisData = await this.redis.getBuffer(cacheKey);
                if (redisData) {
                    // Promote to memory cache
                    await this.addToMemoryCache(cacheKey, redisData, templatePath);
                    this.updateMetrics(templatePath, true, Date.now() - startTime);
                    return redisData;
                }
            }
            catch (error) {
                console.error('Redis cache error:', error);
            }
        }
        // 3. File cache check (L3)
        try {
            const filePath = path_1.default.join(this.cacheDir, `${cacheKey}.cache`);
            const fileData = await promises_1.default.readFile(filePath);
            // Promote to faster caches
            await this.addToMemoryCache(cacheKey, fileData, templatePath);
            if (this.redis) {
                await this.redis.setex(cacheKey, 3600, fileData); // 1 hour TTL
            }
            this.updateMetrics(templatePath, true, Date.now() - startTime);
            return fileData;
        }
        catch (error) {
            // Cache miss
        }
        this.updateMetrics(templatePath, false, Date.now() - startTime);
        return null;
    }
    /**
     * 템플릿 캐시 저장
     */
    async saveToCache(templatePath, width, height, content, options = {}, renderTime) {
        const cacheKey = this.generateCacheKey(templatePath, width, height, options);
        // Save to all cache layers
        try {
            // 1. Memory cache (L1)
            await this.addToMemoryCache(cacheKey, content, templatePath, renderTime);
            // 2. Redis cache (L2)
            if (this.redis) {
                await this.redis.setex(cacheKey, 3600, content); // 1 hour TTL
            }
            // 3. File cache (L3)
            const filePath = path_1.default.join(this.cacheDir, `${cacheKey}.cache`);
            await promises_1.default.writeFile(filePath, content);
            // Save metadata
            const metadataPath = path_1.default.join(this.cacheDir, `${cacheKey}.meta`);
            await promises_1.default.writeFile(metadataPath, JSON.stringify({
                templatePath,
                width,
                height,
                size: content.length,
                renderTime,
                created: new Date().toISOString()
            }));
        }
        catch (error) {
            console.error('Failed to save to cache:', error);
        }
    }
    /**
     * 메모리 캐시 추가
     */
    async addToMemoryCache(cacheKey, content, templatePath, renderTime = 0) {
        const size = content.length / (1024 * 1024); // Convert to MB
        // Check memory limit
        if (this.currentMemoryUsage + size > this.maxMemoryCacheSize) {
            await this.evictFromMemoryCache(size);
        }
        const metadata = await (0, sharp_1.default)(content).metadata();
        this.memoryCache.set(cacheKey, {
            content,
            metadata: {
                size: content.length,
                format: metadata.format || 'png',
                width: metadata.width || 0,
                height: metadata.height || 0,
                lastAccessed: new Date(),
                accessCount: 1,
                renderTime
            }
        });
        this.currentMemoryUsage += size;
    }
    /**
     * 메모리 캐시 제거 (LRU)
     */
    async evictFromMemoryCache(requiredSize) {
        const entries = Array.from(this.memoryCache.entries())
            .map(([key, value]) => ({
            key,
            lastAccessed: value.metadata.lastAccessed,
            size: value.metadata.size / (1024 * 1024)
        }))
            .sort((a, b) => a.lastAccessed.getTime() - b.lastAccessed.getTime());
        let freedSize = 0;
        for (const entry of entries) {
            if (freedSize >= requiredSize)
                break;
            this.memoryCache.delete(entry.key);
            freedSize += entry.size;
            this.currentMemoryUsage -= entry.size;
        }
    }
    /**
     * 템플릿 최적화
     */
    async optimizeTemplate(templatePath, content) {
        const startTime = Date.now();
        const originalSize = content.length;
        const recommendations = [];
        try {
            // Parse SVG content
            const svgContent = content.toString();
            // 1. Remove unnecessary whitespace and comments
            let optimizedSvg = svgContent
                .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .replace(/>\s+</g, '><') // Remove whitespace between tags
                .trim();
            // 2. Optimize SVG attributes
            optimizedSvg = this.optimizeSvgAttributes(optimizedSvg);
            // 3. Compress with Sharp
            const optimizedBuffer = await (0, sharp_1.default)(Buffer.from(optimizedSvg))
                .png({
                quality: 85,
                compressionLevel: 9,
                adaptiveFiltering: true,
                palette: true
            })
                .toBuffer();
            const optimizedSize = optimizedBuffer.length;
            const compressionRatio = ((originalSize - optimizedSize) / originalSize) * 100;
            const renderTimeImprovement = Date.now() - startTime;
            // Generate recommendations
            if (compressionRatio < 10) {
                recommendations.push('Consider using simpler graphics or reducing detail');
            }
            if (optimizedSize > 100000) {
                recommendations.push('Template size is large, consider splitting into smaller components');
            }
            if (svgContent.includes('base64')) {
                recommendations.push('Embedded images detected, consider external references');
            }
            const result = {
                originalSize,
                optimizedSize,
                compressionRatio,
                renderTimeImprovement,
                recommendations
            };
            return { optimized: optimizedBuffer, result };
        }
        catch (error) {
            console.error('Template optimization failed:', error);
            return {
                optimized: content,
                result: {
                    originalSize,
                    optimizedSize: originalSize,
                    compressionRatio: 0,
                    renderTimeImprovement: 0,
                    recommendations: ['Optimization failed, using original']
                }
            };
        }
    }
    /**
     * SVG 속성 최적화
     */
    optimizeSvgAttributes(svg) {
        return svg
            .replace(/([0-9]+\.[0-9]{3,})/g, (match) => {
            // Round decimal numbers to 2 places
            return parseFloat(match).toFixed(2);
        })
            .replace(/stroke-width="[0-9]+\.0+"/g, (match) => {
            // Remove unnecessary decimals
            return match.replace(/\.0+/, '');
        })
            .replace(/id="[^"]+"/g, '') // Remove unused IDs
            .replace(/data-[^=]+="[^"]*"/g, ''); // Remove data attributes
    }
    /**
     * 성능 메트릭 업데이트
     */
    updateMetrics(templatePath, cacheHit, renderTime) {
        const existing = this.performanceMetrics.get(templatePath) || {
            templatePath,
            averageRenderTime: 0,
            cacheHitRate: 0,
            totalRequests: 0,
            totalCacheHits: 0,
            lastOptimized: new Date()
        };
        existing.totalRequests++;
        if (cacheHit) {
            existing.totalCacheHits++;
        }
        existing.cacheHitRate = (existing.totalCacheHits / existing.totalRequests) * 100;
        existing.averageRenderTime =
            (existing.averageRenderTime * (existing.totalRequests - 1) + renderTime) /
                existing.totalRequests;
        this.performanceMetrics.set(templatePath, existing);
    }
    /**
     * 성능 리포트 생성
     */
    generatePerformanceReport() {
        const metrics = Array.from(this.performanceMetrics.values());
        const summary = {
            totalTemplates: metrics.length,
            averageCacheHitRate: metrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / metrics.length || 0,
            averageRenderTime: metrics.reduce((sum, m) => sum + m.averageRenderTime, 0) / metrics.length || 0,
            totalCacheSize: this.currentMemoryUsage
        };
        const topPerformers = metrics
            .sort((a, b) => b.cacheHitRate - a.cacheHitRate)
            .slice(0, 5);
        const needsOptimization = metrics
            .filter(m => m.cacheHitRate < 50 || m.averageRenderTime > 100)
            .sort((a, b) => a.cacheHitRate - b.cacheHitRate)
            .slice(0, 5);
        return { summary, topPerformers, needsOptimization };
    }
    /**
     * 캐시 정리
     */
    async clearCache(olderThan) {
        let clearedCount = 0;
        // Clear memory cache
        if (olderThan) {
            for (const [key, entry] of this.memoryCache.entries()) {
                if (entry.metadata.lastAccessed < olderThan) {
                    this.memoryCache.delete(key);
                    clearedCount++;
                }
            }
        }
        else {
            clearedCount = this.memoryCache.size;
            this.memoryCache.clear();
            this.currentMemoryUsage = 0;
        }
        // Clear Redis cache
        if (this.redis) {
            if (olderThan) {
                // Redis doesn't support date-based clearing easily
                // Would need to store metadata separately
            }
            else {
                await this.redis.flushdb();
            }
        }
        // Clear file cache
        try {
            const files = await promises_1.default.readdir(this.cacheDir);
            for (const file of files) {
                if (file.endsWith('.cache') || file.endsWith('.meta')) {
                    const filePath = path_1.default.join(this.cacheDir, file);
                    if (olderThan) {
                        const stats = await promises_1.default.stat(filePath);
                        if (stats.mtime < olderThan) {
                            await promises_1.default.unlink(filePath);
                            clearedCount++;
                        }
                    }
                    else {
                        await promises_1.default.unlink(filePath);
                        clearedCount++;
                    }
                }
            }
        }
        catch (error) {
            console.error('Failed to clear file cache:', error);
        }
        return clearedCount;
    }
    /**
     * 프리로드 자주 사용되는 템플릿
     */
    async preloadFrequentTemplates() {
        const report = this.generatePerformanceReport();
        const topTemplates = report.topPerformers.slice(0, 10);
        for (const metric of topTemplates) {
            try {
                const templatePath = metric.templatePath;
                // Preload common sizes
                const commonSizes = [
                    { width: 1920, height: 1080 },
                    { width: 1280, height: 720 },
                    { width: 854, height: 480 }
                ];
                for (const size of commonSizes) {
                    const cacheKey = this.generateCacheKey(templatePath, size.width, size.height);
                    // Check if already cached
                    if (!this.memoryCache.has(cacheKey)) {
                        // Load and optimize template
                        const content = await promises_1.default.readFile(templatePath);
                        const { optimized } = await this.optimizeTemplate(templatePath, content);
                        // Resize and cache
                        const resized = await (0, sharp_1.default)(optimized)
                            .resize(size.width, size.height, { fit: 'contain' })
                            .toBuffer();
                        await this.saveToCache(templatePath, size.width, size.height, resized, {}, 0);
                    }
                }
            }
            catch (error) {
                console.error(`Failed to preload template: ${metric.templatePath}`, error);
            }
        }
        console.log(`✅ Preloaded ${topTemplates.length} frequently used templates`);
    }
    /**
     * 자동 최적화 스케줄링
     */
    scheduleAutoOptimization(intervalMs = 3600000) {
        setInterval(async () => {
            console.log('🔄 Running automatic template optimization...');
            const report = this.generatePerformanceReport();
            const needsOptimization = report.needsOptimization;
            for (const metric of needsOptimization) {
                try {
                    const content = await promises_1.default.readFile(metric.templatePath);
                    const { optimized, result } = await this.optimizeTemplate(metric.templatePath, content);
                    if (result.compressionRatio > 10) {
                        // Save optimized version
                        const optimizedPath = metric.templatePath.replace('.svg', '.optimized.svg');
                        await promises_1.default.writeFile(optimizedPath, optimized);
                        console.log(`✅ Optimized ${metric.templatePath}: ${result.compressionRatio.toFixed(2)}% reduction`);
                    }
                    // Update last optimized date
                    metric.lastOptimized = new Date();
                }
                catch (error) {
                    console.error(`Failed to optimize ${metric.templatePath}:`, error);
                }
            }
            // Clear old cache entries
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const cleared = await this.clearCache(oneWeekAgo);
            console.log(`🧹 Cleared ${cleared} old cache entries`);
        }, intervalMs);
    }
}
exports.TemplatePerformanceOptimizer = TemplatePerformanceOptimizer;
// Export singleton instance
exports.templateOptimizer = new TemplatePerformanceOptimizer();
