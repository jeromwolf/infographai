/**
 * ParticleField - 첫 번째 제너러티브 아트 컴포넌트
 * Canvas API를 사용한 파티클 애니메이션 시스템
 */
import React from 'react';
import { ArtElement } from '@/lib/art-adapter';
interface ParticleFieldProps {
    width?: number;
    height?: number;
    particleCount?: number;
    colors?: string[];
    speed?: number;
    gravity?: number;
    fadeOut?: boolean;
    interactive?: boolean;
    fallback?: React.ReactNode;
}
export declare const ParticleField: React.FC<ParticleFieldProps>;
/**
 * ArtElement 인터페이스 구현 - ArtAdapter와 통합용
 */
export declare class ParticleFieldArtElement implements ArtElement {
    type: 'particle';
    private config;
    private canvas;
    constructor(config?: ParticleFieldProps);
    render(): HTMLCanvasElement;
    toDataURL(): string;
    getConfig(): ParticleFieldProps;
}
export {};
//# sourceMappingURL=ParticleField.d.ts.map