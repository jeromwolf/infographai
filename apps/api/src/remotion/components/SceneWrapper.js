"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneWrapper = void 0;
const react_1 = __importDefault(require("react"));
const remotion_1 = require("remotion");
const SceneWrapper = ({ backgroundColor = '#1a1a2e', children, padding = 40, style = {} }) => {
    return (<remotion_1.AbsoluteFill style={{
            backgroundColor,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding,
            ...style
        }}>
      {children}
    </remotion_1.AbsoluteFill>);
};
exports.SceneWrapper = SceneWrapper;
