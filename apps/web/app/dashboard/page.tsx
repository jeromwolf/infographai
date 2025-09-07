'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Video, 
  FolderOpen, 
  DollarSign, 
  TrendingUp,
  Plus,
  ArrowRight,
  Clock
} from 'lucide-react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalVideos: 0,
    totalCost: 0,
    monthlyBudget: 10
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [projects, costSummary] = await Promise.all([
        api.getProjects(),
        api.getCostSummary()
      ]);
      
      setRecentProjects(projects.slice(0, 3));
      setStats({
        totalProjects: projects.length,
        totalVideos: 0, // Would need to aggregate from projects
        totalCost: costSummary.month || 0,
        monthlyBudget: 10
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-600">
          프로젝트와 비디오 생성 현황을 확인하세요
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="전체 프로젝트"
          value={stats.totalProjects}
          icon={FolderOpen}
          color="blue"
        />
        <StatCard
          title="생성된 비디오"
          value={stats.totalVideos}
          icon={Video}
          color="green"
        />
        <StatCard
          title="이번 달 비용"
          value={`$${stats.totalCost.toFixed(2)}`}
          icon={DollarSign}
          color="yellow"
        />
        <StatCard
          title="예산 사용률"
          value={`${((stats.totalCost / stats.monthlyBudget) * 100).toFixed(0)}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/projects"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">새 프로젝트</p>
              <p className="text-sm text-gray-500">교육 프로젝트 시작</p>
            </div>
          </Link>

          <Link
            href="/dashboard/videos"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <Video className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">비디오 생성</p>
              <p className="text-sm text-gray-500">AI로 비디오 만들기</p>
            </div>
          </Link>

          <Link
            href="/dashboard/costs"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">비용 확인</p>
              <p className="text-sm text-gray-500">사용량 모니터링</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">최근 프로젝트</h2>
            <Link
              href="/dashboard/projects"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 inline-flex items-center"
            >
              모두 보기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <FolderOpen className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.topic}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">아직 프로젝트가 없습니다</p>
              <Link
                href="/dashboard/projects"
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                첫 프로젝트 만들기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}