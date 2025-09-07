'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, AlertCircle, BarChart } from 'lucide-react';
import { api } from '@/lib/api';

export default function CostsPage() {
  const [costSummary, setCostSummary] = useState<any>(null);
  const [costHistory, setCostHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetchCostData();
  }, [period]);

  const fetchCostData = async () => {
    try {
      const [summary, history] = await Promise.all([
        api.getCostSummary(),
        api.getCostHistory({ limit: 30 })
      ]);
      setCostSummary(summary || {});
      setCostHistory(Array.isArray(history) ? history : []);
    } catch (error) {
      console.error('Failed to fetch cost data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return limit > 0 ? Math.round((used / limit) * 100) : 0;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">비용 관리</h1>

        {/* 비용 요약 카드 */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">오늘 사용량</h3>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(costSummary?.today || 0)}
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>일일 한도</span>
                <span>{formatCurrency(costSummary?.dailyLimit || 10)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    getUsagePercentage(costSummary?.today || 0, costSummary?.dailyLimit || 10) > 80
                      ? 'bg-red-500'
                      : getUsagePercentage(costSummary?.today || 0, costSummary?.dailyLimit || 10) > 60
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(getUsagePercentage(costSummary?.today || 0, costSummary?.dailyLimit || 10), 100)}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">이번 달 사용량</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(costSummary?.thisMonth || 0)}
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>월별 한도</span>
                <span>{formatCurrency(costSummary?.monthlyLimit || 300)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    getUsagePercentage(costSummary?.thisMonth || 0, costSummary?.monthlyLimit || 300) > 80
                      ? 'bg-red-500'
                      : getUsagePercentage(costSummary?.thisMonth || 0, costSummary?.monthlyLimit || 300) > 60
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(getUsagePercentage(costSummary?.thisMonth || 0, costSummary?.monthlyLimit || 300), 100)}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">총 사용량</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(costSummary?.total || 0)}
            </p>
            <div className="mt-4 text-sm text-gray-600">
              <p>비디오 생성: {costSummary?.videoCount || 0}개</p>
              <p>시나리오 생성: {costSummary?.scenarioCount || 0}개</p>
            </div>
          </div>
        </div>

        {/* 경고 메시지 */}
        {costSummary?.warning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">비용 경고</h3>
                <p className="text-sm text-yellow-700 mt-1">{costSummary.warning}</p>
              </div>
            </div>
          </div>
        )}

        {/* 사용 이력 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">사용 이력</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod('daily')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    period === 'daily'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  일별
                </button>
                <button
                  onClick={() => setPeriod('weekly')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    period === 'weekly'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  주별
                </button>
                <button
                  onClick={() => setPeriod('monthly')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    period === 'monthly'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  월별
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {costHistory.length === 0 ? (
              <div className="text-center py-8">
                <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">아직 사용 이력이 없습니다</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        날짜
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        서비스
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용량
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        비용
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(costHistory) && costHistory.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.usage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(item.cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}