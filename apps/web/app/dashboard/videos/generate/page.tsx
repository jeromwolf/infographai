'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Video, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import * as videoApi from '@/lib/video-api';
import * as scenarioApi from '@/lib/scenario-api';

function VideoGenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('projectId');
  const scenarioId = searchParams.get('scenarioId');
  
  const [project, setProject] = useState<any>(null);
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [videoConfig, setVideoConfig] = useState({
    title: '',
    description: '',
    duration: 30,
    style: 'modern',
    voiceType: 'female',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontSize: 'medium',
    transition: 'fade',
    music: true,
    watermark: false
  });

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
    if (scenarioId) {
      fetchScenario();
    }
    if (!projectId && !scenarioId) {
      setLoading(false);
    }
  }, [projectId, scenarioId]);

  const fetchProject = async () => {
    try {
      const data = await api.getProject(projectId as string);
      setProject(data);
      setVideoConfig(prev => ({
        ...prev,
        title: `${data.title} 비디오`,
        description: data.description || ''
      }));
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      if (!scenarioId) {
        setLoading(false);
      }
    }
  };

  const fetchScenario = async () => {
    try {
      const data = await scenarioApi.getScenario(scenarioId as string);
      setScenario(data);
      setVideoConfig(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        duration: data.totalDuration || prev.duration
      }));
      if (data.projectId && !projectId) {
        const projectData = await api.getProject(data.projectId);
        setProject(projectData);
      }
    } catch (error) {
      console.error('Failed to fetch scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    
    try {
      // API call to generate video
      const videoData = {
        projectId: projectId || scenario?.projectId,
        scenarioId: scenarioId || null,
        ...videoConfig
      };
      
      await videoApi.generateVideo(videoData);
      
      // Redirect to videos page after successful generation
      router.push('/dashboard/videos');
    } catch (error) {
      console.error('Failed to generate video:', error);
      alert('비디오 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href={projectId ? `/dashboard/projects/${projectId}` : '/dashboard/projects'}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {project ? project.title : '프로젝트 목록'}
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">비디오 생성</h1>
        {project && (
          <p className="text-gray-600 mt-2">프로젝트: {project.title}</p>
        )}
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비디오 제목 *
              </label>
              <input
                type="text"
                required
                value={videoConfig.title}
                onChange={(e) => setVideoConfig({ ...videoConfig, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="비디오 제목을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                value={videoConfig.description}
                onChange={(e) => setVideoConfig({ ...videoConfig, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="비디오 설명을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                길이 (초)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={videoConfig.duration}
                onChange={(e) => setVideoConfig({ ...videoConfig, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">스타일 설정</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비디오 스타일
              </label>
              <select
                value={videoConfig.style}
                onChange={(e) => setVideoConfig({ ...videoConfig, style: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="modern">모던</option>
                <option value="classic">클래식</option>
                <option value="minimal">미니멀</option>
                <option value="colorful">컬러풀</option>
                <option value="professional">프로페셔널</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                음성 타입
              </label>
              <select
                value={videoConfig.voiceType}
                onChange={(e) => setVideoConfig({ ...videoConfig, voiceType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="female">여성</option>
                <option value="male">남성</option>
                <option value="child">어린이</option>
                <option value="none">음성 없음</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                배경색
              </label>
              <input
                type="color"
                value={videoConfig.backgroundColor}
                onChange={(e) => setVideoConfig({ ...videoConfig, backgroundColor: e.target.value })}
                className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                텍스트 색상
              </label>
              <input
                type="color"
                value={videoConfig.textColor}
                onChange={(e) => setVideoConfig({ ...videoConfig, textColor: e.target.value })}
                className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                글자 크기
              </label>
              <select
                value={videoConfig.fontSize}
                onChange={(e) => setVideoConfig({ ...videoConfig, fontSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="small">작게</option>
                <option value="medium">보통</option>
                <option value="large">크게</option>
                <option value="xlarge">매우 크게</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전환 효과
              </label>
              <select
                value={videoConfig.transition}
                onChange={(e) => setVideoConfig({ ...videoConfig, transition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="fade">페이드</option>
                <option value="slide">슬라이드</option>
                <option value="zoom">줌</option>
                <option value="none">효과 없음</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={videoConfig.music}
                onChange={(e) => setVideoConfig({ ...videoConfig, music: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">배경 음악 추가</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={videoConfig.watermark}
                onChange={(e) => setVideoConfig({ ...videoConfig, watermark: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">워터마크 추가</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href={projectId ? `/dashboard/projects/${projectId}` : '/dashboard/projects'}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={generating}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-2" />
                비디오 생성
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function VideoGeneratePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <VideoGenerateContent />
    </Suspense>
  );
}