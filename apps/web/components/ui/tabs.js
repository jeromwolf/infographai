"use strict";
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
exports.TabsContent = exports.TabsTrigger = exports.TabsList = exports.Tabs = void 0;
const react_1 = __importStar(require("react"));
const TabsContext = (0, react_1.createContext)({ activeTab: '', setActiveTab: () => { } });
const Tabs = ({ children, defaultValue = '', className = '' }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)(defaultValue);
    return (<TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>);
};
exports.Tabs = Tabs;
const TabsList = ({ children, className = '' }) => (<div className={`flex space-x-2 border-b dark:border-gray-700 ${className}`}>
    {children}
  </div>);
exports.TabsList = TabsList;
const TabsTrigger = ({ children, value, className = '' }) => {
    const { activeTab, setActiveTab } = (0, react_1.useContext)(TabsContext);
    const isActive = activeTab === value;
    return (<button className={`px-4 py-2 font-medium transition-colors ${isActive
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900'} ${className}`} onClick={() => setActiveTab(value)}>
      {children}
    </button>);
};
exports.TabsTrigger = TabsTrigger;
const TabsContent = ({ children, value, className = '' }) => {
    const { activeTab } = (0, react_1.useContext)(TabsContext);
    if (activeTab !== value)
        return null;
    return <div className={`mt-4 ${className}`}>{children}</div>;
};
exports.TabsContent = TabsContent;
