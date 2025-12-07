import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBaseUrl } from '@/config/app';

const inter = Inter({ subsets: ['latin'] });

const BASE_URL = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '静态状态发布系统',
    template: '%s | 静态状态发布系统',
  },
  description: '一个现代化的静态内容发布系统',
  openGraph: {
    title: '静态状态发布系统',
    description: '一个现代化的静态内容发布系统',
    url: BASE_URL,
    siteName: '静态状态发布系统',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: '随机的-google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}