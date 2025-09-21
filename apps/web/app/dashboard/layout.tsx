'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Home,
  Video,
  FolderOpen,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';

const navigation = [
  { name: '대시보드', href: '/dashboard', icon: Home },
  { name: '프로젝트', href: '/dashboard/projects', icon: FolderOpen },
  { name: '비디오', href: '/dashboard/videos', icon: Video },
  { name: '비용 관리', href: '/dashboard/costs', icon: CreditCard },
  { name: '설정', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 테스트 모드 체크 (URL에 ?test=true가 있으면 로그인 스킵)
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.get('test') === 'true';

    if (isTestMode) {
      // 테스트 모드: 로그인 없이 바로 사용
      setLoading(false);
      return;
    }

    // 로그인 상태 확인
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // 토큰 유효성 검증
        await api.getCurrentUser();
        setLoading(false);
      } catch (error) {
        // 토큰이 유효하지 않으면 로그인 페이지로
        api.clearToken();
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    api.logout();
    router.push('/');
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
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-primary-600">InfoGraphAI</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 group block w-full"
            >
              <div className="flex items-center">
                <LogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    로그아웃
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop with toggle */}
      <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ${
        desktopSidebarOpen ? 'md:w-64' : 'md:w-16'
      }`}>
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              {desktopSidebarOpen ? (
                <h1 className="text-2xl font-bold text-primary-600">InfoGraphAI</h1>
              ) : (
                <h1 className="text-xl font-bold text-primary-600">IG</h1>
              )}
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  title={!desktopSidebarOpen ? item.name : undefined}
                >
                  <item.icon className={desktopSidebarOpen ? "mr-3 h-5 w-5" : "mx-auto h-5 w-5"} />
                  {desktopSidebarOpen && item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block"
              title={!desktopSidebarOpen ? "로그아웃" : undefined}
            >
              <div className="flex items-center">
                <LogOut className={`inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500 ${
                  !desktopSidebarOpen ? 'mx-auto' : ''
                }`} />
                {desktopSidebarOpen && (
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      로그아웃
                    </p>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
          className="absolute -right-3 top-8 z-40 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 shadow-md"
        >
          {desktopSidebarOpen ? (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Main content */}
      <div className={`${desktopSidebarOpen ? 'md:pl-64' : 'md:pl-16'} flex flex-col flex-1 transition-all duration-300`}>
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}