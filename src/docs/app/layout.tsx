import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'DB Toolkit Documentation',
  description: 'Modern cross-platform database management application - Documentation for PostgreSQL, MySQL, SQLite, and MongoDB',
  keywords: ['database', 'postgresql', 'mysql', 'sqlite', 'mongodb', 'database management', 'sql editor', 'query builder'],
  authors: [{ name: 'DB Toolkit Team' }],
  openGraph: {
    title: 'DB Toolkit Documentation',
    description: 'Modern cross-platform database management application',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
