"use strict";
/**
 * ParticleField - 첫 번째 제너러티브 아트 컴포넌트
 * Canvas API를 사용한 파티클 애니메이션 시스템
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleFieldArtElement = exports.ParticleField = void 0;
const react_1 = __importStar(require("react"));
exports.ParticleField = react_1.default.memo(({ width = 400, height = 300, particleCount = 100, colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#fbbf24'], speed = 1, gravity = 0, fadeOut = true, interactive = false, fallback = <div className="bg-gray-800 rounded" style={{ width, height }}>Loading particles...</div> }) => {
    const canvasRef = (0, react_1.useRef)(null);
    const animationRef = (0, react_1.useRef)();
    const particlesRef = (0, react_1.useRef)([]);
    const mouseRef = (0, react_1.useRef)({ x: 0, y: 0 });
    const [isError, setIsError] = (0, react_1.useState)(false);
    // 파티클 생성
    const createParticle = (0, react_1.useCallback)((x, y) => {
        return {
            x: x ?? Math.random() * width,
            y: y ?? Math.random() * height,
            vx: (Math.random() - 0.5) * speed * 2,
            vy: (Math.random() - 0.5) * speed * 2,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            maxLife: Math.random() * 100 + 100
        };
    }, [width, height, speed, colors]);
    // 파티클 초기화
    const initParticles = (0, react_1.useCallback)(() => {
        particlesRef.current = Array.from({ length: particleCount }, () => createParticle());
    }, [particleCount, createParticle]);
    // 파티클 업데이트
    const updateParticles = (0, react_1.useCallback)(() => {
        particlesRef.current = particlesRef.current.map(particle => {
            // 위치 업데이트
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += gravity;
            // 화면 경계 처리 (바운스)
            if (particle.x < 0 || particle.x > width) {
                particle.vx *= -0.9;
                particle.x = Math.max(0, Math.min(width, particle.x));
            }
            if (particle.y < 0 || particle.y > height) {
                particle.vy *= -0.9;
                particle.y = Math.max(0, Math.min(height, particle.y));
            }
            // 생명 감소
            if (fadeOut) {
                particle.life -= 1 / particle.maxLife;
                // 죽은 파티클 재생성
                if (particle.life <= 0) {
                    return createParticle();
                }
            }
            // 인터랙티브 모드 - 마우스 반응
            if (interactive && mouseRef.current.x && mouseRef.current.y) {
                const dx = particle.x - mouseRef.current.x;
                const dy = particle.y - mouseRef.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += dx * force * 0.02;
                    particle.vy += dy * force * 0.02;
                }
            }
            return particle;
        });
    }, [width, height, gravity, fadeOut, interactive, createParticle]);
    // 렌더링
    const render = (0, react_1.useCallback)(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // 배경 클리어 (페이드 효과)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        // 파티클 그리기
        particlesRef.current.forEach(particle => {
            ctx.save();
            // 글로우 효과
            ctx.shadowBlur = 10;
            ctx.shadowColor = particle.color;
            // 파티클 그리기
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = fadeOut ? particle.life : 1;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        // 연결선 그리기 (가까운 파티클끼리)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particlesRef.current.length; i++) {
            for (let j = i + 1; j < particlesRef.current.length; j++) {
                const p1 = particlesRef.current[i];
                const p2 = particlesRef.current[j];
                const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                if (distance < 50) {
                    ctx.globalAlpha = (50 - distance) / 50 * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }, [width, height, fadeOut]);
    // 애니메이션 루프
    const animate = (0, react_1.useCallback)(() => {
        updateParticles();
        render();
        animationRef.current = requestAnimationFrame(animate);
    }, [updateParticles, render]);
    // 마우스 이벤트 핸들러
    const handleMouseMove = (0, react_1.useCallback)((e) => {
        if (!interactive)
            return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    }, [interactive]);
    // 초기화 및 애니메이션 시작
    (0, react_1.useEffect)(() => {
        try {
            initParticles();
            animate();
            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }
        catch (error) {
            console.error('Particle system failed:', error);
            setIsError(true);
        }
    }, [initParticles, animate]);
    if (isError) {
        return <>{fallback}</>;
    }
    return (<canvas ref={canvasRef} width={width} height={height} onMouseMove={handleMouseMove} className="rounded-lg" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            cursor: interactive ? 'crosshair' : 'default'
        }}/>);
});
exports.ParticleField.displayName = 'ParticleField';
/**
 * ArtElement 인터페이스 구현 - ArtAdapter와 통합용
 */
class ParticleFieldArtElement {
    type = 'particle';
    config;
    canvas;
    constructor(config = {}) {
        this.config = config;
        this.canvas = document.createElement('canvas');
        this.canvas.width = config.width || 400;
        this.canvas.height = config.height || 300;
    }
    render() {
        // 정적 스냅샷 렌더링
        const ctx = this.canvas.getContext('2d');
        if (!ctx)
            return this.canvas;
        const { width = 400, height = 300, particleCount = 100, colors = ['#06b6d4'] } = this.config;
        // 배경
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
        // 파티클 그리기 (정적)
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 3 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.random() * 0.8 + 0.2;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        return this.canvas;
    }
    toDataURL() {
        return this.canvas.toDataURL();
    }
    getConfig() {
        return this.config;
    }
}
exports.ParticleFieldArtElement = ParticleFieldArtElement;
