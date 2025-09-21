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
exports.default = ScenarioDetailPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const scenarioApi = __importStar(require("@/lib/scenario-api"));
function ScenarioDetailPage() {
    const params = (0, navigation_1.useParams)();
    const router = (0, navigation_1.useRouter)();
    const [scenario, setScenario] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (params.id) {
            fetchScenario();
        }
    }, [params.id]);
    const fetchScenario = async () => {
        try {
            const data = await scenarioApi.getScenario(params.id);
            setScenario(data);
        }
        catch (error) {
            console.error('Failed to fetch scenario:', error);
            router.push('/dashboard/scenarios');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if (confirm('정말로 이 시나리오를 삭제하시겠습니까?')) {
            try {
                await scenarioApi.deleteScenario(params.id);
                if (scenario?.projectId) {
                    router.push(`/dashboard/projects/${scenario.projectId}`);
                }
                else {
                    router.push('/dashboard/scenarios');
                }
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
    if (!scenario) {
        return (<div className="text-center py-12">
        <p className="text-gray-500">시나리오를 찾을 수 없습니다</p>
        <link_1.default href="/dashboard/scenarios" className="mt-4 text-primary-600 hover:text-primary-700">
          시나리오 목록으로 돌아가기
        </link_1.default>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <link_1.default href={scenario.projectId ? `/dashboard/projects/${scenario.projectId}` : '/dashboard/scenarios'} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
          {scenario.project ? scenario.project.title : '시나리오 목록'}
        </link_1.default>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{scenario.title}</h1>
            <p className="text-gray-600 mt-2">{scenario.description || '설명이 없습니다'}</p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => router.push(`/dashboard/scenarios/${scenario.id}/edit`)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
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

      {/* Scenario Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">시나리오 정보</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">총 장면 수</p>
            <p className="font-medium flex items-center">
              <lucide_react_1.Layers className="w-4 h-4 mr-1"/>
              {scenario.sceneCount || 0}개
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">총 재생 시간</p>
            <p className="font-medium flex items-center">
              <lucide_react_1.Clock className="w-4 h-4 mr-1"/>
              {scenario.totalDuration || 0}초
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">타입</p>
            <p className="font-medium">
              {scenario.type === 'USER_INPUT' ? '사용자 작성' :
            scenario.type === 'AUTO_GENERATED' ? 'AI 생성' : '하이브리드'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">상태</p>
            <p className="font-medium">
              <span className={`px-2 py-1 rounded-full text-sm ${scenario.isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {scenario.isDraft ? '초안' : '게시됨'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Scenes */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">장면 구성</h2>
        <div className="space-y-4">
          {scenario.scenes && scenario.scenes.map((scene, index) => (<div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">
                  장면 {index + 1}: {scene.title || '제목 없음'}
                </h3>
                <span className="text-sm text-gray-500">
                  <lucide_react_1.Clock className="w-3 h-3 inline mr-1"/>
                  {scene.duration}초
                </span>
              </div>
              <p className="text-gray-600 text-sm">{scene.content}</p>
              {scene.visualType && (<div className="mt-2 text-xs text-gray-500">
                  시각 타입: {scene.visualType}
                </div>)}
            </div>))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => router.push(`/dashboard/videos/generate?scenarioId=${scenario.id}`)} className="flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            <lucide_react_1.Play className="w-5 h-5 mr-2"/>
            비디오 생성
          </button>
          
          <button onClick={() => router.push(`/dashboard/scenarios/${scenario.id}/edit`)} className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            <lucide_react_1.Edit className="w-5 h-5 mr-2"/>
            시나리오 수정
          </button>
          
          <button onClick={() => navigator.clipboard.writeText(JSON.stringify(scenario.scenes, null, 2))} className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <lucide_react_1.FileText className="w-5 h-5 mr-2"/>
            JSON 복사
          </button>
        </div>
      </div>
    </div>);
}
