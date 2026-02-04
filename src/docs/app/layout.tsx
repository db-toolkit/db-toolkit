import './globals.css';

export const metadata = {
  title: 'DB Toolkit Docs',
  description: 'Documentation for DB Toolkit'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
