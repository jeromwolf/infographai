/**
 * InfoGraphAI Asset Loader
 * 효율적 Asset 그룹 시스템을 위한 로더
 */
export interface AssetGroup {
    name: string;
    description: string;
    count: number;
    usage: string;
    assets?: Asset[];
}
export interface Asset {
    name: string;
    path: string;
    type: 'svg' | 'jpg' | 'json';
    group: string;
    size?: number;
}
export interface AssetManifest {
    version: string;
    created: string;
    total_assets: number;
    groups: Record<string, AssetGroup>;
}
export declare class AssetLoader {
    private basePath;
    private manifest;
    constructor(basePath?: string);
    /**
     * 매니페스트 로드
     */
    loadManifest(): Promise<AssetManifest>;
    /**
     * 특정 그룹의 Asset 목록 가져오기
     */
    getGroupAssets(groupName: 'core' | 'ai-ml' | 'visuals' | 'templates'): Promise<Asset[]>;
    /**
     * 핵심 필수 Asset 가져오기 (CORE 그룹)
     */
    getCoreAssets(): Promise<Asset[]>;
    /**
     * AI/ML 전문 Asset 가져오기
     */
    getAIMLAssets(): Promise<Asset[]>;
    /**
     * 시각 자료 Asset 가져오기
     */
    getVisualAssets(): Promise<Asset[]>;
    /**
     * 템플릿 라이브러리 Asset 가져오기
     */
    getTemplateAssets(): Promise<Asset[]>;
    /**
     * Asset 파일 읽기
     */
    readAsset(asset: Asset): Promise<Buffer | string>;
    /**
     * Asset 검색 (이름 기준)
     */
    searchAssets(query: string, groups?: string[]): Promise<Asset[]>;
    /**
     * 그룹별 통계
     */
    getGroupStats(): Promise<Record<string, {
        count: number;
        totalSize: number;
    }>>;
    /**
     * Asset 유효성 검증
     */
    validateAsset(asset: Asset): Promise<boolean>;
    /**
     * 프로젝트용 Asset 번들 생성
     */
    createBundle(groups: string[], outputPath: string): Promise<void>;
}
export declare const createAssetLoader: (basePath?: string) => AssetLoader;
export declare const loadCoreAssets: (basePath?: string) => Promise<Asset[]>;
export declare const loadAIMLAssets: (basePath?: string) => Promise<Asset[]>;
export default AssetLoader;
//# sourceMappingURL=index.d.ts.map