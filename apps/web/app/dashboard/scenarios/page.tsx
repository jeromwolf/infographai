'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Trash2, Eye, Clock, Layers } from 'lucide-react';
import * as scenarioApi from '@/lib/scenario-api';

export default function ScenariosPage() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await scenarioApi.getScenarios();
      const scenarioList = response?.scenarios || response || [];
      setScenarios(Array.isArray(scenarioList) ? scenarioList : []);
    } catch (error) {
      console.error('Failed to fetch scenarios:', error);
      setScenarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScenario = async (id: string) => {
    if (confirm('정말로 이 시나리오를 삭제하시겠습니까?')) {
      try {
        await scenarioApi.deleteScenario(id);
        fetchScenarios();
      } catch (error) {
        console.error('Failed to delete scenario:', error);
      }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">시나리오</h1>
          <Link
            href="/dashboard/scenarios/new"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            새 시나리오
          </Link>
        </div>

        {scenarios.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">시나리오가 없습니다</h3>
            <p className="text-gray-500 mb-4">첫 번째 시나리오를 작성해보세요</p>
            <Link
              href="/dashboard/scenarios/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              시나리오 작성하기
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <div 
                key={scenario.id} 
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/scenarios/${scenario.id}`)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{scenario.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/scenarios/${scenario.id}`);
                        }}
                        className="text-gray-500 hover:text-primary-600"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScenario(scenario.id);
                        }}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{scenario.description || '설명이 없습니다'}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Layers className="w-4 h-4 mr-2" />
                      장면: {scenario.sceneCount || 0}개
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      총 {scenario.totalDuration || 0}초
                    </div>
                  </div>
                  
                  {scenario.project && (
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        href={`/dashboard/projects/${scenario.projectId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        프로젝트: {scenario.project.title}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}