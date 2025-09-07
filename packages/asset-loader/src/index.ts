/**
 * InfoGraphAI Asset Loader
 * 효율적 Asset 그룹 시스템을 위한 로더
 */

import fs from 'fs/promises';
import path from 'path';

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

export class AssetLoader {
  private basePath: string;
  private manifest: AssetManifest | null = null;

  constructor(basePath = './assets') {
    this.basePath = basePath;
  }

  /**
   * 매니페스트 로드
   */
  async loadManifest(): Promise<AssetManifest> {
    if (this.manifest) return this.manifest;

    try {
      const manifestPath = path.join(this.basePath, 'groups/manifest.json');
      const content = await fs.readFile(manifestPath, 'utf-8');
      const data = JSON.parse(content);
      this.manifest = data.infographai_asset_groups;
      return this.manifest;
    } catch (error) {
      throw new Error(`매니페스트 로드 실패: ${error}`);
    }
  }

  /**
   * 특정 그룹의 Asset 목록 가져오기
   */
  async getGroupAssets(groupName: 'core' | 'ai-ml' | 'visuals' | 'templates'): Promise<Asset[]> {
    const groupPath = path.join(this.basePath, 'groups', groupName);
    
    try {
      const files = await fs.readdir(groupPath);
      const assets: Asset[] = [];

      for (const file of files) {
        if (file.startsWith('.')) continue;
        
        const filePath = path.join(groupPath, file);
        const stats = await fs.stat(filePath);
        
        const asset: Asset = {
          name: path.basename(file, path.extname(file)),
          path: filePath,
          type: path.extname(file).slice(1) as Asset['type'],
          group: groupName,
          size: stats.size
        };
        
        assets.push(asset);
      }

      return assets.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw new Error(`그룹 ${groupName} 로드 실패: ${error}`);
    }
  }

  /**
   * 핵심 필수 Asset 가져오기 (CORE 그룹)
   */
  async getCoreAssets(): Promise<Asset[]> {
    return this.getGroupAssets('core');
  }

  /**
   * AI/ML 전문 Asset 가져오기
   */
  async getAIMLAssets(): Promise<Asset[]> {
    return this.getGroupAssets('ai-ml');
  }

  /**
   * 시각 자료 Asset 가져오기
   */
  async getVisualAssets(): Promise<Asset[]> {
    return this.getGroupAssets('visuals');
  }

  /**
   * 템플릿 라이브러리 Asset 가져오기
   */
  async getTemplateAssets(): Promise<Asset[]> {
    return this.getGroupAssets('templates');
  }

  /**
   * Asset 파일 읽기
   */
  async readAsset(asset: Asset): Promise<Buffer | string> {
    try {
      if (asset.type === 'svg' || asset.type === 'json') {
        return await fs.readFile(asset.path, 'utf-8');
      } else {
        return await fs.readFile(asset.path);
      }
    } catch (error) {
      throw new Error(`Asset 읽기 실패 ${asset.name}: ${error}`);
    }
  }

  /**
   * Asset 검색 (이름 기준)
   */
  async searchAssets(query: string, groups?: string[]): Promise<Asset[]> {
    const searchGroups = groups || ['core', 'ai-ml', 'visuals', 'templates'];
    const results: Asset[] = [];

    for (const groupName of searchGroups) {
      try {
        const assets = await this.getGroupAssets(groupName as any);
        const matched = assets.filter(asset => 
          asset.name.toLowerCase().includes(query.toLowerCase())
        );
        results.push(...matched);
      } catch (error) {
        console.warn(`그룹 ${groupName} 검색 중 오류:`, error);
      }
    }

    return results;
  }

  /**
   * 그룹별 통계
   */
  async getGroupStats(): Promise<Record<string, { count: number; totalSize: number }>> {
    const stats: Record<string, { count: number; totalSize: number }> = {};
    const groups = ['core', 'ai-ml', 'visuals', 'templates'];

    for (const group of groups) {
      try {
        const assets = await this.getGroupAssets(group as any);
        stats[group] = {
          count: assets.length,
          totalSize: assets.reduce((sum, asset) => sum + (asset.size || 0), 0)
        };
      } catch (error) {
        stats[group] = { count: 0, totalSize: 0 };
      }
    }

    return stats;
  }

  /**
   * Asset 유효성 검증
   */
  async validateAsset(asset: Asset): Promise<boolean> {
    try {
      const stats = await fs.stat(asset.path);
      if (!stats.isFile()) return false;

      if (asset.type === 'svg') {
        const content = await fs.readFile(asset.path, 'utf-8');
        return content.includes('<svg') && content.includes('</svg>');
      }

      if (asset.type === 'json') {
        const content = await fs.readFile(asset.path, 'utf-8');
        JSON.parse(content);
        return true;
      }

      if (asset.type === 'jpg') {
        const buffer = await fs.readFile(asset.path);
        return buffer[0] === 0xFF && buffer[1] === 0xD8; // JPEG signature
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * 프로젝트용 Asset 번들 생성
   */
  async createBundle(groups: string[], outputPath: string): Promise<void> {
    const bundle: Record<string, Asset[]> = {};

    for (const groupName of groups) {
      const assets = await this.getGroupAssets(groupName as any);
      bundle[groupName] = assets;
    }

    const bundleData = {
      created: new Date().toISOString(),
      groups: bundle,
      totalAssets: Object.values(bundle).reduce((sum, assets) => sum + assets.length, 0)
    };

    await fs.writeFile(outputPath, JSON.stringify(bundleData, null, 2));
  }
}

// 편의 함수들
export const createAssetLoader = (basePath?: string) => new AssetLoader(basePath);

export const loadCoreAssets = async (basePath?: string): Promise<Asset[]> => {
  const loader = new AssetLoader(basePath);
  return loader.getCoreAssets();
};

export const loadAIMLAssets = async (basePath?: string): Promise<Asset[]> => {
  const loader = new AssetLoader(basePath);
  return loader.getAIMLAssets();
};

export default AssetLoader;