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
exports.default = EducationPage;
const react_1 = __importStar(require("react"));
const HandDrawnDiagram_1 = __importDefault(require("@/components/education/HandDrawnDiagram"));
const SQLAnimation_1 = __importDefault(require("@/components/education/SQLAnimation"));
function EducationPage() {
    const [activeView, setActiveView] = (0, react_1.useState)('rag');
    return (<div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            YouTube Educational Style Animations
          </span>
        </h1>

        <p className="text-center text-gray-400 mb-8 text-lg">
          Hand-drawn style technical education videos like popular YouTube channels
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveView('rag')} className={`px-6 py-3 rounded-lg font-bold transition-all text-lg ${activeView === 'rag'
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`} style={{ fontFamily: 'Kalam, Comic Sans MS, cursive' }}>
            RAG System Explanation
          </button>
          <button onClick={() => setActiveView('sql')} className={`px-6 py-3 rounded-lg font-bold transition-all text-lg ${activeView === 'sql'
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`} style={{ fontFamily: 'Kalam, Comic Sans MS, cursive' }}>
            SQL Database Query
          </button>
        </div>

        {/* Content Container */}
        <div className="flex justify-center">
          {activeView === 'rag' ? (<div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4 text-center text-green-400" style={{ fontFamily: 'Kalam, cursive' }}>
                How RAG Works - Employee Handbook Example
              </h2>
              <HandDrawnDiagram_1.default />
              <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-green-400">Key Concepts:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>📄 <strong>PDF Documents:</strong> Source of truth (Employee Handbook)</li>
                  <li>🗄️ <strong>Vector Database:</strong> Stores embedded document chunks</li>
                  <li>🔍 <strong>Similarity Search:</strong> Finds relevant information</li>
                  <li>💬 <strong>Natural Questions:</strong> Users ask in plain language</li>
                  <li>🤖 <strong>AI Response:</strong> Context-aware answers based on documents</li>
                </ul>
              </div>
            </div>) : (<div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-400" style={{ fontFamily: 'Kalam, cursive' }}>
                SQL Database Similarity Search Visualization
              </h2>
              <SQLAnimation_1.default />
              <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-blue-400">What's Happening:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>🗂️ <strong>Structured Data:</strong> Tables with id, title, content columns</li>
                  <li>🔎 <strong>LIKE Operator:</strong> Pattern matching in SQL queries</li>
                  <li>🎯 <strong>Similarity Search:</strong> Finding documents with matching keywords</li>
                  <li>✅ <strong>Results:</strong> Returns rows matching search criteria</li>
                  <li>📊 <strong>OR Condition:</strong> Matches multiple search patterns</li>
                </ul>
              </div>
            </div>)}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-green-500/20">
            <h3 className="text-xl font-bold mb-3 text-green-400" style={{ fontFamily: 'Kalam, cursive' }}>
              Hand-Drawn Style
            </h3>
            <p className="text-gray-400">
              Authentic YouTube education channel aesthetic with hand-written fonts and sketchy animations
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-blue-500/20">
            <h3 className="text-xl font-bold mb-3 text-blue-400" style={{ fontFamily: 'Kalam, cursive' }}>
              Step-by-Step Animation
            </h3>
            <p className="text-gray-400">
              Progressive reveal of concepts with smooth transitions and timing control
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-purple-500/20">
            <h3 className="text-xl font-bold mb-3 text-purple-400" style={{ fontFamily: 'Kalam, cursive' }}>
              Technical Accuracy
            </h3>
            <p className="text-gray-400">
              Real technical concepts explained visually with accurate representations
            </p>
          </div>
        </div>

        {/* YouTube Style Tips */}
        <div className="mt-12 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Kalam, cursive' }}>
            🎥 YouTube Education Video Style Elements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl mb-2">✏️</div>
              <p className="text-sm text-gray-300">Hand-drawn Graphics</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎨</div>
              <p className="text-sm text-gray-300">Bright Colors on Dark</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-sm text-gray-300">Timed Reveals</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔤</div>
              <p className="text-sm text-gray-300">Casual Handwriting</p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
