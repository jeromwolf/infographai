"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = void 0;
const react_1 = __importDefault(require("react"));
const remotion_1 = require("remotion");
const ProgressBar = ({ progress, width = 400, height = 40, backgroundColor = '#e0e0e0', fillColor = '#667eea', animated = true, label, showPercentage = true }) => {
    const frame = (0, remotion_1.useCurrentFrame)();
    const animatedProgress = animated
        ? (0, remotion_1.interpolate)(frame, [0, 60], [0, progress], {
            extrapolateRight: 'clamp'
        })
        : progress;
    return (<div style={{ width, position: 'relative' }}>
      {label && (<div style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 8,
                color: '#333',
                fontFamily: 'AppleSDGothicNeo, sans-serif'
            }}>
          {label}
        </div>)}
      
      <div style={{
            width,
            height,
            backgroundColor,
            borderRadius: height / 2,
            overflow: 'hidden',
            position: 'relative'
        }}>
        <div style={{
            width: `${animatedProgress}%`,
            height: '100%',
            backgroundColor: fillColor,
            borderRadius: height / 2,
            transition: animated ? 'none' : 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 12
        }}>
          {showPercentage && animatedProgress > 20 && (<span style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: 'AppleSDGothicNeo, sans-serif'
            }}>
              {Math.round(animatedProgress)}%
            </span>)}
        </div>
      </div>
      
      {showPercentage && animatedProgress <= 20 && (<div style={{
                position: 'absolute',
                right: 0,
                top: label ? 28 : 0,
                height,
                display: 'flex',
                alignItems: 'center',
                paddingRight: 12
            }}>
          <span style={{
                color: '#666',
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: 'AppleSDGothicNeo, sans-serif'
            }}>
            {Math.round(animatedProgress)}%
          </span>
        </div>)}
    </div>);
};
exports.ProgressBar = ProgressBar;
