import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Game Dev Trending Topics',
  description: 'Discover trending topics in game development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
