'use client';
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
exports.default = ScenariosPage;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const scenarioApi = __importStar(require("@/lib/scenario-api"));
function ScenariosPage() {
    const router = (0, navigation_1.useRouter)();
    const [scenarios, setScenarios] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        fetchScenarios();
    }, []);
    const fetchScenarios = async () => {
        try {
            const response = await scenarioApi.getScenarios();
            const scenarioList = response?.scenarios || response || [];
            setScenarios(Array.isArray(scenarioList) ? scenarioList : []);
        }
        catch (error) {
            console.error('Failed to fetch scenarios:', error);
            setScenarios([]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteScenario = async (id) => {
        if (confirm('정말로 이 시나리오를 삭제하시겠습니까?')) {
            try {
                await scenarioApi.deleteScenario(id);
                fetchScenarios();
            }
            catch (error) {
                console.error('Failed to delete scenario:', error);
            }
        }
    };
    if (loading) {
        return (<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">시나리오</h1>
          <link_1.default href="/dashboard/scenarios/new" className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            <lucide_react_1.Plus className="w-5 h-5 mr-2"/>
            새 시나리오
          </link_1.default>
        </div>

        {scenarios.length === 0 ? (<div className="text-center py-12 bg-white rounded-lg shadow">
            <lucide_react_1.FileText className="mx-auto h-12 w-12 text-gray-400 mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">시나리오가 없습니다</h3>
            <p className="text-gray-500 mb-4">첫 번째 시나리오를 작성해보세요</p>
            <link_1.default href="/dashboard/scenarios/new" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              시나리오 작성하기
            </link_1.default>
          </div>) : (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (<div key={scenario.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/scenarios/${scenario.id}`)}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{scenario.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/scenarios/${scenario.id}`);
                }} className="text-gray-500 hover:text-primary-600">
                        <lucide_react_1.Eye className="w-5 h-5"/>
                      </button>
                      <button onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteScenario(scenario.id);
                }} className="text-gray-500 hover:text-red-600">
                        <lucide_react_1.Trash2 className="w-5 h-5"/>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{scenario.description || '설명이 없습니다'}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <lucide_react_1.Layers className="w-4 h-4 mr-2"/>
                      장면: {scenario.sceneCount || 0}개
                    </div>
                    <div className="flex items-center">
                      <lucide_react_1.Clock className="w-4 h-4 mr-2"/>
                      총 {scenario.totalDuration || 0}초
                    </div>
                  </div>
                  
                  {scenario.project && (<div className="mt-4 pt-4 border-t">
                      <link_1.default href={`/dashboard/projects/${scenario.projectId}`} onClick={(e) => e.stopPropagation()} className="text-sm text-primary-600 hover:text-primary-700">
                        프로젝트: {scenario.project.title}
                      </link_1.default>
                    </div>)}
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
}
