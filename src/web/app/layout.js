import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import NavigationLoader from '@/components/NavigationLoader';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap'
});

export const metadata = {
  title: 'DB Toolkit - Modern Database Management',
  description: 'A modern, cross-platform desktop database management application',
  keywords: 'database management, PostgreSQL, MySQL, SQLite, MongoDB, database tool',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'DB Toolkit - Modern Database Management',
    description: 'A modern, cross-platform desktop database management application',
    url: 'https://dbtoolkit.vercel.app',
    siteName: 'DB Toolkit',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="47cd7af1-cab5-45dc-b6b6-f6809eae9649"></script>
      </head>
      <body className={playfair.className}>
        <ThemeProvider>
          <NavigationLoader />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
