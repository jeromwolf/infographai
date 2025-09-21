"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoVideoCompositionMetadata = exports.AutoVideoComposition = void 0;
const react_1 = __importDefault(require("react"));
const remotion_1 = require("remotion");
const SceneWrapper_1 = require("./SceneWrapper");
const AnimatedText_1 = require("./AnimatedText");
const ProgressBar_1 = require("./ProgressBar");
const StepFlow_1 = require("./StepFlow");
// Scene Component Renderer
const SceneComponent = ({ scene }) => {
    const renderInfographic = () => {
        switch (scene.style.infographic) {
            case 'step-flow':
                // Parse steps from narration (simple example)
                const steps = scene.narration.split('→').map((step, index) => ({
                    id: `step-${index}`,
                    title: step.trim()
                }));
                if (steps.length > 1) {
                    return <StepFlow_1.StepFlow steps={steps} activeColor={scene.style.accentColor}/>;
                }
                break;
            case 'icon-list':
                // Parse list items from narration
                const items = scene.narration.split(',').map(item => item.trim());
                return (<div style={{ marginTop: 30 }}>
            {items.map((item, index) => (<div key={index} style={{
                            fontSize: 24,
                            color: scene.style.textColor,
                            marginBottom: 15,
                            fontFamily: 'AppleSDGothicNeo, sans-serif'
                        }}>
                • {item}
              </div>))}
          </div>);
            case 'progress-bar':
                return (<div style={{ marginTop: 40 }}>
            <ProgressBar_1.ProgressBar progress={75} fillColor={scene.style.accentColor} label="진행 상황"/>
          </div>);
            default:
                return null;
        }
    };
    return (<SceneWrapper_1.SceneWrapper backgroundColor={scene.style.backgroundColor}>
      {/* Title */}
      <AnimatedText_1.AnimatedText text={scene.title} fontSize={48} color={scene.style.textColor} animation={getAnimationType(scene.style.animation)}/>
      
      {/* Narration */}
      <div style={{
            marginTop: 30,
            fontSize: 24,
            color: scene.style.textColor,
            textAlign: 'center',
            maxWidth: '80%',
            lineHeight: 1.6,
            fontFamily: 'AppleSDGothicNeo, sans-serif'
        }}>
        {scene.narration}
      </div>
      
      {/* Infographic */}
      {renderInfographic()}
    </SceneWrapper_1.SceneWrapper>);
};
// Helper function to map animation strings
const getAnimationType = (animation) => {
    const animationMap = {
        'fadeInScale': 'fadeIn',
        'slideFromLeft': 'slideUp',
        'sequentialReveal': 'fadeIn',
        'popIn': 'bounce',
        'typewriter': 'typewriter',
        'fadeOut': 'fadeIn'
    };
    return animationMap[animation] || 'fadeIn';
};
// Calculate scene start frames
const getSceneStartFrame = (scenes, index) => {
    let startFrame = 0;
    for (let i = 0; i < index; i++) {
        startFrame += scenes[i].duration * 30; // Convert seconds to frames (30fps)
    }
    return startFrame;
};
// Main Video Composition
const AutoVideoComposition = ({ title, scenes, style }) => {
    const totalDurationInFrames = scenes.reduce((sum, scene) => sum + scene.duration * 30, 0);
    return (<remotion_1.AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene, index) => (<remotion_1.Sequence key={scene.id} from={getSceneStartFrame(scenes, index)} durationInFrames={scene.duration * 30}>
          <SceneComponent scene={scene}/>
        </remotion_1.Sequence>))}
    </remotion_1.AbsoluteFill>);
};
exports.AutoVideoComposition = AutoVideoComposition;
// Export composition metadata for Remotion
exports.AutoVideoCompositionMetadata = {
    id: 'AutoVideoComposition',
    component: exports.AutoVideoComposition,
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 900, // Default 30 seconds, will be overridden
    defaultProps: {
        title: 'Sample Video',
        scenes: []
    }
};
