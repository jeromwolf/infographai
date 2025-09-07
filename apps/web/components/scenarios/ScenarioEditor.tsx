/**
 * 시나리오 편집기 컴포넌트
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  Save, 
  Plus, 
  Trash2, 
  Clock, 
  Image, 
  Type,
  ArrowUp,
  ArrowDown,
  Eye,
  Wand2,
  FileText,
  Video
} from 'lucide-react';

interface Scene {
  id?: string;
  title: string;
  content: string;
  duration: number;
  visualType: string;
  visualPrompt?: string;
  subtitles?: Array<{
    text: string;
    startTime: number;
    endTime: number;
  }>;
}

interface ScenarioData {
  id?: string;
  title: string;
  description: string;
  type: 'auto' | 'user' | 'hybrid';
  scenes: Scene[];
  metadata?: {
    keywords?: string[];
    targetAudience?: string;
    language?: string;
    style?: string;
  };
}

interface ScenarioEditorProps {
  scenarioId?: string;
  projectId: string;
  onSave?: (scenario: ScenarioData) => void;
  onCancel?: () => void;
}

export default function ScenarioEditor({ 
  scenarioId, 
  projectId,
  onSave,
  onCancel 
}: ScenarioEditorProps) {
  const [scenario, setScenario] = useState<ScenarioData>({
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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);

  useEffect(() => {
    if (scenarioId) {
      fetchScenario();
    }
  }, [scenarioId]);

  const fetchScenario = async () => {
    if (!scenarioId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/scenarios/${scenarioId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch scenario');

      const data = await response.json();
      setScenario(data.content || data);
    } catch (error) {
      console.error('Error fetching scenario:', error);
      toast({
        title: '오류',
        description: '시나리오를 불러올 수 없습니다.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!scenario.title || scenario.scenes.length === 0) {
      toast({
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

      if (!response.ok) throw new Error('Failed to save scenario');

      const savedScenario = await response.json();
      
      toast({
        title: '성공',
        description: '시나리오가 저장되었습니다.'
      });

      if (onSave) {
        onSave(savedScenario);
      }
    } catch (error) {
      console.error('Error saving scenario:', error);
      toast({
        title: '오류',
        description: '시나리오 저장에 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addScene = () => {
    const newScene: Scene = {
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

  const updateScene = (index: number, updates: Partial<Scene>) => {
    setScenario(prev => ({
      ...prev,
      scenes: prev.scenes.map((scene, i) => 
        i === index ? { ...scene, ...updates } : scene
      )
    }));
  };

  const deleteScene = (index: number) => {
    setScenario(prev => ({
      ...prev,
      scenes: prev.scenes.filter((_, i) => i !== index)
    }));
    
    if (selectedSceneIndex === index) {
      setSelectedSceneIndex(null);
    } else if (selectedSceneIndex && selectedSceneIndex > index) {
      setSelectedSceneIndex(selectedSceneIndex - 1);
    }
  };

  const moveScene = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= scenario.scenes.length) return;

    setScenario(prev => {
      const newScenes = [...prev.scenes];
      [newScenes[index], newScenes[newIndex]] = [newScenes[newIndex], newScenes[index]];
      return { ...prev, scenes: newScenes };
    });

    if (selectedSceneIndex === index) {
      setSelectedSceneIndex(newIndex);
    } else if (selectedSceneIndex === newIndex) {
      setSelectedSceneIndex(index);
    }
  };

  const generateAIContent = async () => {
    if (!scenario.title) {
      toast({
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

      if (!response.ok) throw new Error('Failed to generate AI content');

      const aiScenario = await response.json();
      
      setScenario(prev => ({
        ...prev,
        type: 'hybrid',
        scenes: aiScenario.content?.scenes || aiScenario.scenes || [],
        description: aiScenario.content?.description || aiScenario.description || prev.description
      }));

      toast({
        title: '성공',
        description: 'AI가 시나리오를 생성했습니다. 필요에 따라 수정하세요.'
      });
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast({
        title: '오류',
        description: 'AI 시나리오 생성에 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalDuration = () => {
    return scenario.scenes.reduce((sum, scene) => sum + scene.duration, 0);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}분 ${secs}초`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>시나리오 편집기</CardTitle>
              <CardDescription>
                비디오 생성을 위한 시나리오를 작성하고 편집합니다
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Clock className="mr-1 h-3 w-3" />
                {formatDuration(getTotalDuration())}
              </Badge>
              <Badge variant="outline">
                <FileText className="mr-1 h-3 w-3" />
                {scenario.scenes.length}개 씬
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">편집</TabsTrigger>
              <TabsTrigger value="preview">미리보기</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      value={scenario.title}
                      onChange={(e) => setScenario(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="시나리오 제목을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">타입</Label>
                    <Select
                      value={scenario.type}
                      onValueChange={(value: 'auto' | 'user' | 'hybrid') => 
                        setScenario(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">사용자 작성</SelectItem>
                        <SelectItem value="auto">AI 생성</SelectItem>
                        <SelectItem value="hybrid">하이브리드</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={scenario.description}
                    onChange={(e) => setScenario(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="시나리오에 대한 설명을 입력하세요"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={generateAIContent}
                    disabled={loading}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI 생성
                  </Button>
                </div>
              </div>

              <Separator />

              {/* 씬 편집 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">씬 구성</h3>
                  <Button onClick={addScene} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    씬 추가
                  </Button>
                </div>

                <Accordion
                  type="single"
                  collapsible
                  value={selectedSceneIndex?.toString()}
                  onValueChange={(value) => setSelectedSceneIndex(value ? parseInt(value) : null)}
                >
                  {scenario.scenes.map((scene, index) => (
                    <AccordionItem key={index} value={index.toString()}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-medium">{scene.title}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" />
                              {scene.duration}초
                            </Badge>
                            <Badge variant="outline">
                              {scene.visualType}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>씬 제목</Label>
                              <Input
                                value={scene.title}
                                onChange={(e) => updateScene(index, { title: e.target.value })}
                                placeholder="씬 제목"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>재생 시간 (초)</Label>
                              <Input
                                type="number"
                                value={scene.duration}
                                onChange={(e) => updateScene(index, { duration: parseInt(e.target.value) || 0 })}
                                min="1"
                                max="300"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>내용</Label>
                            <Textarea
                              value={scene.content}
                              onChange={(e) => updateScene(index, { content: e.target.value })}
                              placeholder="씬의 내용을 입력하세요"
                              rows={4}
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>시각 타입</Label>
                              <Select
                                value={scene.visualType}
                                onValueChange={(value) => updateScene(index, { visualType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="title-card">타이틀 카드</SelectItem>
                                  <SelectItem value="content-slide">콘텐츠 슬라이드</SelectItem>
                                  <SelectItem value="code-example">코드 예제</SelectItem>
                                  <SelectItem value="diagram">다이어그램</SelectItem>
                                  <SelectItem value="animation">애니메이션</SelectItem>
                                  <SelectItem value="comparison">비교</SelectItem>
                                  <SelectItem value="summary">요약</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>시각 프롬프트</Label>
                              <Input
                                value={scene.visualPrompt || ''}
                                onChange={(e) => updateScene(index, { visualPrompt: e.target.value })}
                                placeholder="시각 요소 설명"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveScene(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveScene(index, 'down')}
                              disabled={index === scenario.scenes.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteScene(index)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{scenario.title || '제목 없음'}</CardTitle>
                  <CardDescription>{scenario.description || '설명 없음'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scenario.scenes.map((scene, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {index + 1}. {scene.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            {scene.duration}초
                          </Badge>
                          <Badge variant="outline">
                            <Image className="mr-1 h-3 w-3" />
                            {scene.visualType}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{scene.content}</p>
                      {scene.visualPrompt && (
                        <p className="text-xs text-muted-foreground italic">
                          시각: {scene.visualPrompt}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {scenario.scenes.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      씬이 없습니다. 씬을 추가해주세요.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          취소
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={loading || !scenario.title || scenario.scenes.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
          {scenarioId && (
            <Button
              variant="secondary"
              disabled={loading}
            >
              <Video className="mr-2 h-4 w-4" />
              비디오 생성
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}