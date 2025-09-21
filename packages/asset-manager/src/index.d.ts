/**
 * InfoGraphAI Asset Manager
 * 고품질 Asset 관리 및 품질 검증 시스템
 */
export interface AssetMetadata {
    id: string;
    name: string;
    type: 'icon' | 'image' | 'animation' | 'template';
    category: string;
    format: 'svg' | 'jpg' | 'png' | 'json' | 'gif';
    size: number;
    dimensions?: {
        width: number;
        height: number;
    };
    hash: string;
    quality: 'high' | 'medium' | 'low';
    tags: string[];
    createdAt: Date;
    verified: boolean;
}
export interface AssetCollection {
    total: number;
    categories: Record<string, number>;
    quality: Record<string, number>;
    formats: Record<string, number>;
}
export declare class AssetManager {
    private assetBasePath;
    private metadata;
    constructor(basePath?: string);
    /**
     * Asset 디렉토리 스캔 및 메타데이터 생성
     */
    scanAssets(): Promise<AssetCollection>;
    /**
     * 파일 메타데이터 생성
     */
    private generateMetadata;
    /**
     * Asset 품질 검증
     */
    private verifyQuality;
    /**
     * SVG 차원 정보 추출
     */
    private extractSVGDimensions;
    /**
     * Asset 타입 결정
     */
    private getAssetType;
    /**
     * 태그 생성
     */
    private generateTags;
    /**
     * Asset 검색
     */
    searchAssets(query: {
        type?: AssetMetadata['type'];
        category?: string;
        format?: AssetMetadata['format'];
        quality?: AssetMetadata['quality'];
        tags?: string[];
        limit?: number;
    }): Promise<AssetMetadata[]>;
    /**
     * Asset 통계 생성
     */
    getStatistics(): AssetCollection;
    /**
     * 손상된 Asset 정리
     */
    cleanupCorruptedAssets(): Promise<string[]>;
}
export default AssetManager;
//# sourceMappingURL=index.d.ts.map