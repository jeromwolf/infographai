import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InfoGraphAI - AI 교육 비디오 생성 플랫폼',
  description: '자막 중심의 IT 교육 콘텐츠 자동 생성 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Caveat:wght@400;500;600;700&family=Shadows+Into+Light&family=Amatic+SC:wght@400;700&family=Permanent+Marker&family=Indie+Flower&family=Patrick+Hand&family=Gloria+Hallelujah&family=Pacifico&family=Dancing+Script:wght@400;500;600;700&family=Satisfy&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}