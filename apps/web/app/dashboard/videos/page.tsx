'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video, Play, Download, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { api } from '@/lib/api';

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const data = await api.getVideos();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string, title: string) => {
    try {
      const response = await api.downloadVideo(id);
      // 다운로드 로직 구현
      console.log('Downloading video:', title);
    } catch (error) {
      console.error('Failed to download video:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'processing':
        return '처리 중';
      case 'failed':
        return '실패';
      case 'pending':
        return '대기 중';
      default:
        return status;
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
          <h1 className="text-3xl font-bold text-gray-900">비디오</h1>
          <Link
            href="/dashboard/scenarios/new"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <Video className="w-5 h-5 mr-2" />
            새 비디오 생성
          </Link>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">비디오가 없습니다</h3>
            <p className="text-gray-500 mb-4">시나리오를 작성하고 첫 번째 비디오를 생성해보세요</p>
            <Link
              href="/dashboard/scenarios/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              시나리오 작성하기
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-video bg-gray-200 relative">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {video.status === 'completed' && (
                    <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                  )}
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
                    {video.status === 'completed' && (
                      <button
                        onClick={() => handleDownload(video.id, video.title)}
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        다운로드
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}