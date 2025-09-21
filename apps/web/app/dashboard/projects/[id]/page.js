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
exports.default = ProjectDetailPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const api_1 = require("@/lib/api");
const scenarioApi = __importStar(require("@/lib/scenario-api"));
function ProjectDetailPage() {
    const params = (0, navigation_1.useParams)();
    const router = (0, navigation_1.useRouter)();
    const [project, setProject] = (0, react_1.useState)(null);
    const [scenarios, setScenarios] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [loadingScenarios, setLoadingScenarios] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (params.id) {
            fetchProject();
            fetchScenarios();
        }
    }, [params.id]);
    const fetchProject = async () => {
        try {
            const data = await api_1.api.getProject(params.id);
            setProject(data);
        }
        catch (error) {
            console.error('Failed to fetch project:', error);
            router.push('/dashboard/projects');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchScenarios = async () => {
        try {
            const response = await scenarioApi.getScenarios(params.id);
            // API returns {scenarios: [...], pagination: {...}}
            const scenarioList = response?.scenarios || response || [];
            setScenarios(Array.isArray(scenarioList) ? scenarioList : []);
        }
        catch (error) {
            console.error('Failed to fetch scenarios:', error);
            setScenarios([]);
        }
        finally {
            setLoadingScenarios(false);
        }
    };
    const handleDelete = async () => {
        if (confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
            try {
                await api_1.api.deleteProject(params.id);
                router.push('/dashboard/projects');
            }
            catch (error) {
                console.error('Failed to delete project:', error);
            }
        }
    };
    const handleDeleteScenario = async (scenarioId) => {
        if (confirm('정말로 이 시나리오를 삭제하시겠습니까?')) {
            try {
                await scenarioApi.deleteScenario(scenarioId);
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
    if (!project) {
        return (<div className="text-center py-12">
        <p className="text-gray-500">프로젝트를 찾을 수 없습니다</p>
        <link_1.default href="/dashboard/projects" className="mt-4 text-primary-600 hover:text-primary-700">
          프로젝트 목록으로 돌아가기
        </link_1.default>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <link_1.default href="/dashboard/projects" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
          프로젝트 목록
        </link_1.default>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600 mt-2">{project.description || '설명이 없습니다'}</p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <lucide_react_1.Edit className="w-4 h-4 inline mr-2"/>
              수정
            </button>
            <button onClick={handleDelete} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
              <lucide_react_1.Trash2 className="w-4 h-4 inline mr-2"/>
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">프로젝트 정보</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">생성일</p>
            <p className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">상태</p>
            <p className="font-medium">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                활성
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">비디오 수</p>
            <p className="font-medium">{project.videoCount || 0}개</p>
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">시나리오</h2>
          <link_1.default href={`/dashboard/scenarios/new?projectId=${project.id}`} className="flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">
            <lucide_react_1.Plus className="w-4 h-4 mr-1"/>
            새 시나리오
          </link_1.default>
        </div>
        
        {loadingScenarios ? (<div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>) : scenarios.length > 0 ? (<div className="space-y-3">
            {scenarios.map((scenario) => (<div key={scenario.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{scenario.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>장면: {scenario.sceneCount || 0}개</span>
                      <span>시간: {scenario.totalDuration || 0}초</span>
                      <span>{new Date(scenario.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <link_1.default href={`/dashboard/scenarios/${scenario.id}`} className="p-2 text-gray-600 hover:text-primary-600">
                      <lucide_react_1.Eye className="w-4 h-4"/>
                    </link_1.default>
                    <button onClick={() => handleDeleteScenario(scenario.id)} className="p-2 text-red-600 hover:text-red-700">
                      <lucide_react_1.Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>))}
          </div>) : (<div className="text-center py-8">
            <p className="text-gray-500 mb-4">아직 시나리오가 없습니다</p>
            <link_1.default href={`/dashboard/scenarios/new?projectId=${project.id}`} className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              첫 시나리오 작성하기
            </link_1.default>
          </div>)}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <link_1.default href={`/dashboard/scenarios/new?projectId=${project.id}`} className="flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            <lucide_react_1.FileText className="w-5 h-5 mr-2"/>
            시나리오 작성
          </link_1.default>
          
          <link_1.default href={`/dashboard/videos/generate?projectId=${project.id}`} className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
            <lucide_react_1.Video className="w-5 h-5 mr-2"/>
            비디오 생성
          </link_1.default>
          
          <link_1.default href={`/dashboard/projects/${project.id}/analytics`} className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <lucide_react_1.Tag className="w-5 h-5 mr-2"/>
            분석 보기
          </link_1.default>
        </div>
      </div>
    </div>);
}
