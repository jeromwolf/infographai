'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScenarioNewPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const api_1 = require("@/lib/api");
const scenario_api_1 = require("@/lib/scenario-api");
function ScenarioNewContent() {
    const searchParams = (0, navigation_1.useSearchParams)();
    const router = (0, navigation_1.useRouter)();
    const projectId = searchParams.get('projectId');
    const [project, setProject] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [saving, setSaving] = (0, react_1.useState)(false);
    const [scenario, setScenario] = (0, react_1.useState)({
        title: '',
        description: '',
        projectId: projectId || '',
        scenes: [
            {
                order: 1,
                title: '',
                content: '',
                duration: 5,
                transition: 'fade'
            }
        ]
    });
    (0, react_1.useEffect)(() => {
        if (projectId) {
            fetchProject();
        }
        else {
            setLoading(false);
        }
    }, [projectId]);
    const fetchProject = async () => {
        try {
            const data = await api_1.api.getProject(projectId);
            setProject(data);
            setScenario(prev => ({
                ...prev,
                title: `${data.name || data.title} 시나리오`
            }));
        }
        catch (error) {
            console.error('Failed to fetch project:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const addScene = () => {
        setScenario(prev => ({
            ...prev,
            scenes: [
                ...prev.scenes,
                {
                    order: prev.scenes.length + 1,
                    title: '',
                    content: '',
                    duration: 5,
                    transition: 'fade'
                }
            ]
        }));
    };
    const removeScene = (index) => {
        setScenario(prev => ({
            ...prev,
            scenes: prev.scenes.filter((_, i) => i !== index).map((scene, i) => ({
                ...scene,
                order: i + 1
            }))
        }));
    };
    const updateScene = (index, field, value) => {
        setScenario(prev => ({
            ...prev,
            scenes: prev.scenes.map((scene, i) => i === index ? { ...scene, [field]: value } : scene)
        }));
    };
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // projectId 확인
            const finalProjectId = scenario.projectId || projectId;
            // 프로젝트가 없으면 먼저 생성하거나 선택하도록 안내
            if (!finalProjectId) {
                // 프로젝트 목록 가져오기
                const projects = await api_1.api.getProjects();
                if (projects && projects.length > 0) {
                    // 첫 번째 프로젝트 사용
                    scenario.projectId = projects[0].id;
                }
                else {
                    // 새 프로젝트 생성
                    const newProject = await api_1.api.createProject({
                        title: scenario.title || '새 프로젝트',
                        description: '시나리오를 위한 프로젝트',
                        topic: '일반'
                    });
                    scenario.projectId = newProject.id;
                }
            }
            // API가 기대하는 형식으로 데이터 변환
            const scenarioData = {
                projectId: scenario.projectId || finalProjectId,
                type: 'user', // 사용자가 직접 작성한 시나리오
                userContent: {
                    title: scenario.title,
                    description: scenario.description || '',
                    scenes: scenario.scenes.map(scene => ({
                        title: scene.title || `장면 ${scene.order}`,
                        content: scene.content,
                        duration: scene.duration,
                        visualType: 'text', // 기본값
                        visualPrompt: ''
                    }))
                }
            };
            console.log('Sending scenario data:', scenarioData);
            const createdScenario = await (0, scenario_api_1.createScenario)(scenarioData);
            // 생성된 시나리오 상세 페이지로 이동
            router.push(`/dashboard/scenarios/${createdScenario.id}`);
        }
        catch (error) {
            console.error('Failed to save scenario:', error);
            console.error('Error response:', error.response);
            alert(`시나리오 저장에 실패했습니다: ${error.message || '다시 시도해주세요.'}`);
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>);
    }
    return (<div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <link_1.default href={projectId ? `/dashboard/projects/${projectId}` : '/dashboard/projects'} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
          {project ? (project.name || project.title) : '프로젝트 목록'}
        </link_1.default>
        
        <h1 className="text-3xl font-bold text-gray-900">시나리오 작성</h1>
        {project && (<p className="text-gray-600 mt-2">프로젝트: {project.name || project.title}</p>)}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시나리오 제목 *
              </label>
              <input type="text" required value={scenario.title} onChange={(e) => setScenario({ ...scenario, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="시나리오 제목을 입력하세요"/>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea value={scenario.description} onChange={(e) => setScenario({ ...scenario, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="시나리오 설명을 입력하세요"/>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">장면 구성</h2>
            <button type="button" onClick={addScene} className="flex items-center px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm">
              <lucide_react_1.Plus className="w-4 h-4 mr-1"/>
              장면 추가
            </button>
          </div>
          
          {scenario.scenes.map((scene, index) => (<div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-md font-semibold">장면 {scene.order}</h3>
                {scenario.scenes.length > 1 && (<button type="button" onClick={() => removeScene(index)} className="text-red-600 hover:text-red-700">
                    <lucide_react_1.Trash2 className="w-4 h-4"/>
                  </button>)}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    장면 제목
                  </label>
                  <input type="text" value={scene.title} onChange={(e) => updateScene(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="장면 제목을 입력하세요"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    내용 *
                  </label>
                  <textarea required value={scene.content} onChange={(e) => updateScene(index, 'content', e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="장면 내용을 입력하세요"/>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      재생 시간 (초)
                    </label>
                    <input type="number" min="1" max="60" value={scene.duration} onChange={(e) => updateScene(index, 'duration', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      전환 효과
                    </label>
                    <select value={scene.transition} onChange={(e) => updateScene(index, 'transition', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                      <option value="fade">페이드</option>
                      <option value="slide">슬라이드</option>
                      <option value="zoom">줌</option>
                      <option value="none">효과 없음</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>))}
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            총 재생 시간: {scenario.scenes.reduce((acc, scene) => acc + scene.duration, 0)}초
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <link_1.default href={projectId ? `/dashboard/projects/${projectId}` : '/dashboard/projects'} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            취소
          </link_1.default>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
            {saving ? (<>
                <lucide_react_1.Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                저장 중...
              </>) : (<>
                <lucide_react_1.FileText className="w-4 h-4 mr-2"/>
                시나리오 저장
              </>)}
          </button>
        </div>
      </form>
    </div>);
}
function ScenarioNewPage() {
    return (<react_1.Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>}>
      <ScenarioNewContent />
    </react_1.Suspense>);
}
