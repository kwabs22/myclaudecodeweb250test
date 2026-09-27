import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Social Trends Hub - Trending Topics Across Social Media',
  description: 'Discover trending topics, hashtags, and viral content across Twitter/X, TikTok, Reddit, and Instagram',
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
