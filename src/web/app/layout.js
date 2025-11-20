import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap'
});

export const metadata = {
  title: 'DB Toolkit - Modern Database Management',
  description: 'A modern, cross-platform desktop database management application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={playfair.className}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
