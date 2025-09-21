"use strict";
/**
 * Korean Subtitle Processor
 * 한국어 자막 처리 핵심 모듈
 *
 * 주요 기능:
 * 1. 한글 조사 자동 처리
 * 2. 자막 타이밍 최적화
 * 3. 가독성 향상
 * 4. 키워드 강조
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./particle-processor"), exports);
__exportStar(require("./subtitle-optimizer"), exports);
__exportStar(require("./tech-terms"), exports);
__exportStar(require("./subtitle-styler"), exports);
