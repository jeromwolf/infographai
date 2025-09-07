import Link from 'next/link'
import { ArrowRight, Video, Zap, Globe, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">InfoGraphAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                로그인
              </Link>
              <Link href="/register" className="btn-primary">
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              AI로 만드는 <span className="text-primary-600">IT 교육 비디오</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              복잡한 IT 개념을 시각적으로 설명하는 교육 비디오를 자동으로 생성합니다.
              자막 중심 설계로 60% 비용 절감!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register" className="btn-primary inline-flex items-center px-6 py-3 text-lg">
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/demo" className="btn-secondary inline-flex items-center px-6 py-3 text-lg">
                데모 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">주요 기능</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">AI 스크립트 생성</h4>
              <p className="text-gray-600">
                주제만 입력하면 교육 콘텐츠를 자동으로 작성
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">인포그래픽 비디오</h4>
              <p className="text-gray-600">
                다이어그램과 애니메이션으로 복잡한 개념 설명
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">한국어 최적화</h4>
              <p className="text-gray-600">
                자연스러운 한국어 자막과 조사 처리
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">60% 비용 절감</h4>
              <p className="text-gray-600">
                자막 중심 설계로 TTS 비용 제거
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">작동 방식</h3>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  1
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold mb-1">주제 입력</h4>
                  <p className="text-gray-600">
                    설명하고 싶은 IT 개념이나 기술 주제를 입력합니다
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  2
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold mb-1">AI 스크립트 생성</h4>
                  <p className="text-gray-600">
                    GPT-4가 교육적이고 이해하기 쉬운 스크립트를 작성합니다
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  3
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold mb-1">비디오 생성</h4>
                  <p className="text-gray-600">
                    인포그래픽과 애니메이션으로 시각화된 비디오를 생성합니다
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  4
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold mb-1">다운로드 & 공유</h4>
                  <p className="text-gray-600">
                    완성된 비디오를 다운로드하거나 YouTube로 직접 업로드합니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            지금 시작하세요
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            매달 5개 비디오 무료 생성
          </p>
          <Link href="/register" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center">
            무료 계정 만들기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2024 InfoGraphAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}