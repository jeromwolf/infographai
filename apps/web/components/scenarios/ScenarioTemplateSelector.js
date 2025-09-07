"use strict";
/**
 * 시나리오 템플릿 선택기 컴포넌트
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
exports.default = ScenarioTemplateSelector;
const react_1 = __importStar(require("react"));
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const use_toast_1 = require("@/components/ui/use-toast");
const lucide_react_1 = require("lucide-react");
function ScenarioTemplateSelector({ projectId, onSelect, onCancel }) {
    const [templates, setTemplates] = (0, react_1.useState)([]);
    const [selectedTemplate, setSelectedTemplate] = (0, react_1.useState)(null);
    const [variables, setVariables] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [showVariables, setShowVariables] = (0, react_1.useState)(false);
    const defaultTemplates = [
        {
            id: 'programming-tutorial',
            name: 'programming-tutorial',
            displayName: '프로그래밍 튜토리얼',
            description: '코딩 개념과 실습을 단계별로 설명하는 교육 비디오',
            category: 'education',
            structure: ['소개', '개념 설명', '코드 예제', '실습', '요약'],
            defaultDuration: 300,
            variables: ['topic', 'language', 'level'],
            icon: lucide_react_1.Code
        },
        {
            id: 'concept-explanation',
            name: 'concept-explanation',
            displayName: '개념 설명',
            description: 'IT 개념을 쉽게 풀어서 설명하는 교육 콘텐츠',
            category: 'education',
            structure: ['도입', '정의', '작동 원리', '활용 사례', '정리'],
            defaultDuration: 240,
            variables: ['concept', 'targetAudience'],
            icon: lucide_react_1.Lightbulb
        },
        {
            id: 'project-showcase',
            name: 'project-showcase',
            displayName: '프로젝트 쇼케이스',
            description: '개발 프로젝트를 소개하고 시연하는 프레젠테이션',
            category: 'presentation',
            structure: ['프로젝트 소개', '기술 스택', '주요 기능', '시연', '결론'],
            defaultDuration: 360,
            variables: ['projectName', 'techStack'],
            icon: lucide_react_1.Layout
        },
        {
            id: 'comparison',
            name: 'comparison',
            displayName: '기술 비교',
            description: '두 가지 이상의 기술을 비교 분석하는 콘텐츠',
            category: 'analysis',
            structure: ['개요', '기술 A 소개', '기술 B 소개', '비교 분석', '추천'],
            defaultDuration: 300,
            variables: ['techA', 'techB', 'criteria'],
            icon: lucide_react_1.Target
        },
        {
            id: 'troubleshooting',
            name: 'troubleshooting',
            displayName: '문제 해결 가이드',
            description: '일반적인 문제와 해결 방법을 제시하는 가이드',
            category: 'guide',
            structure: ['문제 정의', '원인 분석', '해결 방법', '예방법', '팁'],
            defaultDuration: 240,
            variables: ['problem', 'technology'],
            icon: lucide_react_1.BookOpen
        },
        {
            id: 'quick-tips',
            name: 'quick-tips',
            displayName: '빠른 팁',
            description: '짧고 유용한 개발 팁을 제공하는 숏폼 콘텐츠',
            category: 'tips',
            structure: ['팁 소개', '실제 적용', '결과'],
            defaultDuration: 90,
            variables: ['tip', 'tool'],
            icon: lucide_react_1.Video
        }
    ];
    (0, react_1.useEffect)(() => {
        fetchTemplates();
    }, []);
    const fetchTemplates = async () => {
        try {
            setLoading(true);
            // API에서 템플릿 가져오기 시도
            const response = await fetch('/api/scenarios/templates', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTemplates([...defaultTemplates, ...data]);
            }
            else {
                // API 실패 시 기본 템플릿만 사용
                setTemplates(defaultTemplates);
            }
        }
        catch (error) {
            console.error('Error fetching templates:', error);
            setTemplates(defaultTemplates);
        }
        finally {
            setLoading(false);
        }
    };
    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        if (template.variables && template.variables.length > 0) {
            setShowVariables(true);
            // 변수 초기화
            const initialVars = {};
            template.variables.forEach(v => {
                initialVars[v] = '';
            });
            setVariables(initialVars);
        }
        else {
            // 변수가 없으면 바로 생성
            handleCreateFromTemplate();
        }
    };
    const handleCreateFromTemplate = async () => {
        if (!selectedTemplate)
            return;
        try {
            setLoading(true);
            const response = await fetch('/api/scenarios/from-template', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    projectId,
                    templateName: selectedTemplate.name,
                    variables
                })
            });
            if (!response.ok)
                throw new Error('Failed to create from template');
            const scenario = await response.json();
            (0, use_toast_1.toast)({
                title: '성공',
                description: '템플릿에서 시나리오를 생성했습니다.'
            });
            onSelect(selectedTemplate, variables);
        }
        catch (error) {
            console.error('Error creating from template:', error);
            (0, use_toast_1.toast)({
                title: '오류',
                description: '템플릿 생성에 실패했습니다.',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const getVariableLabel = (variable) => {
        const labels = {
            topic: '주제',
            language: '프로그래밍 언어',
            level: '난이도',
            concept: '개념',
            targetAudience: '대상 청중',
            projectName: '프로젝트 이름',
            techStack: '기술 스택',
            techA: '첫 번째 기술',
            techB: '두 번째 기술',
            criteria: '비교 기준',
            problem: '문제',
            technology: '기술',
            tip: '팁 내용',
            tool: '도구'
        };
        return labels[variable] || variable;
    };
    const getCategoryBadge = (category) => {
        const colors = {
            education: 'bg-blue-100 text-blue-800',
            presentation: 'bg-green-100 text-green-800',
            analysis: 'bg-purple-100 text-purple-800',
            guide: 'bg-orange-100 text-orange-800',
            tips: 'bg-pink-100 text-pink-800'
        };
        const labels = {
            education: '교육',
            presentation: '프레젠테이션',
            analysis: '분석',
            guide: '가이드',
            tips: '팁'
        };
        return (<badge_1.Badge className={colors[category] || ''}>
        {labels[category] || category}
      </badge_1.Badge>);
    };
    if (loading && templates.length === 0) {
        return (<div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>);
    }
    if (showVariables && selectedTemplate) {
        return (<card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>{selectedTemplate.displayName} 설정</card_1.CardTitle>
          <card_1.CardDescription>
            템플릿 변수를 입력하여 맞춤형 시나리오를 생성합니다
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          {selectedTemplate.variables?.map((variable) => (<div key={variable} className="space-y-2">
              <label_1.Label htmlFor={variable}>{getVariableLabel(variable)}</label_1.Label>
              {variable === 'level' ? (<select_1.Select value={variables[variable]} onValueChange={(value) => setVariables(prev => ({ ...prev, [variable]: value }))}>
                  <select_1.SelectTrigger>
                    <select_1.SelectValue placeholder="난이도 선택"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="beginner">초급</select_1.SelectItem>
                    <select_1.SelectItem value="intermediate">중급</select_1.SelectItem>
                    <select_1.SelectItem value="advanced">고급</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>) : variable === 'targetAudience' ? (<select_1.Select value={variables[variable]} onValueChange={(value) => setVariables(prev => ({ ...prev, [variable]: value }))}>
                  <select_1.SelectTrigger>
                    <select_1.SelectValue placeholder="대상 선택"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="beginner">입문자</select_1.SelectItem>
                    <select_1.SelectItem value="student">학생</select_1.SelectItem>
                    <select_1.SelectItem value="professional">전문가</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>) : (<input_1.Input id={variable} value={variables[variable]} onChange={(e) => setVariables(prev => ({ ...prev, [variable]: e.target.value }))} placeholder={`${getVariableLabel(variable)}을(를) 입력하세요`}/>)}
            </div>))}

          <div className="flex items-center justify-between pt-4">
            <button_1.Button variant="outline" onClick={() => {
                setShowVariables(false);
                setSelectedTemplate(null);
            }}>
              뒤로
            </button_1.Button>
            <button_1.Button onClick={handleCreateFromTemplate} disabled={loading || Object.values(variables).some(v => !v)}>
              <lucide_react_1.Wand2 className="mr-2 h-4 w-4"/>
              시나리오 생성
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    }
    return (<div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
            const Icon = template.icon || lucide_react_1.FileText;
            return (<card_1.Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleTemplateClick(template)}>
              <card_1.CardHeader>
                <div className="flex items-start justify-between">
                  <Icon className="h-8 w-8 text-primary"/>
                  {getCategoryBadge(template.category)}
                </div>
                <card_1.CardTitle className="text-lg">{template.displayName}</card_1.CardTitle>
                <card_1.CardDescription>{template.description}</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <lucide_react_1.Clock className="h-4 w-4"/>
                    <span>약 {Math.floor(template.defaultDuration / 60)}분</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">구조:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {template.structure.map((section, index) => (<badge_1.Badge key={index} variant="secondary" className="text-xs">
                          {section}
                        </badge_1.Badge>))}
                    </div>
                  </div>
                </div>
                <button_1.Button variant="ghost" size="sm" className="mt-4 w-full">
                  선택
                  <lucide_react_1.ChevronRight className="ml-2 h-4 w-4"/>
                </button_1.Button>
              </card_1.CardContent>
            </card_1.Card>);
        })}
      </div>

      {templates.length === 0 && (<div className="text-center text-muted-foreground py-8">
          템플릿이 없습니다.
        </div>)}

      {onCancel && (<div className="flex justify-center">
          <button_1.Button variant="outline" onClick={onCancel}>
            취소
          </button_1.Button>
        </div>)}
    </div>);
}
