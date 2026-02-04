import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'DB Toolkit Documentation',
  description: 'Free, open-source, and modern cross-platform database management application - Documentation for PostgreSQL, MySQL, SQLite, and MongoDB',
  keywords: ['database', 'postgresql', 'mysql', 'sqlite', 'mongodb', 'database management', 'sql editor', 'free', 'open source', 'modern'],
  authors: [{ name: 'DB Toolkit Team' }],
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: 'DB Toolkit Documentation',
    description: 'Free, open-source, and modern cross-platform database management application',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
