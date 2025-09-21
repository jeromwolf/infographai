"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedText = void 0;
const react_1 = __importDefault(require("react"));
const remotion_1 = require("remotion");
const AnimatedText = ({ text, fontSize = 48, color = '#ffffff', fontFamily = 'AppleSDGothicNeo, sans-serif', animation = 'fadeIn', delay = 0 }) => {
    const frame = (0, remotion_1.useCurrentFrame)();
    const getAnimationStyle = () => {
        const adjustedFrame = Math.max(0, frame - delay);
        switch (animation) {
            case 'fadeIn':
                const opacity = (0, remotion_1.interpolate)(adjustedFrame, [0, 30], [0, 1], {
                    extrapolateRight: 'clamp'
                });
                return { opacity };
            case 'slideUp':
                const translateY = (0, remotion_1.interpolate)(adjustedFrame, [0, 30], [50, 0], {
                    extrapolateRight: 'clamp'
                });
                const slideOpacity = (0, remotion_1.interpolate)(adjustedFrame, [0, 20], [0, 1], {
                    extrapolateRight: 'clamp'
                });
                return {
                    transform: `translateY(${translateY}px)`,
                    opacity: slideOpacity
                };
            case 'typewriter':
                const charCount = Math.floor((0, remotion_1.interpolate)(adjustedFrame, [0, 60], [0, text.length], {
                    extrapolateRight: 'clamp'
                }));
                return {
                    width: `${charCount}ch`,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                };
            case 'bounce':
                const bounceY = (0, remotion_1.interpolate)(adjustedFrame, [0, 10, 20, 30], [0, -20, 0, -5], {
                    extrapolateRight: 'clamp'
                });
                const bounceOpacity = (0, remotion_1.interpolate)(adjustedFrame, [0, 10], [0, 1], {
                    extrapolateRight: 'clamp'
                });
                return {
                    transform: `translateY(${bounceY}px)`,
                    opacity: bounceOpacity
                };
            default:
                return {};
        }
    };
    return (<div style={{
            fontSize,
            color,
            fontFamily,
            fontWeight: 'bold',
            textAlign: 'center',
            ...getAnimationStyle()
        }}>
      {animation === 'typewriter' ? text : text}
    </div>);
};
exports.AnimatedText = AnimatedText;
