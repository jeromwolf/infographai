'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VideosPage;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const api_1 = require("@/lib/api");
function VideosPage() {
    const [videos, setVideos] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        fetchVideos();
        // PROCESSING 상태의 비디오가 있으면 자동 새로고침
        const interval = setInterval(() => {
            const hasProcessingVideos = videos.some(v => v.status?.toUpperCase() === 'PROCESSING');
            if (hasProcessingVideos) {
                fetchVideos();
            }
        }, 3000); // 3초마다 체크
        return () => clearInterval(interval);
    }, [videos]);
    const fetchVideos = async () => {
        try {
            const data = await api_1.api.getVideos();
            setVideos(data);
        }
        catch (error) {
            console.error('Failed to fetch videos:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDownload = async (video) => {
        if (!video.url) {
            alert('비디오 파일이 아직 생성되지 않았습니다.');
            return;
        }
        // API 서버 URL로 직접 다운로드
        const downloadUrl = `http://localhost:4906${video.url}`;
        window.open(downloadUrl, '_blank');
    };
    const handlePlay = (video) => {
        if (!video.url) {
            alert('비디오 파일이 아직 생성되지 않았습니다.');
            return;
        }
        // 새 창에서 비디오 재생
        const playUrl = `http://localhost:4906${video.url}`;
        window.open(playUrl, '_blank');
    };
    const handleRefresh = async () => {
        await fetchVideos();
    };
    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
                return <lucide_react_1.CheckCircle className="w-5 h-5 text-green-500"/>;
            case 'PROCESSING':
                return <lucide_react_1.Loader className="w-5 h-5 text-blue-500 animate-spin"/>;
            case 'FAILED':
                return <lucide_react_1.AlertCircle className="w-5 h-5 text-red-500"/>;
            case 'QUEUED':
            case 'PENDING':
                return <lucide_react_1.Clock className="w-5 h-5 text-gray-500"/>;
            default:
                return <lucide_react_1.Clock className="w-5 h-5 text-gray-500"/>;
        }
    };
    const getStatusText = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
                return '완료';
            case 'PROCESSING':
                return '처리 중';
            case 'FAILED':
                return '실패';
            case 'QUEUED':
            case 'PENDING':
                return '대기 중';
            default:
                return status;
        }
    };
    if (loading) {
        return (<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">비디오</h1>
          <div className="flex gap-2">
            <button onClick={handleRefresh} className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200" disabled={loading}>
              <lucide_react_1.RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`}/>
              새로고침
            </button>
            <link_1.default href="/dashboard/scenarios/new" className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              <lucide_react_1.Video className="w-5 h-5 mr-2"/>
              새 비디오 생성
            </link_1.default>
          </div>
        </div>

        {videos.length === 0 ? (<div className="text-center py-12 bg-white rounded-lg shadow">
            <lucide_react_1.Video className="mx-auto h-12 w-12 text-gray-400 mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">비디오가 없습니다</h3>
            <p className="text-gray-500 mb-4">시나리오를 작성하고 첫 번째 비디오를 생성해보세요</p>
            <link_1.default href="/dashboard/scenarios/new" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              시나리오 작성하기
            </link_1.default>
          </div>) : (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (<div key={video.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-gray-200 relative" onClick={() => video.status?.toUpperCase() === 'COMPLETED' && handlePlay(video)}>
                  {video.thumbnailUrl ? (<img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover"/>) : (<div className="flex items-center justify-center h-full">
                      <lucide_react_1.Video className="w-12 h-12 text-gray-400"/>
                    </div>)}
                  {video.status?.toUpperCase() === 'COMPLETED' && (<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity">
                      <lucide_react_1.Play className="w-12 h-12 text-white"/>
                    </div>)}
                  {video.status?.toUpperCase() === 'PROCESSING' && (<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <lucide_react_1.Loader className="w-12 h-12 text-white animate-spin"/>
                    </div>)}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                  {video.description && (<p className="text-gray-600 text-sm mb-3">{video.description}</p>)}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(video.status)}
                      <span className="text-sm text-gray-600">
                        {getStatusText(video.status)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '-:--'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    {video.status?.toUpperCase() === 'COMPLETED' && (<button onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(video);
                    }} className="flex items-center text-primary-600 hover:text-primary-700">
                        <lucide_react_1.Download className="w-4 h-4 mr-1"/>
                        다운로드
                      </button>)}
                  </div>
                  {video.status?.toUpperCase() === 'PROCESSING' && video.progress !== undefined && (<div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${video.progress}%` }}/>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{video.progress}% 완료</span>
                    </div>)}
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
}
