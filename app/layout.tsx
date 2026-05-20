import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '블로그 자동화 대시보드',
  description: 'PT 트레이너 블로그 콘텐츠 생성 & 관리',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white">
        <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">블로그 자동화</span>
              <span className="text-xs text-gray-400 font-normal">PT 트레이너 콘텐츠 머신</span>
            </div>
            <nav className="flex gap-1">
              <a
                href="/"
                className="text-sm px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                히스토리
              </a>
              <a
                href="/generate"
                className="text-sm px-3 py-1.5 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors font-medium"
              >
                새 글 생성
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
