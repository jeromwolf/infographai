"use strict";
/**
 * 시나리오 편집기 컴포넌트
 */
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
exports.default = ScenarioEditor;
const react_1 = __importStar(require("react"));
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const badge_1 = require("@/components/ui/badge");
const select_1 = require("@/components/ui/select");
const tabs_1 = require("@/components/ui/tabs");
const accordion_1 = require("@/components/ui/accordion");
const separator_1 = require("@/components/ui/separator");
const use_toast_1 = require("@/components/ui/use-toast");
const lucide_react_1 = require("lucide-react");
function ScenarioEditor({ scenarioId, projectId, onSave, onCancel }) {
    const [scenario, setScenario] = (0, react_1.useState)({
        title: '',
        description: '',
        type: 'user',
        scenes: [],
        metadata: {
            language: 'ko',
            targetAudience: 'intermediate',
            style: 'educational'
        }
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [activeTab, setActiveTab] = (0, react_1.useState)('edit');
    const [selectedSceneIndex, setSelectedSceneIndex] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (scenarioId) {
            fetchScenario();
        }
    }, [scenarioId]);
    const fetchScenario = async () => {
        if (!scenarioId)
            return;
        try {
            setLoading(true);
            const response = await fetch(`/api/scenarios/${scenarioId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok)
                throw new Error('Failed to fetch scenario');
            const data = await response.json();
            setScenario(data.content || data);
        }
        catch (error) {
            console.error('Error fetching scenario:', error);
            (0, use_toast_1.toast)({
                title: '오류',
                description: '시나리오를 불러올 수 없습니다.',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async () => {
        if (!scenario.title || scenario.scenes.length === 0) {
            (0, use_toast_1.toast)({
                title: '경고',
                description: '제목과 최소 하나의 씬이 필요합니다.',
                variant: 'destructive'
            });
            return;
        }
        try {
            setLoading(true);
            const url = scenarioId
                ? `/api/scenarios/${scenarioId}`
                : '/api/scenarios';
            const method = scenarioId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...scenario,
                    projectId,
                    type: scenario.type || 'user'
                })
            });
            if (!response.ok)
                throw new Error('Failed to save scenario');
            const savedScenario = await response.json();
            (0, use_toast_1.toast)({
                title: '성공',
                description: '시나리오가 저장되었습니다.'
            });
            if (onSave) {
                onSave(savedScenario);
            }
        }
        catch (error) {
            console.error('Error saving scenario:', error);
            (0, use_toast_1.toast)({
                title: '오류',
                description: '시나리오 저장에 실패했습니다.',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const addScene = () => {
        const newScene = {
            title: `씬 ${scenario.scenes.length + 1}`,
            content: '',
            duration: 30,
            visualType: 'content-slide',
            visualPrompt: ''
        };
        setScenario(prev => ({
            ...prev,
            scenes: [...prev.scenes, newScene]
        }));
        setSelectedSceneIndex(scenario.scenes.length);
    };
    const updateScene = (index, updates) => {
        setScenario(prev => ({
            ...prev,
            scenes: prev.scenes.map((scene, i) => i === index ? { ...scene, ...updates } : scene)
        }));
    };
    const deleteScene = (index) => {
        setScenario(prev => ({
            ...prev,
            scenes: prev.scenes.filter((_, i) => i !== index)
        }));
        if (selectedSceneIndex === index) {
            setSelectedSceneIndex(null);
        }
        else if (selectedSceneIndex && selectedSceneIndex > index) {
            setSelectedSceneIndex(selectedSceneIndex - 1);
        }
    };
    const moveScene = (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= scenario.scenes.length)
            return;
        setScenario(prev => {
            const newScenes = [...prev.scenes];
            [newScenes[index], newScenes[newIndex]] = [newScenes[newIndex], newScenes[index]];
            return { ...prev, scenes: newScenes };
        });
        if (selectedSceneIndex === index) {
            setSelectedSceneIndex(newIndex);
        }
        else if (selectedSceneIndex === newIndex) {
            setSelectedSceneIndex(index);
        }
    };
    const generateAIContent = async () => {
        if (!scenario.title) {
            (0, use_toast_1.toast)({
                title: '경고',
                description: '먼저 시나리오 제목을 입력하세요.',
                variant: 'destructive'
            });
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('/api/scenarios', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    projectId,
                    type: 'auto',
                    generationOptions: {
                        topic: scenario.title,
                        duration: scenario.scenes.reduce((sum, s) => sum + s.duration, 0) || 180,
                        targetAudience: scenario.metadata?.targetAudience || 'intermediate',
                        language: scenario.metadata?.language || 'ko',
                        style: scenario.metadata?.style || 'educational',
                        keywords: scenario.metadata?.keywords || []
                    }
                })
            });
            if (!response.ok)
                throw new Error('Failed to generate AI content');
            const aiScenario = await response.json();
            setScenario(prev => ({
                ...prev,
                type: 'hybrid',
                scenes: aiScenario.content?.scenes || aiScenario.scenes || [],
                description: aiScenario.content?.description || aiScenario.description || prev.description
            }));
            (0, use_toast_1.toast)({
                title: '성공',
                description: 'AI가 시나리오를 생성했습니다. 필요에 따라 수정하세요.'
            });
        }
        catch (error) {
            console.error('Error generating AI content:', error);
            (0, use_toast_1.toast)({
                title: '오류',
                description: 'AI 시나리오 생성에 실패했습니다.',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const getTotalDuration = () => {
        return scenario.scenes.reduce((sum, scene) => sum + scene.duration, 0);
    };
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}분 ${secs}초`;
    };
    return (<div className="space-y-6">
      <card_1.Card>
        <card_1.CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <card_1.CardTitle>시나리오 편집기</card_1.CardTitle>
              <card_1.CardDescription>
                비디오 생성을 위한 시나리오를 작성하고 편집합니다
              </card_1.CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <badge_1.Badge variant="outline">
                <lucide_react_1.Clock className="mr-1 h-3 w-3"/>
                {formatDuration(getTotalDuration())}
              </badge_1.Badge>
              <badge_1.Badge variant="outline">
                <lucide_react_1.FileText className="mr-1 h-3 w-3"/>
                {scenario.scenes.length}개 씬
              </badge_1.Badge>
            </div>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
            <tabs_1.TabsList className="grid w-full grid-cols-2">
              <tabs_1.TabsTrigger value="edit">편집</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="preview">미리보기</tabs_1.TabsTrigger>
            </tabs_1.TabsList>

            <tabs_1.TabsContent value="edit" className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label_1.Label htmlFor="title">제목</label_1.Label>
                    <input_1.Input id="title" value={scenario.title} onChange={(e) => setScenario(prev => ({ ...prev, title: e.target.value }))} placeholder="시나리오 제목을 입력하세요"/>
                  </div>
                  <div className="space-y-2">
                    <label_1.Label htmlFor="type">타입</label_1.Label>
                    <select_1.Select value={scenario.type} onValueChange={(value) => setScenario(prev => ({ ...prev, type: value }))}>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        <select_1.SelectItem value="user">사용자 작성</select_1.SelectItem>
                        <select_1.SelectItem value="auto">AI 생성</select_1.SelectItem>
                        <select_1.SelectItem value="hybrid">하이브리드</select_1.SelectItem>
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label_1.Label htmlFor="description">설명</label_1.Label>
                  <textarea_1.Textarea id="description" value={scenario.description} onChange={(e) => setScenario(prev => ({ ...prev, description: e.target.value }))} placeholder="시나리오에 대한 설명을 입력하세요" rows={3}/>
                </div>

                <div className="flex items-center gap-2">
                  <button_1.Button variant="outline" onClick={generateAIContent} disabled={loading}>
                    <lucide_react_1.Wand2 className="mr-2 h-4 w-4"/>
                    AI 생성
                  </button_1.Button>
                </div>
              </div>

              <separator_1.Separator />

              {/* 씬 편집 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">씬 구성</h3>
                  <button_1.Button onClick={addScene} size="sm">
                    <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                    씬 추가
                  </button_1.Button>
                </div>

                <accordion_1.Accordion type="single" collapsible value={selectedSceneIndex?.toString()} onValueChange={(value) => setSelectedSceneIndex(value ? parseInt(value) : null)}>
                  {scenario.scenes.map((scene, index) => (<accordion_1.AccordionItem key={index} value={index.toString()}>
                      <accordion_1.AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-medium">{scene.title}</span>
                          <div className="flex items-center gap-2">
                            <badge_1.Badge variant="secondary">
                              <lucide_react_1.Clock className="mr-1 h-3 w-3"/>
                              {scene.duration}초
                            </badge_1.Badge>
                            <badge_1.Badge variant="outline">
                              {scene.visualType}
                            </badge_1.Badge>
                          </div>
                        </div>
                      </accordion_1.AccordionTrigger>
                      <accordion_1.AccordionContent>
                        <div className="space-y-4 pt-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label_1.Label>씬 제목</label_1.Label>
                              <input_1.Input value={scene.title} onChange={(e) => updateScene(index, { title: e.target.value })} placeholder="씬 제목"/>
                            </div>
                            <div className="space-y-2">
                              <label_1.Label>재생 시간 (초)</label_1.Label>
                              <input_1.Input type="number" value={scene.duration} onChange={(e) => updateScene(index, { duration: parseInt(e.target.value) || 0 })} min="1" max="300"/>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label_1.Label>내용</label_1.Label>
                            <textarea_1.Textarea value={scene.content} onChange={(e) => updateScene(index, { content: e.target.value })} placeholder="씬의 내용을 입력하세요" rows={4}/>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label_1.Label>시각 타입</label_1.Label>
                              <select_1.Select value={scene.visualType} onValueChange={(value) => updateScene(index, { visualType: value })}>
                                <select_1.SelectTrigger>
                                  <select_1.SelectValue />
                                </select_1.SelectTrigger>
                                <select_1.SelectContent>
                                  <select_1.SelectItem value="title-card">타이틀 카드</select_1.SelectItem>
                                  <select_1.SelectItem value="content-slide">콘텐츠 슬라이드</select_1.SelectItem>
                                  <select_1.SelectItem value="code-example">코드 예제</select_1.SelectItem>
                                  <select_1.SelectItem value="diagram">다이어그램</select_1.SelectItem>
                                  <select_1.SelectItem value="animation">애니메이션</select_1.SelectItem>
                                  <select_1.SelectItem value="comparison">비교</select_1.SelectItem>
                                  <select_1.SelectItem value="summary">요약</select_1.SelectItem>
                                </select_1.SelectContent>
                              </select_1.Select>
                            </div>
                            <div className="space-y-2">
                              <label_1.Label>시각 프롬프트</label_1.Label>
                              <input_1.Input value={scene.visualPrompt || ''} onChange={(e) => updateScene(index, { visualPrompt: e.target.value })} placeholder="시각 요소 설명"/>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button_1.Button variant="ghost" size="sm" onClick={() => moveScene(index, 'up')} disabled={index === 0}>
                              <lucide_react_1.ArrowUp className="h-4 w-4"/>
                            </button_1.Button>
                            <button_1.Button variant="ghost" size="sm" onClick={() => moveScene(index, 'down')} disabled={index === scenario.scenes.length - 1}>
                              <lucide_react_1.ArrowDown className="h-4 w-4"/>
                            </button_1.Button>
                            <button_1.Button variant="ghost" size="sm" onClick={() => deleteScene(index)} className="text-destructive">
                              <lucide_react_1.Trash2 className="h-4 w-4"/>
                            </button_1.Button>
                          </div>
                        </div>
                      </accordion_1.AccordionContent>
                    </accordion_1.AccordionItem>))}
                </accordion_1.Accordion>
              </div>
            </tabs_1.TabsContent>

            <tabs_1.TabsContent value="preview" className="space-y-4">
              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle>{scenario.title || '제목 없음'}</card_1.CardTitle>
                  <card_1.CardDescription>{scenario.description || '설명 없음'}</card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-4">
                  {scenario.scenes.map((scene, index) => (<div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {index + 1}. {scene.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <badge_1.Badge variant="secondary">
                            <lucide_react_1.Clock className="mr-1 h-3 w-3"/>
                            {scene.duration}초
                          </badge_1.Badge>
                          <badge_1.Badge variant="outline">
                            <lucide_react_1.Image className="mr-1 h-3 w-3"/>
                            {scene.visualType}
                          </badge_1.Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{scene.content}</p>
                      {scene.visualPrompt && (<p className="text-xs text-muted-foreground italic">
                          시각: {scene.visualPrompt}
                        </p>)}
                    </div>))}
                  
                  {scenario.scenes.length === 0 && (<div className="text-center text-muted-foreground py-8">
                      씬이 없습니다. 씬을 추가해주세요.
                    </div>)}
                </card_1.CardContent>
              </card_1.Card>
            </tabs_1.TabsContent>
          </tabs_1.Tabs>
        </card_1.CardContent>
      </card_1.Card>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between">
        <button_1.Button variant="outline" onClick={onCancel} disabled={loading}>
          취소
        </button_1.Button>
        <div className="flex items-center gap-2">
          <button_1.Button onClick={handleSave} disabled={loading || !scenario.title || scenario.scenes.length === 0}>
            <lucide_react_1.Save className="mr-2 h-4 w-4"/>
            저장
          </button_1.Button>
          {scenarioId && (<button_1.Button variant="secondary" disabled={loading}>
              <lucide_react_1.Video className="mr-2 h-4 w-4"/>
              비디오 생성
            </button_1.Button>)}
        </div>
      </div>
    </div>);
}
