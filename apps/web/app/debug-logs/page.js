'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DebugLogsPage;
const react_1 = require("react");
function DebugLogsPage() {
    const [logs, setLogs] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // 로컬 스토리지에서 로그 가져오기
        const loadLogs = () => {
            const savedLogs = localStorage.getItem('textCenteringLogs');
            if (savedLogs) {
                setLogs(JSON.parse(savedLogs));
            }
        };
        // 초기 로드
        loadLogs();
        // 1초마다 업데이트
        const interval = setInterval(loadLogs, 1000);
        return () => clearInterval(interval);
    }, []);
    const clearLogs = () => {
        localStorage.removeItem('textCenteringLogs');
        setLogs([]);
    };
    const exportLogs = () => {
        const dataStr = JSON.stringify(logs, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `text-centering-logs-${Date.now()}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };
    return (<div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🎯 Text Centering Debug Logs</h1>
          <div className="flex gap-2">
            <button onClick={clearLogs} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
              Clear Logs
            </button>
            <button onClick={exportLogs} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
              Export JSON
            </button>
            <a href="/dashboard/builder?test=true" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded inline-block">
              Back to Builder
            </a>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">
            Total Logs: {logs.length}
          </div>

          {logs.length === 0 ? (<div className="text-center py-8 text-gray-500">
              No logs yet. Visit the builder page to generate logs.
            </div>) : (<div className="space-y-2 max-h-screen overflow-y-auto">
              {logs.map((log, index) => (<div key={index} className="bg-gray-700 p-3 rounded">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Text:</span>{' '}
                      <span className="text-yellow-400 font-mono">"{log.text}"</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Time:</span>{' '}
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    <div>
                      <span className="text-gray-400">Original X:</span>{' '}
                      <span className="text-blue-400">{log.originalX?.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Center X:</span>{' '}
                      <span className="text-green-400">{log.centerX?.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Text Width:</span>{' '}
                      <span className="text-purple-400">{log.textWidth?.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Final X:</span>{' '}
                      <span className="text-red-400">{log.finalX?.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Original Y:</span>{' '}
                      <span className="text-blue-400">{log.originalY?.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Center Y:</span>{' '}
                      <span className="text-green-400">{log.centerY?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>))}
            </div>)}
        </div>

        <div className="mt-6 bg-yellow-900/50 border border-yellow-600 p-4 rounded">
          <h2 className="text-yellow-400 font-bold mb-2">📊 분석 요약</h2>
          {logs.length > 0 && (<div className="space-y-1 text-sm">
              <div>• 평균 텍스트 너비: {(logs.reduce((sum, log) => sum + (log.textWidth || 0), 0) / logs.length).toFixed(1)}px</div>
              <div>• 평균 Final X: {(logs.reduce((sum, log) => sum + (log.finalX || 0), 0) / logs.length).toFixed(1)}</div>
              <div>• 중앙 정렬된 텍스트: {logs.filter(log => log.shouldCenter).length}개</div>
            </div>)}
        </div>
      </div>
    </div>);
}
