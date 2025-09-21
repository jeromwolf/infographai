"use strict";
/**
 * InfoGraphAI Asset Manager
 * 고품질 Asset 관리 및 품질 검증 시스템
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManager = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
class AssetManager {
    assetBasePath;
    metadata = new Map();
    constructor(basePath = './assets') {
        this.assetBasePath = basePath;
    }
    /**
     * Asset 디렉토리 스캔 및 메타데이터 생성
     */
    async scanAssets() {
        const collection = {
            total: 0,
            categories: {},
            quality: { high: 0, medium: 0, low: 0 },
            formats: {}
        };
        const directories = [
            'icons/ui',
            'icons/technology',
            'images/backgrounds',
            'images/illustrations',
            'animations/lottie'
        ];
        for (const dir of directories) {
            const fullPath = path_1.default.join(this.assetBasePath, dir);
            try {
                const files = await promises_1.default.readdir(fullPath);
                for (const file of files) {
                    if (file === '.gitkeep')
                        continue;
                    const filePath = path_1.default.join(fullPath, file);
                    const stats = await promises_1.default.stat(filePath);
                    if (!stats.isFile())
                        continue;
                    const metadata = await this.generateMetadata(filePath, dir);
                    if (metadata && metadata.verified) {
                        this.metadata.set(metadata.id, metadata);
                        collection.total++;
                        // 카테고리별 집계
                        collection.categories[metadata.category] =
                            (collection.categories[metadata.category] || 0) + 1;
                        // 품질별 집계  
                        collection.quality[metadata.quality]++;
                        // 포맷별 집계
                        collection.formats[metadata.format] =
                            (collection.formats[metadata.format] || 0) + 1;
                    }
                }
            }
            catch (error) {
                console.warn(`디렉토리 스캔 실패: ${dir}`, error);
            }
        }
        return collection;
    }
    /**
     * 파일 메타데이터 생성
     */
    async generateMetadata(filePath, category) {
        try {
            const stats = await promises_1.default.stat(filePath);
            const content = await promises_1.default.readFile(filePath);
            const ext = path_1.default.extname(filePath).slice(1).toLowerCase();
            const name = path_1.default.basename(filePath, path_1.default.extname(filePath));
            // 파일 해시 생성
            const hash = (0, crypto_1.createHash)('md5').update(content).digest('hex');
            // 품질 검증
            const quality = await this.verifyQuality(filePath, content, ext);
            const verified = quality !== 'low';
            // 차원 정보 추출 (SVG의 경우)
            let dimensions;
            if (ext === 'svg') {
                dimensions = this.extractSVGDimensions(content.toString());
            }
            // 태그 생성
            const tags = this.generateTags(name, category, ext);
            const metadata = {
                id: hash,
                name,
                type: this.getAssetType(category),
                category: category.replace(/\//g, '-'),
                format: ext,
                size: stats.size,
                dimensions,
                hash,
                quality,
                tags,
                createdAt: new Date(),
                verified
            };
            return metadata;
        }
        catch (error) {
            console.warn(`메타데이터 생성 실패: ${filePath}`, error);
            return null;
        }
    }
    /**
     * Asset 품질 검증
     */
    async verifyQuality(filePath, content, format) {
        const contentStr = content.toString();
        // SVG 품질 검증
        if (format === 'svg') {
            if (!contentStr.includes('<svg'))
                return 'low';
            if (contentStr.includes('<!DOCTYPE') || contentStr.includes('<html'))
                return 'low';
            // 최소 크기 확인
            if (content.length < 100)
                return 'low';
            if (content.length > 100000)
                return 'medium'; // 너무 큰 파일
            // 고품질 SVG 특성 확인
            const hasViewBox = contentStr.includes('viewBox');
            const hasPath = contentStr.includes('<path') || contentStr.includes('<g');
            const hasProperStructure = contentStr.includes('</svg>');
            if (hasViewBox && hasPath && hasProperStructure)
                return 'high';
            if (hasPath && hasProperStructure)
                return 'medium';
            return 'low';
        }
        // JPEG 품질 검증
        if (format === 'jpg' || format === 'jpeg') {
            if (content.length < 10000)
                return 'low'; // 너무 작은 파일
            if (content.length > 5000000)
                return 'medium'; // 5MB 이상
            // JPEG 시그니처 확인
            if (content[0] === 0xFF && content[1] === 0xD8)
                return 'high';
            return 'low';
        }
        // JSON 품질 검증 (Lottie)
        if (format === 'json') {
            try {
                const json = JSON.parse(contentStr);
                if (json.v && json.layers && json.fr)
                    return 'high'; // Lottie 구조
                if (typeof json === 'object')
                    return 'medium';
                return 'low';
            }
            catch {
                return 'low';
            }
        }
        return 'medium';
    }
    /**
     * SVG 차원 정보 추출
     */
    extractSVGDimensions(content) {
        const widthMatch = content.match(/width="(\d+)"/);
        const heightMatch = content.match(/height="(\d+)"/);
        const viewBoxMatch = content.match(/viewBox="[^"]*?(\d+)\s+(\d+)"/);
        if (widthMatch && heightMatch) {
            return {
                width: parseInt(widthMatch[1]),
                height: parseInt(heightMatch[1])
            };
        }
        if (viewBoxMatch) {
            return {
                width: parseInt(viewBoxMatch[1]),
                height: parseInt(viewBoxMatch[2])
            };
        }
        return undefined;
    }
    /**
     * Asset 타입 결정
     */
    getAssetType(category) {
        if (category.includes('icon'))
            return 'icon';
        if (category.includes('image'))
            return 'image';
        if (category.includes('animation'))
            return 'animation';
        return 'template';
    }
    /**
     * 태그 생성
     */
    generateTags(name, category, format) {
        const tags = [];
        // 기본 태그
        tags.push(format);
        tags.push(category.split('/')[0]);
        // 이름 기반 태그
        const nameParts = name.toLowerCase().split(/[-_]/);
        tags.push(...nameParts);
        // 카테고리별 특수 태그
        if (category.includes('technology')) {
            tags.push('tech', 'programming', 'development');
        }
        if (category.includes('ui')) {
            tags.push('interface', 'button', 'navigation');
        }
        if (category.includes('background')) {
            tags.push('wallpaper', 'texture', 'pattern');
        }
        return [...new Set(tags)]; // 중복 제거
    }
    /**
     * Asset 검색
     */
    async searchAssets(query) {
        let results = Array.from(this.metadata.values());
        if (query.type) {
            results = results.filter(asset => asset.type === query.type);
        }
        if (query.category) {
            results = results.filter(asset => asset.category.includes(query.category));
        }
        if (query.format) {
            results = results.filter(asset => asset.format === query.format);
        }
        if (query.quality) {
            results = results.filter(asset => asset.quality === query.quality);
        }
        if (query.tags && query.tags.length > 0) {
            results = results.filter(asset => query.tags.some(tag => asset.tags.includes(tag.toLowerCase())));
        }
        // 품질 순으로 정렬
        results.sort((a, b) => {
            const qualityOrder = { high: 3, medium: 2, low: 1 };
            return qualityOrder[b.quality] - qualityOrder[a.quality];
        });
        if (query.limit) {
            results = results.slice(0, query.limit);
        }
        return results;
    }
    /**
     * Asset 통계 생성
     */
    getStatistics() {
        const stats = {
            total: this.metadata.size,
            categories: {},
            quality: { high: 0, medium: 0, low: 0 },
            formats: {}
        };
        for (const asset of this.metadata.values()) {
            stats.categories[asset.category] = (stats.categories[asset.category] || 0) + 1;
            stats.quality[asset.quality]++;
            stats.formats[asset.format] = (stats.formats[asset.format] || 0) + 1;
        }
        return stats;
    }
    /**
     * 손상된 Asset 정리
     */
    async cleanupCorruptedAssets() {
        const removedFiles = [];
        for (const [id, asset] of this.metadata.entries()) {
            if (!asset.verified || asset.quality === 'low') {
                try {
                    const filePath = path_1.default.join(this.assetBasePath, asset.category.replace('-', '/'), `${asset.name}.${asset.format}`);
                    await promises_1.default.unlink(filePath);
                    this.metadata.delete(id);
                    removedFiles.push(filePath);
                }
                catch (error) {
                    console.warn(`파일 삭제 실패: ${asset.name}`, error);
                }
            }
        }
        return removedFiles;
    }
}
exports.AssetManager = AssetManager;
exports.default = AssetManager;
