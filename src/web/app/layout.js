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
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
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
