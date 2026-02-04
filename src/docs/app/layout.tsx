import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'DB Toolkit Docs',
  description: 'Documentation for DB Toolkit - Modern cross-platform database management'
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
