"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const react_1 = __importDefault(require("react"));
const Progress = ({ value = 0, max = 100, className = '' }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (<div className={`w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 ${className}`}>
      <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}/>
    </div>);
};
exports.Progress = Progress;
