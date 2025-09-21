'use client';
"use strict";
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
exports.default = AnalyticsPage;
const react_1 = __importStar(require("react"));
const card_1 = require("@/components/ui/card");
const tabs_1 = require("@/components/ui/tabs");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const recharts_1 = require("recharts");
const lucide_react_1 = require("lucide-react");
function AnalyticsPage() {
    const [performanceMetrics, setPerformanceMetrics] = (0, react_1.useState)(null);
    const [abTestResults, setAbTestResults] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [selectedTimeRange, setSelectedTimeRange] = (0, react_1.useState)('7d');
    (0, react_1.useEffect)(() => {
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
        }
        catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'increasing':
                return <lucide_react_1.TrendingUp className="h-4 w-4 text-green-500"/>;
            case 'decreasing':
                return <lucide_react_1.TrendingDown className="h-4 w-4 text-red-500"/>;
            default:
                return <lucide_react_1.Activity className="h-4 w-4 text-gray-500"/>;
        }
    };
    const formatTime = (ms) => {
        if (ms < 1000)
            return `${ms.toFixed(0)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };
    const formatSize = (mb) => {
        if (mb < 1)
            return `${(mb * 1024).toFixed(0)}KB`;
        return `${mb.toFixed(2)}MB`;
    };
    if (isLoading) {
        return (<div className="flex items-center justify-center h-screen">
        <lucide_react_1.RefreshCw className="h-8 w-8 animate-spin"/>
      </div>);
    }
    return (<div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Template Analytics Dashboard</h1>
        <div className="flex gap-2">
          <select value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button_1.Button onClick={fetchAnalytics} variant="outline">
            <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
            Refresh
          </button_1.Button>
        </div>
      </div>

      {/* Summary Cards */}
      {performanceMetrics && (<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <card_1.Card>
            <card_1.CardHeader className="pb-2">
              <card_1.CardTitle className="text-sm font-medium text-gray-600">
                Total Templates
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.summary.totalTemplates}</div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader className="pb-2">
              <card_1.CardTitle className="text-sm font-medium text-gray-600">
                Cache Hit Rate
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">
                {performanceMetrics.summary.averageCacheHitRate.toFixed(1)}%
              </div>
              <progress_1.Progress value={performanceMetrics.summary.averageCacheHitRate} className="mt-2"/>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader className="pb-2">
              <card_1.CardTitle className="text-sm font-medium text-gray-600">
                Avg Render Time
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold flex items-center">
                <lucide_react_1.Clock className="h-5 w-5 mr-2"/>
                {formatTime(performanceMetrics.summary.averageRenderTime)}
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader className="pb-2">
              <card_1.CardTitle className="text-sm font-medium text-gray-600">
                Cache Size
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold flex items-center">
                <lucide_react_1.Database className="h-5 w-5 mr-2"/>
                {formatSize(performanceMetrics.summary.totalCacheSize)}
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>)}

      <tabs_1.Tabs defaultValue="performance" className="space-y-4">
        <tabs_1.TabsList>
          <tabs_1.TabsTrigger value="performance">Performance</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="templates">Templates</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="ab-tests">A/B Tests</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="optimization">Optimization</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        {/* Performance Tab */}
        <tabs_1.TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Render Time Distribution</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <recharts_1.ResponsiveContainer width="100%" height={300}>
                  <recharts_1.BarChart data={performanceMetrics?.topPerformers.map(t => ({
            name: t.templatePath.split('/').pop(),
            time: t.averageRenderTime
        }))}>
                    <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                    <recharts_1.XAxis dataKey="name" angle={-45} textAnchor="end" height={100}/>
                    <recharts_1.YAxis />
                    <recharts_1.Tooltip formatter={(value) => formatTime(value)}/>
                    <recharts_1.Bar dataKey="time" fill="#8884d8"/>
                  </recharts_1.BarChart>
                </recharts_1.ResponsiveContainer>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Cache Hit Rate by Template</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <recharts_1.ResponsiveContainer width="100%" height={300}>
                  <recharts_1.PieChart>
                    <recharts_1.Pie data={performanceMetrics?.topPerformers.slice(0, 5).map(t => ({
            name: t.templatePath.split('/').pop(),
            value: t.cacheHitRate
        }))} cx="50%" cy="50%" labelLine={false} label={({ value }) => `${value.toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {performanceMetrics?.topPerformers.slice(0, 5).map((entry, index) => (<recharts_1.Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]}/>))}
                    </recharts_1.Pie>
                    <recharts_1.Tooltip />
                    <recharts_1.Legend />
                  </recharts_1.PieChart>
                </recharts_1.ResponsiveContainer>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        {/* Templates Tab */}
        <tabs_1.TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Top Performing Templates</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-3">
                  {performanceMetrics?.topPerformers.slice(0, 5).map((template, index) => (<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <lucide_react_1.CheckCircle className="h-5 w-5 text-green-500"/>
                        <div>
                          <p className="font-medium text-sm">{template.templatePath.split('/').pop()}</p>
                          <p className="text-xs text-gray-500">
                            {template.totalUses} uses · {template.completionRate.toFixed(0)}% completion
                          </p>
                        </div>
                      </div>
                      {getTrendIcon(template.trend)}
                    </div>))}
                </div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Templates Needing Optimization</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-3">
                  {performanceMetrics?.needsOptimization.slice(0, 5).map((template, index) => (<div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <lucide_react_1.AlertCircle className="h-5 w-5 text-red-500"/>
                        <div>
                          <p className="font-medium text-sm">{template.templatePath.split('/').pop()}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(template.averageRenderTime)} · {template.errorRate.toFixed(1)}% errors
                          </p>
                        </div>
                      </div>
                      <button_1.Button size="sm" variant="outline">Optimize</button_1.Button>
                    </div>))}
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        {/* A/B Tests Tab */}
        <tabs_1.TabsContent value="ab-tests" className="space-y-4">
          {abTestResults.map((test) => (<card_1.Card key={test.testId}>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center justify-between">
                  <span>{test.testId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <span className={`text-sm px-2 py-1 rounded ${test.status === 'running' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {test.status}
                  </span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Sample Size: {test.sampleSize} | Significance: {test.statisticalSignificance.toFixed(1)}%
                  </p>
                </div>

                <div className="space-y-3">
                  {test.variants.map((variant) => (<div key={variant.variantId} className={`p-3 rounded-lg ${variant.isWinner ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{variant.variantId}</p>
                          <p className="text-sm text-gray-600">
                            Value: {variant.metricValue.toFixed(2)} | Samples: {variant.sampleSize}
                          </p>
                        </div>
                        {variant.isWinner && (<div className="flex items-center gap-2 text-green-600">
                            <lucide_react_1.Zap className="h-4 w-4"/>
                            <span className="text-sm font-medium">Winner</span>
                          </div>)}
                      </div>
                      <progress_1.Progress value={(variant.metricValue / 100) * 100} className="mt-2"/>
                    </div>))}
                </div>

                {test.recommendations.length > 0 && (<div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-sm mb-2">Recommendations:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {test.recommendations.map((rec, index) => (<li key={index}>• {rec}</li>))}
                    </ul>
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>))}
        </tabs_1.TabsContent>

        {/* Optimization Tab */}
        <tabs_1.TabsContent value="optimization" className="space-y-4">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Optimization Queue</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Automatic Optimization</h3>
                    <p className="text-sm text-gray-600">
                      Runs every hour to optimize underperforming templates
                    </p>
                  </div>
                  <button_1.Button>Run Now</button_1.Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Cache Preloading</h3>
                    <p className="text-sm text-gray-600">
                      Preload frequently used templates for better performance
                    </p>
                  </div>
                  <button_1.Button variant="outline">Configure</button_1.Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Clear Old Cache</h3>
                    <p className="text-sm text-gray-600">
                      Remove cache entries older than 7 days
                    </p>
                  </div>
                  <button_1.Button variant="destructive">Clear Cache</button_1.Button>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
