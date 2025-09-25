import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { IBM_Plex_Mono } from 'next/font/google';

export const metadata: Metadata = {
  title: 'music pattern quests',
  description: 'an intelligent abc notation editor and playback tool.',
  openGraph: {
    title: 'music pattern quests',
    description: 'an intelligent abc notation editor and playback tool.',
    images: [
      {
        url: 'https://isaaccavallaro.github.io/music-pattern-quests/pyra-logo.png',
        width: 1200,
        height: 630,
        alt: 'Music Pattern Quests - ABC notation editor',
      },
    ],
    type: 'website',
    siteName: 'Music Pattern Quests',
    url: 'https://isaaccavallaro.github.io/music-pattern-quests/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'music pattern quests',
    description: 'an intelligent abc notation editor and playback tool.',
    images: ['https://isaaccavallaro.github.io/music-pattern-quests/pyra-logo.png'],
  },
};

const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;1,7..72,400;1,7..72,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background', fontMono.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}