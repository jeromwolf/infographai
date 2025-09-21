'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  RefreshCw
} from 'lucide-react';

interface TemplateStats {
  templatePath: string;
  totalUses: number;
  averageRenderTime: number;
  cacheHitRate: number;
  errorRate: number;
  averageEngagementScore: number;
  completionRate: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface PerformanceMetrics {
  summary: {
    totalTemplates: number;
    averageCacheHitRate: number;
    averageRenderTime: number;
    totalCacheSize: number;
  };
  topPerformers: TemplateStats[];
  needsOptimization: TemplateStats[];
}

interface ABTestResult {
  testId: string;
  status: string;
  sampleSize: number;
  variants: Array<{
    variantId: string;
    sampleSize: number;
    metricValue: number;
    confidenceInterval: [number, number];
    isWinner?: boolean;
  }>;
  statisticalSignificance: number;
  recommendations: string[];
}

export default function AnalyticsPage() {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [abTestResults, setAbTestResults] = useState<ABTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch performance metrics
      const perfResponse = await fetch('/api/analytics/performance');
      const perfData = await perfResponse.json();
      setPerformanceMetrics(perfData);

      // Fetch A/B test results
      const abResponse = await fetch('/api/analytics/ab-tests');
      const abData = await abResponse.json();
      setAbTestResults(abData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatSize = (mb: number) => {
    if (mb < 1) return `${(mb * 1024).toFixed(0)}KB`;
    return `${mb.toFixed(2)}MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Template Analytics Dashboard</h1>
        <div className="flex gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.summary.totalTemplates}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cache Hit Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performanceMetrics.summary.averageCacheHitRate.toFixed(1)}%
              </div>
              <Progress value={performanceMetrics.summary.averageCacheHitRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Render Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {formatTime(performanceMetrics.summary.averageRenderTime)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cache Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <Database className="h-5 w-5 mr-2" />
                {formatSize(performanceMetrics.summary.totalCacheSize)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="ab-tests">A/B Tests</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Render Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={performanceMetrics?.topPerformers.map(t => ({
                      name: t.templatePath.split('/').pop(),
                      time: t.averageRenderTime
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatTime(value as number)} />
                    <Bar dataKey="time" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Hit Rate by Template</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceMetrics?.topPerformers.slice(0, 5).map(t => ({
                        name: t.templatePath.split('/').pop(),
                        value: t.cacheHitRate
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ value }) => `${value.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceMetrics?.topPerformers.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceMetrics?.topPerformers.slice(0, 5).map((template, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-sm">{template.templatePath.split('/').pop()}</p>
                          <p className="text-xs text-gray-500">
                            {template.totalUses} uses · {template.completionRate.toFixed(0)}% completion
                          </p>
                        </div>
                      </div>
                      {getTrendIcon(template.trend)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Templates Needing Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceMetrics?.needsOptimization.slice(0, 5).map((template, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium text-sm">{template.templatePath.split('/').pop()}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(template.averageRenderTime)} · {template.errorRate.toFixed(1)}% errors
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Optimize</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* A/B Tests Tab */}
        <TabsContent value="ab-tests" className="space-y-4">
          {abTestResults.map((test) => (
            <Card key={test.testId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{test.testId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    test.status === 'running' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {test.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Sample Size: {test.sampleSize} | Significance: {test.statisticalSignificance.toFixed(1)}%
                  </p>
                </div>

                <div className="space-y-3">
                  {test.variants.map((variant) => (
                    <div key={variant.variantId} className={`p-3 rounded-lg ${
                      variant.isWinner ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{variant.variantId}</p>
                          <p className="text-sm text-gray-600">
                            Value: {variant.metricValue.toFixed(2)} | Samples: {variant.sampleSize}
                          </p>
                        </div>
                        {variant.isWinner && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Zap className="h-4 w-4" />
                            <span className="text-sm font-medium">Winner</span>
                          </div>
                        )}
                      </div>
                      <Progress value={(variant.metricValue / 100) * 100} className="mt-2" />
                    </div>
                  ))}
                </div>

                {test.recommendations.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-sm mb-2">Recommendations:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {test.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Automatic Optimization</h3>
                    <p className="text-sm text-gray-600">
                      Runs every hour to optimize underperforming templates
                    </p>
                  </div>
                  <Button>Run Now</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Cache Preloading</h3>
                    <p className="text-sm text-gray-600">
                      Preload frequently used templates for better performance
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Clear Old Cache</h3>
                    <p className="text-sm text-gray-600">
                      Remove cache entries older than 7 days
                    </p>
                  </div>
                  <Button variant="destructive">Clear Cache</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}