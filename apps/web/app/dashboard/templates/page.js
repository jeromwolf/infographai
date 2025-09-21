"use client";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TemplatesPage;
const react_1 = __importStar(require("react"));
const NetworkTemplate_1 = __importDefault(require("@/components/templates/NetworkTemplate"));
const ProcessFlowTemplate_1 = __importDefault(require("@/components/templates/ProcessFlowTemplate"));
const ComparisonTemplate_1 = __importDefault(require("@/components/templates/ComparisonTemplate"));
const HandDrawnDiagram_1 = __importDefault(require("@/components/education/HandDrawnDiagram"));
const SQLAnimation_1 = __importDefault(require("@/components/education/SQLAnimation"));
function TemplatesPage() {
    const [activeTemplate, setActiveTemplate] = (0, react_1.useState)('network');
    const templates = [
        { id: 'network', name: 'Network Architecture', icon: '🌐' },
        { id: 'process', name: 'Process Flow', icon: '📊' },
        { id: 'comparison', name: 'Comparison', icon: '⚖️' },
        { id: 'rag', name: 'RAG System', icon: '🤖' },
        { id: 'sql', name: 'SQL Database', icon: '🗄️' },
    ];
    return (<div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              KodeKloud Style Templates
            </span>
          </h1>
          <p className="text-xl text-gray-400" style={{ fontFamily: 'Kalam, cursive' }}>
            Professional educational animation templates - Ready to use!
          </p>
        </div>

        {/* Template Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {templates.map(template => (<button key={template.id} onClick={() => setActiveTemplate(template.id)} className={`px-6 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${activeTemplate === template.id
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg shadow-green-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`} style={{ fontFamily: 'Kalam, cursive' }}>
              <span className="text-2xl mr-2">{template.icon}</span>
              {template.name}
            </button>))}
        </div>

        {/* Template Display */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
          {activeTemplate === 'network' && (<div>
              <h2 className="text-3xl font-bold mb-4 text-green-400" style={{ fontFamily: 'Kalam, cursive' }}>
                Network Architecture Template
              </h2>
              <p className="text-gray-400 mb-6">
                Perfect for explaining system architecture, microservices, and network topology
              </p>
              <NetworkTemplate_1.default title="Microservices Architecture" nodes={[
                { id: '1', label: 'User', type: 'client' },
                { id: '2', label: 'API Gateway', type: 'server' },
                { id: '3', label: 'Auth Service', type: 'server' },
                { id: '4', label: 'User Service', type: 'server' },
                { id: '5', label: 'Order Service', type: 'server' },
                { id: '6', label: 'Database', type: 'database' },
                { id: '7', label: 'Cache', type: 'database' },
            ]} connections={[
                { from: '1', to: '2', label: 'HTTPS' },
                { from: '2', to: '3', label: 'Auth' },
                { from: '2', to: '4' },
                { from: '2', to: '5' },
                { from: '3', to: '6' },
                { from: '4', to: '6' },
                { from: '5', to: '6' },
                { from: '4', to: '7', label: 'Cache' },
            ]} theme="dark" animate={true}/>
            </div>)}

          {activeTemplate === 'process' && (<div>
              <h2 className="text-3xl font-bold mb-4 text-blue-400" style={{ fontFamily: 'Kalam, cursive' }}>
                Process Flow Template
              </h2>
              <p className="text-gray-400 mb-6">
                Ideal for showing step-by-step processes, algorithms, and workflows
              </p>
              <ProcessFlowTemplate_1.default title="CI/CD Pipeline" steps={[
                { id: '1', title: 'Code Push', icon: 'start', description: 'Developer pushes code' },
                { id: '2', title: 'Build', icon: 'process', description: 'Compile & package' },
                { id: '3', title: 'Test', icon: 'process', description: 'Run unit tests' },
                { id: '4', title: 'Quality Gate', icon: 'decision', description: 'Pass/Fail', highlight: true },
                { id: '5', title: 'Deploy', icon: 'process', description: 'Deploy to server' },
                { id: '6', title: 'Monitor', icon: 'data', description: 'Track metrics' },
                { id: '7', title: 'Complete', icon: 'end' },
            ]} showProgress={true} animationSpeed={800}/>
            </div>)}

          {activeTemplate === 'comparison' && (<div>
              <h2 className="text-3xl font-bold mb-4 text-yellow-400" style={{ fontFamily: 'Kalam, cursive' }}>
                Comparison Template
              </h2>
              <p className="text-gray-400 mb-6">
                Great for comparing technologies, approaches, or solutions
              </p>
              <ComparisonTemplate_1.default title="Docker vs Virtual Machines" leftTitle="Docker" rightTitle="Virtual Machine" leftItems={[
                { label: 'Startup Time', value: 95, color: '#4ade80', description: 'Seconds' },
                { label: 'Resource Usage', value: 30, color: '#3b82f6', description: 'Lightweight' },
                { label: 'Portability', value: 90, color: '#fbbf24', description: 'Excellent' },
                { label: 'Isolation', value: 70, color: '#ef4444', description: 'Process level' },
            ]} rightItems={[
                { label: 'Startup Time', value: 40, color: '#4ade80', description: 'Minutes' },
                { label: 'Resource Usage', value: 80, color: '#3b82f6', description: 'Heavy' },
                { label: 'Portability', value: 60, color: '#fbbf24', description: 'Good' },
                { label: 'Isolation', value: 95, color: '#ef4444', description: 'Complete' },
            ]} showVersus={true} animate={true}/>
            </div>)}

          {activeTemplate === 'rag' && (<div>
              <h2 className="text-3xl font-bold mb-4 text-purple-400" style={{ fontFamily: 'Kalam, cursive' }}>
                RAG System Template
              </h2>
              <p className="text-gray-400 mb-6">
                Retrieval-Augmented Generation explained visually
              </p>
              <HandDrawnDiagram_1.default theme="dark" animationSpeed={1}/>
            </div>)}

          {activeTemplate === 'sql' && (<div>
              <h2 className="text-3xl font-bold mb-4 text-cyan-400" style={{ fontFamily: 'Kalam, cursive' }}>
                SQL Database Template
              </h2>
              <p className="text-gray-400 mb-6">
                Database operations and query visualization
              </p>
              <SQLAnimation_1.default />
            </div>)}
        </div>

        {/* Template Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-green-500/20">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-bold mb-2 text-green-400">Hand-Drawn Style</h3>
            <p className="text-gray-400 text-sm">
              Authentic KodeKloud aesthetic with organic lines
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-blue-500/20">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="text-lg font-bold mb-2 text-blue-400">Animated</h3>
            <p className="text-gray-400 text-sm">
              Progressive reveal with smooth transitions
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-yellow-500/20">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-bold mb-2 text-yellow-400">Customizable</h3>
            <p className="text-gray-400 text-sm">
              Easy to modify colors, text, and layouts
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-purple-500/20">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-bold mb-2 text-purple-400">Responsive</h3>
            <p className="text-gray-400 text-sm">
              Works on all screen sizes and devices
            </p>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-center text-green-400" style={{ fontFamily: 'Kalam, cursive' }}>
            How to Use These Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <h4 className="font-bold mb-2">Choose Template</h4>
              <p className="text-gray-400 text-sm">
                Select the template that fits your content
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <h4 className="font-bold mb-2">Customize Data</h4>
              <p className="text-gray-400 text-sm">
                Modify text, colors, and animations
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <h4 className="font-bold mb-2">Export Video</h4>
              <p className="text-gray-400 text-sm">
                Save as MP4 or GIF for YouTube
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
