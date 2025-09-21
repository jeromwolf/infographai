/**
 * Art Adapter - 예술적 컴포넌트와 기존 시스템 간의 브리지
 * 사이드이펙트 없이 기존 CanvasElement 형식과 호환
 */
interface CanvasElement {
    id: string;
    type: 'text' | 'rect' | 'circle' | 'arrow' | 'image' | 'line' | 'group';
    x: number;
    y: number;
    props: any;
    animation?: any;
    locked?: boolean;
    visible?: boolean;
    groupId?: string;
    children?: string[];
}
export interface ArtElement {
    type: 'generative' | 'particle' | '3d' | 'shader' | 'fractal' | 'wave';
    render: () => HTMLCanvasElement | SVGElement;
    toDataURL?: () => string;
    getConfig?: () => any;
}
export declare class ArtAdapter {
    private static generateId;
    /**
     * 아트 요소를 기존 Canvas Element로 변환
     */
    static convertToCanvasElement(artElement: ArtElement): CanvasElement;
    /**
     * 비디오 생성시 Sharp와 호환되는 Buffer로 변환
     */
    static toSharpCompatible(artElement: ArtElement): Promise<Buffer>;
    /**
     * Canvas Element가 아트 요소인지 확인
     */
    static isArtElement(element: CanvasElement): boolean;
    /**
     * 아트 요소의 설정 업데이트
     */
    static updateArtConfig(element: CanvasElement, config: any): CanvasElement;
    /**
     * 성능 측정 래퍼
     */
    static measurePerformance<T>(name: string, operation: () => T): T;
}
/**
 * 아트 요소 품질 설정
 */
export declare class ArtConfig {
    private static quality;
    private static maxParticles;
    private static enableShaders;
    private static enable3D;
    static setQuality(quality: 'low' | 'medium' | 'high'): void;
    static getConfig(): {
        quality: "high" | "medium" | "low";
        maxParticles: number;
        enableShaders: boolean;
        enable3D: boolean;
    };
}
export {};
//# sourceMappingURL=art-adapter.d.ts.map