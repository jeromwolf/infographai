"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardContent = exports.CardTitle = exports.CardHeader = exports.Card = void 0;
const react_1 = __importDefault(require("react"));
const Card = ({ children, className = '' }) => (<div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
    {children}
  </div>);
exports.Card = Card;
const CardHeader = ({ children, className = '' }) => (<div className={`p-6 pb-3 ${className}`}>
    {children}
  </div>);
exports.CardHeader = CardHeader;
const CardTitle = ({ children, className = '' }) => (<h3 className={`text-xl font-semibold ${className}`}>
    {children}
  </h3>);
exports.CardTitle = CardTitle;
const CardContent = ({ children, className = '' }) => (<div className={`p-6 pt-3 ${className}`}>
    {children}
  </div>);
exports.CardContent = CardContent;
