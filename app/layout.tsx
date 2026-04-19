import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Premium Stopwatch',
  description: 'A modern responsive stopwatch app with lap tracking, themes, and PWA support.',
  metadataBase: new URL('https://stopwatch-modern.vercel.app'),
  openGraph: {
    title: 'Premium Stopwatch',
    description: 'A modern responsive stopwatch app with lap tracking, themes, and PWA support.',
    type: 'website'
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg'
  },
  manifest: '/manifest.json'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = JSON.parse(localStorage.getItem('stopwatch-modern-storage') || '{}').state?.theme || 'dark';
                if (theme === 'dark') {
                  document.body.classList.add('dark');
                } else {
                  document.body.classList.remove('dark');
                }
              } catch (e) {
                document.body.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
