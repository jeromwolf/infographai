"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectValue = exports.SelectItem = exports.SelectContent = exports.SelectTrigger = exports.Select = void 0;
const react_1 = __importDefault(require("react"));
const Select = ({ children, value, onValueChange, className = '' }) => {
    return (<select value={value} onChange={(e) => onValueChange?.(e.target.value)} className={`block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}>
      {children}
    </select>);
};
exports.Select = Select;
const SelectTrigger = ({ children, className = '' }) => (<>{children}</>);
exports.SelectTrigger = SelectTrigger;
const SelectContent = ({ children }) => (<>{children}</>);
exports.SelectContent = SelectContent;
const SelectItem = ({ children, value }) => (<option value={value}>{children}</option>);
exports.SelectItem = SelectItem;
const SelectValue = ({ placeholder = '' }) => (<option value="" disabled>{placeholder}</option>);
exports.SelectValue = SelectValue;
