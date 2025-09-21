'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EnhancedScenarioEditor;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const aiPromptTemplates = [
    {
        id: 'educational',
        name: '교육용 콘텐츠',
        icon: lucide_react_1.BookOpen,
        description: 'IT 개념을 쉽게 설명하는 교육 영상',
        prompt: '주제를 입력해 주세요 (예: React Hooks, Docker, REST API)'
    },
    {
        id: 'tutorial',
        name: '실습 튜토리얼',
        icon: lucide_react_1.Target,
        description: '단계별 실습 가이드 영상',
        prompt: '튜토리얼 주제와 난이도를 입력해 주세요'
    },
    {
        id: 'comparison',
        name: '기술 비교',
        icon: lucide_react_1.Layers,
        description: '여러 기술을 비교 분석하는 영상',
        prompt: '비교할 기술들을 입력해 주세요 (예: React vs Vue vs Angular)'
    },
    {
        id: 'architecture',
        name: '시스템 설계',
        icon: lucide_react_1.Grid,
        description: '아키텍처와 시스템 설계 설명',
        prompt: '설명할 시스템이나 아키텍처를 입력해 주세요'
    }
];
function EnhancedScenarioEditor() {
    const [scenes, setScenes] = (0, react_1.useState)([]);
    const [selectedScene, setSelectedScene] = (0, react_1.useState)(null);
    const [activeTab, setActiveTab] = (0, react_1.useState)('script');
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const [showAIPanel, setShowAIPanel] = (0, react_1.useState)(true);
    const [aiInput, setAiInput] = (0, react_1.useState)('');
    const [selectedTemplate, setSelectedTemplate] = (0, react_1.useState)(aiPromptTemplates[0]);
    const [projectTitle, setProjectTitle] = (0, react_1.useState)('');
    const [targetAudience, setTargetAudience] = (0, react_1.useState)('개발자 및 IT 전문가');
    const [duration, setDuration] = (0, react_1.useState)(120);
    // AI로 대본 생성
    const generateWithAI = async () => {
        if (!aiInput.trim()) {
            alert('주제를 입력해주세요.');
            return;
        }
        setIsGenerating(true);
        try {
            // API 호출 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 2000));
            // 생성된 시나리오 예제
            const generatedScenes = [
                {
                    id: 'scene_1',
                    type: 'intro',
                    duration: 5,
                    title: aiInput,
                    narration: `안녕하세요! 오늘은 ${aiInput}에 대해 알아보겠습니다. 이 영상을 통해 핵심 개념과 실제 활용 방법을 익히실 수 있습니다.`,
                    visuals: {
                        style: 'modern-gradient',
                        animation: 'fade-in'
                    }
                },
                {
                    id: 'scene_2',
                    type: 'content',
                    duration: 20,
                    title: '핵심 개념',
                    narration: `${aiInput}의 핵심 개념부터 살펴보겠습니다. 이는 현대 개발에서 매우 중요한 부분으로, 효율적인 개발을 가능하게 합니다.`,
                    visuals: {
                        style: 'diagram',
                        animation: 'slide-in'
                    }
                },
                {
                    id: 'scene_3',
                    type: 'example',
                    duration: 25,
                    title: '실제 예제',
                    narration: `이제 실제 코드를 통해 ${aiInput}를 어떻게 구현하는지 알아보겠습니다. 다음 예제를 주목해주세요.`,
                    visuals: {
                        style: 'code-editor',
                        animation: 'typewriter'
                    }
                },
                {
                    id: 'scene_4',
                    type: 'conclusion',
                    duration: 10,
                    title: '마무리',
                    narration: `지금까지 ${aiInput}에 대해 알아보았습니다. 이 개념을 실제 프로젝트에 적용하여 더 나은 결과를 만들어보세요!`,
                    visuals: {
                        style: 'summary',
                        animation: 'fade-out'
                    }
                }
            ];
            setScenes(generatedScenes);
            setSelectedScene(generatedScenes[0]);
            setProjectTitle(`${aiInput} 완벽 가이드`);
        }
        catch (error) {
            console.error('AI 생성 실패:', error);
            alert('AI 생성 중 오류가 발생했습니다.');
        }
        finally {
            setIsGenerating(false);
        }
    };
    // 씬 추가
    const addScene = () => {
        const newScene = {
            id: `scene_${Date.now()}`,
            type: 'content',
            duration: 10,
            title: '새 씬',
            narration: '',
            visuals: {}
        };
        setScenes([...scenes, newScene]);
        setSelectedScene(newScene);
    };
    // 씬 삭제
    const deleteScene = (sceneId) => {
        setScenes(scenes.filter(s => s.id !== sceneId));
        if (selectedScene?.id === sceneId) {
            setSelectedScene(null);
        }
    };
    // 씬 업데이트
    const updateScene = (updates) => {
        if (!selectedScene)
            return;
        const updatedScenes = scenes.map(s => s.id === selectedScene.id ? { ...s, ...updates } : s);
        setScenes(updatedScenes);
        setSelectedScene({ ...selectedScene, ...updates });
    };
    // 총 재생 시간 계산
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    return (<div className="min-h-screen bg-gray-50 flex">
      {/* 왼쪽 패널 - AI 프롬프트 */}
      <div className={`${showAIPanel ? 'w-96' : 'w-0'} transition-all duration-300 bg-white border-r overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <lucide_react_1.Sparkles className="w-5 h-5 text-yellow-500"/>
              AI 글쓰기 Pro
            </h2>
            <button onClick={() => setShowAIPanel(false)} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          {/* 템플릿 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              템플릿 선택
            </label>
            <div className="grid grid-cols-2 gap-2">
              {aiPromptTemplates.map(template => (<button key={template.id} onClick={() => setSelectedTemplate(template)} className={`p-3 rounded-lg border text-left transition-all ${selectedTemplate.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'}`}>
                  <template.icon className="w-5 h-5 mb-1 text-blue-600"/>
                  <div className="text-sm font-medium">{template.name}</div>
                </button>))}
            </div>
          </div>

          {/* 주제 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주제
            </label>
            <textarea value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder={selectedTemplate.prompt} className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          {/* 추가 옵션 */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대상 청중
              </label>
              <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full p-2 border rounded-lg">
                <option>초급 개발자</option>
                <option>개발자 및 IT 전문가</option>
                <option>일반인</option>
                <option>학생</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                목표 길이
              </label>
              <div className="flex items-center gap-2">
                <input type="range" min="30" max="300" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="flex-1"/>
                <span className="text-sm font-medium w-16 text-right">
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* AI 생성 버튼 */}
          <button onClick={generateWithAI} disabled={isGenerating} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
            {isGenerating ? (<>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"/>
                AI 글쓰기 중...
              </>) : (<>
                <lucide_react_1.Wand2 className="w-5 h-5"/>
                AI 글쓰기
              </>)}
          </button>

          {/* 품질 점수 */}
          {scenes.length > 0 && (<div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">시나리오 품질</span>
                <span className="text-lg font-bold text-green-600">85/100</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1 text-green-600">
                  <lucide_react_1.CheckCircle className="w-3 h-3"/>
                  충분한 씬 구성
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <lucide_react_1.CheckCircle className="w-3 h-3"/>
                  적절한 길이
                </div>
                <div className="flex items-center gap-1 text-yellow-600">
                  <lucide_react_1.AlertCircle className="w-3 h-3"/>
                  시각 자료 추가 권장
                </div>
              </div>
            </div>)}
        </div>
      </div>

      {/* 중앙 - 편집 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 상단 툴바 */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!showAIPanel && (<button onClick={() => setShowAIPanel(true)} className="p-2 hover:bg-gray-100 rounded">
                <lucide_react_1.Sparkles className="w-5 h-5"/>
              </button>)}
            <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="프로젝트 제목" className="text-xl font-bold bg-transparent focus:outline-none"/>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              총 {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
            </span>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              비디오 생성
            </button>
          </div>
        </div>

        {/* 메인 편집 영역 */}
        <div className="flex-1 flex">
          {/* 씬 목록 */}
          <div className="w-64 bg-white border-r overflow-y-auto">
            <div className="p-4 border-b">
              <button onClick={addScene} className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                + 새 씬 추가
              </button>
            </div>
            
            <div className="p-2">
              {scenes.map((scene, index) => (<div key={scene.id} onClick={() => setSelectedScene(scene)} className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${selectedScene?.id === scene.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">씬 {index + 1}</span>
                    <span className="text-xs text-gray-500">{scene.duration}초</span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">{scene.title}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{scene.narration}</div>
                </div>))}
            </div>
          </div>

          {/* 씬 편집 영역 */}
          <div className="flex-1 bg-gray-50">
            {selectedScene ? (<div className="h-full flex flex-col">
                {/* 탭 메뉴 */}
                <div className="bg-white border-b px-6 py-2 flex gap-4">
                  <button onClick={() => setActiveTab('script')} className={`px-4 py-2 font-medium transition-all ${activeTab === 'script'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'}`}>
                    <lucide_react_1.FileText className="w-4 h-4 inline mr-2"/>
                    대본
                  </button>
                  <button onClick={() => setActiveTab('visual')} className={`px-4 py-2 font-medium transition-all ${activeTab === 'visual'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'}`}>
                    <lucide_react_1.Image className="w-4 h-4 inline mr-2"/>
                    비주얼
                  </button>
                  <button onClick={() => setActiveTab('audio')} className={`px-4 py-2 font-medium transition-all ${activeTab === 'audio'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'}`}>
                    <lucide_react_1.Music className="w-4 h-4 inline mr-2"/>
                    오디오
                  </button>
                </div>

                {/* 편집 콘텐츠 */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {activeTab === 'script' && (<div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          씬 제목
                        </label>
                        <input type="text" value={selectedScene.title} onChange={(e) => updateScene({ title: e.target.value })} className="w-full p-3 border rounded-lg"/>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          나레이션
                        </label>
                        <textarea value={selectedScene.narration} onChange={(e) => updateScene({ narration: e.target.value })} className="w-full h-48 p-3 border rounded-lg resize-none" placeholder="이 씬에서 설명할 내용을 작성하세요..."/>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            씬 길이 (초)
                          </label>
                          <input type="number" value={selectedScene.duration} onChange={(e) => updateScene({ duration: Number(e.target.value) })} className="w-full p-3 border rounded-lg" min="1" max="60"/>
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            씬 타입
                          </label>
                          <select value={selectedScene.type} onChange={(e) => updateScene({ type: e.target.value })} className="w-full p-3 border rounded-lg">
                            <option value="intro">도입부</option>
                            <option value="content">본문</option>
                            <option value="example">예제</option>
                            <option value="conclusion">마무리</option>
                          </select>
                        </div>
                      </div>
                    </div>)}

                  {activeTab === 'visual' && (<div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          비주얼 스타일
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['modern-gradient', 'minimal', 'tech', 'dark', 'colorful', 'professional'].map(style => (<button key={style} onClick={() => updateScene({
                        visuals: { ...selectedScene.visuals, style }
                    })} className={`p-3 rounded-lg border text-center ${selectedScene.visuals?.style === style
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'}`}>
                              <div className="text-sm font-medium capitalize">{style}</div>
                            </button>))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          애니메이션
                        </label>
                        <select value={selectedScene.visuals?.animation || 'fade-in'} onChange={(e) => updateScene({
                    visuals: { ...selectedScene.visuals, animation: e.target.value }
                })} className="w-full p-3 border rounded-lg">
                          <option value="fade-in">페이드 인</option>
                          <option value="slide-in">슬라이드 인</option>
                          <option value="zoom-in">줌 인</option>
                          <option value="typewriter">타이프라이터</option>
                          <option value="reveal">리빌</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          배경 이미지
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <lucide_react_1.Upload className="w-12 h-12 mx-auto text-gray-400 mb-2"/>
                          <p className="text-sm text-gray-500">
                            클릭하여 이미지 업로드
                          </p>
                        </div>
                      </div>
                    </div>)}

                  {activeTab === 'audio' && (<div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          음성 스타일
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['친근한', '전문적인', '차분한', '활기찬'].map(style => (<button key={style} onClick={() => updateScene({
                        audio: { ...selectedScene.audio, voiceStyle: style }
                    })} className={`p-3 rounded-lg border text-center ${selectedScene.audio?.voiceStyle === style
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'}`}>
                              <lucide_react_1.Mic className="w-5 h-5 mx-auto mb-1 text-blue-600"/>
                              <div className="text-sm font-medium">{style}</div>
                            </button>))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          배경 음악
                        </label>
                        <select value={selectedScene.audio?.bgm || 'none'} onChange={(e) => updateScene({
                    audio: { ...selectedScene.audio, bgm: e.target.value }
                })} className="w-full p-3 border rounded-lg">
                          <option value="none">없음</option>
                          <option value="upbeat">경쾌한</option>
                          <option value="calm">차분한</option>
                          <option value="tech">테크</option>
                          <option value="corporate">기업</option>
                        </select>
                      </div>
                    </div>)}
                </div>
              </div>) : (<div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <lucide_react_1.Film className="w-16 h-16 mx-auto mb-4"/>
                  <p>씬을 선택하거나 새로 추가하세요</p>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      {/* 오른쪽 - 미리보기 */}
      <div className="w-96 bg-white border-l">
        <div className="p-4 border-b">
          <h3 className="font-bold flex items-center gap-2">
            <lucide_react_1.Play className="w-4 h-4"/>
            미리보기
          </h3>
        </div>
        
        <div className="p-4">
          <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
            <lucide_react_1.Play className="w-12 h-12 text-white opacity-50"/>
          </div>
          
          {selectedScene && (<div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-1">{selectedScene.title}</div>
                <div className="text-xs text-gray-600">{selectedScene.narration}</div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">씬 길이</span>
                <span className="font-medium">{selectedScene.duration}초</span>
              </div>
            </div>)}
        </div>
      </div>
    </div>);
}
