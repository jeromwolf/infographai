/**
 * 시나리오 템플릿 선택기 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Code, 
  BookOpen, 
  Video,
  Lightbulb,
  Target,
  Clock,
  ChevronRight,
  Wand2,
  Layout
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  structure: string[];
  defaultDuration: number;
  variables?: string[];
  icon?: React.ElementType;
}

interface ScenarioTemplateSelectorProps {
  projectId: string;
  onSelect: (template: Template, variables?: Record<string, any>) => void;
  onCancel?: () => void;
}

export default function ScenarioTemplateSelector({
  projectId,
  onSelect,
  onCancel
}: ScenarioTemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [showVariables, setShowVariables] = useState(false);

  const defaultTemplates: Template[] = [
    {
      id: 'programming-tutorial',
      name: 'programming-tutorial',
      displayName: '프로그래밍 튜토리얼',
      description: '코딩 개념과 실습을 단계별로 설명하는 교육 비디오',
      category: 'education',
      structure: ['소개', '개념 설명', '코드 예제', '실습', '요약'],
      defaultDuration: 300,
      variables: ['topic', 'language', 'level'],
      icon: Code
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
      icon: Lightbulb
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
      icon: Layout
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
      icon: Target
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
      icon: BookOpen
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
      icon: Video
    }
  ];

  useEffect(() => {
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
      } else {
        // API 실패 시 기본 템플릿만 사용
        setTemplates(defaultTemplates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates(defaultTemplates);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    if (template.variables && template.variables.length > 0) {
      setShowVariables(true);
      // 변수 초기화
      const initialVars: Record<string, any> = {};
      template.variables.forEach(v => {
        initialVars[v] = '';
      });
      setVariables(initialVars);
    } else {
      // 변수가 없으면 바로 생성
      handleCreateFromTemplate();
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;

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

      if (!response.ok) throw new Error('Failed to create from template');

      const scenario = await response.json();
      
      toast({
        title: '성공',
        description: '템플릿에서 시나리오를 생성했습니다.'
      });

      onSelect(selectedTemplate, variables);
    } catch (error) {
      console.error('Error creating from template:', error);
      toast({
        title: '오류',
        description: '템플릿 생성에 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getVariableLabel = (variable: string): string => {
    const labels: Record<string, string> = {
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

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      education: 'bg-blue-100 text-blue-800',
      presentation: 'bg-green-100 text-green-800',
      analysis: 'bg-purple-100 text-purple-800',
      guide: 'bg-orange-100 text-orange-800',
      tips: 'bg-pink-100 text-pink-800'
    };

    const labels: Record<string, string> = {
      education: '교육',
      presentation: '프레젠테이션',
      analysis: '분석',
      guide: '가이드',
      tips: '팁'
    };

    return (
      <Badge className={colors[category] || ''}>
        {labels[category] || category}
      </Badge>
    );
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showVariables && selectedTemplate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{selectedTemplate.displayName} 설정</CardTitle>
          <CardDescription>
            템플릿 변수를 입력하여 맞춤형 시나리오를 생성합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedTemplate.variables?.map((variable) => (
            <div key={variable} className="space-y-2">
              <Label htmlFor={variable}>{getVariableLabel(variable)}</Label>
              {variable === 'level' ? (
                <Select
                  value={variables[variable]}
                  onValueChange={(value) => setVariables(prev => ({ ...prev, [variable]: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="난이도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">초급</SelectItem>
                    <SelectItem value="intermediate">중급</SelectItem>
                    <SelectItem value="advanced">고급</SelectItem>
                  </SelectContent>
                </Select>
              ) : variable === 'targetAudience' ? (
                <Select
                  value={variables[variable]}
                  onValueChange={(value) => setVariables(prev => ({ ...prev, [variable]: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="대상 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">입문자</SelectItem>
                    <SelectItem value="student">학생</SelectItem>
                    <SelectItem value="professional">전문가</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={variable}
                  value={variables[variable]}
                  onChange={(e) => setVariables(prev => ({ ...prev, [variable]: e.target.value }))}
                  placeholder={`${getVariableLabel(variable)}을(를) 입력하세요`}
                />
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowVariables(false);
                setSelectedTemplate(null);
              }}
            >
              뒤로
            </Button>
            <Button
              onClick={handleCreateFromTemplate}
              disabled={loading || Object.values(variables).some(v => !v)}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              시나리오 생성
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const Icon = template.icon || FileText;
          return (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTemplateClick(template)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  {getCategoryBadge(template.category)}
                </div>
                <CardTitle className="text-lg">{template.displayName}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>약 {Math.floor(template.defaultDuration / 60)}분</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">구조:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {template.structure.map((section, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full"
                >
                  선택
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {templates.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          템플릿이 없습니다.
        </div>
      )}

      {onCancel && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
        </div>
      )}
    </div>
  );
}