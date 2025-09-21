"use strict";
/**
 * InfoGraphAI Asset Loader
 * 효율적 Asset 그룹 시스템을 위한 로더
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAIMLAssets = exports.loadCoreAssets = exports.createAssetLoader = exports.AssetLoader = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class AssetLoader {
    basePath;
    manifest = null;
    constructor(basePath = './assets') {
        this.basePath = basePath;
    }
    /**
     * 매니페스트 로드
     */
    async loadManifest() {
        if (this.manifest)
            return this.manifest;
        try {
            const manifestPath = path_1.default.join(this.basePath, 'groups/manifest.json');
            const content = await promises_1.default.readFile(manifestPath, 'utf-8');
            const data = JSON.parse(content);
            this.manifest = data.infographai_asset_groups;
            return this.manifest;
        }
        catch (error) {
            throw new Error(`매니페스트 로드 실패: ${error}`);
        }
    }
    /**
     * 특정 그룹의 Asset 목록 가져오기
     */
    async getGroupAssets(groupName) {
        const groupPath = path_1.default.join(this.basePath, 'groups', groupName);
        try {
            const files = await promises_1.default.readdir(groupPath);
            const assets = [];
            for (const file of files) {
                if (file.startsWith('.'))
                    continue;
                const filePath = path_1.default.join(groupPath, file);
                const stats = await promises_1.default.stat(filePath);
                const asset = {
                    name: path_1.default.basename(file, path_1.default.extname(file)),
                    path: filePath,
                    type: path_1.default.extname(file).slice(1),
                    group: groupName,
                    size: stats.size
                };
                assets.push(asset);
            }
            return assets.sort((a, b) => a.name.localeCompare(b.name));
        }
        catch (error) {
            throw new Error(`그룹 ${groupName} 로드 실패: ${error}`);
        }
    }
    /**
     * 핵심 필수 Asset 가져오기 (CORE 그룹)
     */
    async getCoreAssets() {
        return this.getGroupAssets('core');
    }
    /**
     * AI/ML 전문 Asset 가져오기
     */
    async getAIMLAssets() {
        return this.getGroupAssets('ai-ml');
    }
    /**
     * 시각 자료 Asset 가져오기
     */
    async getVisualAssets() {
        return this.getGroupAssets('visuals');
    }
    /**
     * 템플릿 라이브러리 Asset 가져오기
     */
    async getTemplateAssets() {
        return this.getGroupAssets('templates');
    }
    /**
     * Asset 파일 읽기
     */
    async readAsset(asset) {
        try {
            if (asset.type === 'svg' || asset.type === 'json') {
                return await promises_1.default.readFile(asset.path, 'utf-8');
            }
            else {
                return await promises_1.default.readFile(asset.path);
            }
        }
        catch (error) {
            throw new Error(`Asset 읽기 실패 ${asset.name}: ${error}`);
        }
    }
    /**
     * Asset 검색 (이름 기준)
     */
    async searchAssets(query, groups) {
        const searchGroups = groups || ['core', 'ai-ml', 'visuals', 'templates'];
        const results = [];
        for (const groupName of searchGroups) {
            try {
                const assets = await this.getGroupAssets(groupName);
                const matched = assets.filter(asset => asset.name.toLowerCase().includes(query.toLowerCase()));
                results.push(...matched);
            }
            catch (error) {
                console.warn(`그룹 ${groupName} 검색 중 오류:`, error);
            }
        }
        return results;
    }
    /**
     * 그룹별 통계
     */
    async getGroupStats() {
        const stats = {};
        const groups = ['core', 'ai-ml', 'visuals', 'templates'];
        for (const group of groups) {
            try {
                const assets = await this.getGroupAssets(group);
                stats[group] = {
                    count: assets.length,
                    totalSize: assets.reduce((sum, asset) => sum + (asset.size || 0), 0)
                };
            }
            catch (error) {
                stats[group] = { count: 0, totalSize: 0 };
            }
        }
        return stats;
    }
    /**
     * Asset 유효성 검증
     */
    async validateAsset(asset) {
        try {
            const stats = await promises_1.default.stat(asset.path);
            if (!stats.isFile())
                return false;
            if (asset.type === 'svg') {
                const content = await promises_1.default.readFile(asset.path, 'utf-8');
                return content.includes('<svg') && content.includes('</svg>');
            }
            if (asset.type === 'json') {
                const content = await promises_1.default.readFile(asset.path, 'utf-8');
                JSON.parse(content);
                return true;
            }
            if (asset.type === 'jpg') {
                const buffer = await promises_1.default.readFile(asset.path);
                return buffer[0] === 0xFF && buffer[1] === 0xD8; // JPEG signature
            }
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * 프로젝트용 Asset 번들 생성
     */
    async createBundle(groups, outputPath) {
        const bundle = {};
        for (const groupName of groups) {
            const assets = await this.getGroupAssets(groupName);
            bundle[groupName] = assets;
        }
        const bundleData = {
            created: new Date().toISOString(),
            groups: bundle,
            totalAssets: Object.values(bundle).reduce((sum, assets) => sum + assets.length, 0)
        };
        await promises_1.default.writeFile(outputPath, JSON.stringify(bundleData, null, 2));
    }
}
exports.AssetLoader = AssetLoader;
// 편의 함수들
const createAssetLoader = (basePath) => new AssetLoader(basePath);
exports.createAssetLoader = createAssetLoader;
const loadCoreAssets = async (basePath) => {
    const loader = new AssetLoader(basePath);
    return loader.getCoreAssets();
};
exports.loadCoreAssets = loadCoreAssets;
const loadAIMLAssets = async (basePath) => {
    const loader = new AssetLoader(basePath);
    return loader.getAIMLAssets();
};
exports.loadAIMLAssets = loadAIMLAssets;
exports.default = AssetLoader;
