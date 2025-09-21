"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepFlow = void 0;
const react_1 = __importDefault(require("react"));
const remotion_1 = require("remotion");
const StepFlow = ({ steps, orientation = 'horizontal', stepColor = '#e0e0e0', lineColor = '#ccc', activeColor = '#667eea', animated = true }) => {
    const frame = (0, remotion_1.useCurrentFrame)();
    const animationDuration = 30; // frames per step
    const activeStepIndex = animated
        ? Math.floor((0, remotion_1.interpolate)(frame, [0, steps.length * animationDuration], [0, steps.length], { extrapolateRight: 'clamp' }))
        : steps.length;
    const isHorizontal = orientation === 'horizontal';
    return (<div style={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            padding: 20
        }}>
      {steps.map((step, index) => {
            const isActive = index < activeStepIndex;
            const isCurrentlyAnimating = index === activeStepIndex - 1;
            const stepOpacity = isActive ? 1 : 0.4;
            const scaleAnimation = isCurrentlyAnimating
                ? (0, remotion_1.interpolate)(frame - (index * animationDuration), [0, 20], [0.8, 1], { extrapolateRight: 'clamp' })
                : 1;
            return (<react_1.default.Fragment key={step.id}>
            <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: stepOpacity,
                    transform: `scale(${scaleAnimation})`,
                    transition: 'opacity 0.3s ease'
                }}>
              {/* Step Circle */}
              <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: isActive ? activeColor : stepColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? '#fff' : '#666',
                    fontSize: 24,
                    fontWeight: 'bold',
                    border: `3px solid ${isActive ? activeColor : stepColor}`,
                    fontFamily: 'AppleSDGothicNeo, sans-serif'
                }}>
                {step.icon || (index + 1)}
              </div>
              
              {/* Step Title */}
              <div style={{
                    marginTop: 10,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: isActive ? '#333' : '#999',
                    textAlign: 'center',
                    maxWidth: 120,
                    fontFamily: 'AppleSDGothicNeo, sans-serif'
                }}>
                {step.title}
              </div>
              
              {/* Step Description */}
              {step.description && (<div style={{
                        marginTop: 5,
                        fontSize: 12,
                        color: isActive ? '#666' : '#aaa',
                        textAlign: 'center',
                        maxWidth: 120,
                        fontFamily: 'AppleSDGothicNeo, sans-serif'
                    }}>
                  {step.description}
                </div>)}
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (<div style={{
                        width: isHorizontal ? 80 : 2,
                        height: isHorizontal ? 2 : 60,
                        backgroundColor: isActive ? activeColor : lineColor,
                        margin: isHorizontal ? '0 10px' : '10px 0',
                        marginTop: isHorizontal ? -40 : 0,
                        opacity: isActive ? 1 : 0.3,
                        transition: 'all 0.3s ease'
                    }}/>)}
          </react_1.default.Fragment>);
        })}
    </div>);
};
exports.StepFlow = StepFlow;
