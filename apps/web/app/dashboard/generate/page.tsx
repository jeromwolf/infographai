'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Video, 
  Clock, 
  Globe, 
  Users,
  Zap,
  ChevronRight,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { aiApi } from '@/lib/ai-api';

interface GenerationOptions {
  duration: 30 | 60 | 90;
  style: 'professional' | 'casual' | 'technical';
  targetAudience: 'beginner' | 'intermediate' | 'advanced';
  language: 'ko' | 'en';
}

const POPULAR_TOPICS = [
  { title: 'Docker 입문', category: 'DevOps', icon: '🐳' },
  { title: 'React Hooks 완벽 가이드', category: 'Frontend', icon: '⚛️' },
  { title: 'Kubernetes 기초', category: 'DevOps', icon: '☸️' },
  { title: 'REST API 설계', category: 'Backend', icon: '🔌' },
  { title: 'Git 협업 전략', category: 'Tools', icon: '🌳' },
  { title: 'TypeScript 마스터하기', category: 'Language', icon: '📘' }
];

export default function GeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [options, setOptions] = useState<GenerationOptions>({
    duration: 30,
    style: 'professional',
    targetAudience: 'intermediate',
    language: 'ko'
  });
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState<'input' | 'options' | 'generating' | 'complete'>('input');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setStep('generating');
    setGenerating(true);
    
    try {
      // AI 비디오 생성 API 호출
      const response = await aiApi.generateVideo({
        topic,
        options
      });
      
      // 생성 상태 확인 (polling)
      let status = response;
      while (status.status === 'pending' || status.status === 'generating') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        status = await aiApi.getGenerationStatus(response.id);
      }
      
      if (status.status === 'completed') {
        setStep('complete');
        // 3초 후 비디오 페이지로 이동
        setTimeout(() => {
          router.push(`/dashboard/videos/${status.id}`);
        }, 3000);
      } else {
        throw new Error(status.error || '비디오 생성 실패');
      }
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(error.message || '비디오 생성에 실패했습니다.');
      setStep('options');
    } finally {
      setGenerating(false);
    }
  };

  const selectTopic = (topicTitle: string) => {
    setTopic(topicTitle);
    setStep('options');
  };

  if (step === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-purple-600 mx-auto" />
            <Sparkles className="h-8 w-8 text-yellow-500 absolute top-0 right-0 animate-pulse" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">AI가 비디오를 생성하고 있습니다</h2>
          <p className="mt-2 text-gray-600">주제: {topic}</p>
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              시나리오 분석 완료
            </div>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              인포그래픽 생성 중...
            </div>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              비디오 렌더링 대기
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">비디오 생성 완료!</h2>
          <p className="mt-2 text-gray-600">{topic} 비디오가 성공적으로 생성되었습니다.</p>
          <div className="mt-6 space-x-4">
            <button
              onClick={() => router.push('/dashboard/videos')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              비디오 보기
            </button>
            <button
              onClick={() => {
                setTopic('');
                setStep('input');
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              새 비디오 만들기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'options') {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setStep('input')}
          className="mb-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← 주제 변경
        </button>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">비디오 옵션 설정</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              선택한 주제
            </label>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-lg font-medium text-purple-900">{topic}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                비디오 길이
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[30, 60, 90].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setOptions({ ...options, duration: duration as 30 | 60 | 90 })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      options.duration === duration
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-medium">{duration}초</div>
                    <div className="text-xs text-gray-500">
                      {duration === 30 ? '기본' : duration === 60 ? '상세' : '완전판'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="inline h-4 w-4 mr-1" />
                스타일
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'professional', label: '전문적', desc: '깔끔하고 신뢰감 있는' },
                  { value: 'casual', label: '캐주얼', desc: '친근하고 재미있는' },
                  { value: 'technical', label: '기술적', desc: '상세하고 정확한' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setOptions({ ...options, style: style.value as any })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      options.style === style.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{style.label}</div>
                    <div className="text-xs text-gray-500">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                대상 수준
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'beginner', label: '초급', desc: '기초부터 차근차근' },
                  { value: 'intermediate', label: '중급', desc: '핵심 개념 중심' },
                  { value: 'advanced', label: '고급', desc: '심화 내용 포함' }
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setOptions({ ...options, targetAudience: level.value as any })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      options.targetAudience === level.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{level.label}</div>
                    <div className="text-xs text-gray-500">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                언어
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'ko', label: '한국어', flag: '🇰🇷' },
                  { value: 'en', label: 'English', flag: '🇺🇸' }
                ].map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setOptions({ ...options, language: lang.value as 'ko' | 'en' })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      options.language === lang.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mr-2">{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI 비디오 생성
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI 교육 비디오 생성
        </h1>
        <p className="text-lg text-gray-600">
          주제만 입력하면 전문적인 인포그래픽 비디오가 자동으로 생성됩니다
        </p>
      </div>

      {/* Topic Input */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <label className="block text-lg font-medium text-gray-700 mb-4">
          어떤 주제의 비디오를 만들까요?
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: Docker 입문, React Hooks, Kubernetes 기초"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && topic.trim()) {
                setStep('options');
              }
            }}
          />
          <button
            onClick={() => setStep('options')}
            disabled={!topic.trim()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">인기 주제</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_TOPICS.map((item) => (
            <button
              key={item.title}
              onClick={() => selectTopic(item.title)}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{item.icon}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          AI가 자동으로 생성하는 것들
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">전문 시나리오</h3>
            <p className="text-sm text-gray-600">
              GPT-4 기반 구조화된 교육 콘텐츠
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Video className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">인포그래픽 애니메이션</h3>
            <p className="text-sm text-gray-600">
              차트, 다이어그램, 아이콘 자동 생성
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">프로페셔널 디자인</h3>
            <p className="text-sm text-gray-600">
              5가지 레이아웃, 다양한 애니메이션
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}