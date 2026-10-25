'use client';

import { useState } from 'react';
import TopicExplorer from '@/components/TopicExplorer';
import PlatformOverview from '@/components/PlatformOverview';
import HashtagTable from '@/components/HashtagTable';
import { MockDataBanner, RealSources } from '@/components/MockDataNotice';
import TrendingRepoCard from '@/components/TrendingRepoCard';
import { trendingTopics, trendingRepositories, trendingHashtags } from '@/data/trendingTopics';
import { TrendingUp, Github, Hash, Moon, Sun, Layers, Flame } from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const totalPosts = trendingTopics.reduce((sum, t) => sum + t.postsCount, 0);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Social Trends Hub
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Discover what's trending across social media platforms
                  </p>
                </div>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </header>

        <MockDataBanner />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-12">
            {/* Welcome Section */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-3">
                Welcome to Social Trends Hub
              </h2>
              <p className="text-blue-100 mb-4">
                Stay up-to-date with what's trending across Twitter/X, TikTok, Reddit, and Instagram.
                Compare platforms, open a topic to see its 14-day trend, where it is posted and how people feel about it. All figures are sample data for the demo, not a live feed.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">{totalPosts.toLocaleString()}</p>
                  <p className="text-sm text-blue-100 mt-1">Posts tracked</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">{trendingTopics.length}</p>
                  <p className="text-sm text-blue-100 mt-1">Trending Topics</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">{trendingRepositories.length}</p>
                  <p className="text-sm text-blue-100 mt-1">Social Repos</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">{trendingHashtags.length}</p>
                  <p className="text-sm text-blue-100 mt-1">Viral Hashtags</p>
                </div>
              </div>
            </section>


            <section aria-labelledby="platforms">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 id="platforms" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Platforms compared</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Posts across the ten topics below, split by where they were posted, with each platform's combined trend.</p>
              <PlatformOverview />
            </section>

            <section aria-labelledby="topics">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 id="topics" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Trending topics</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Search, filter and sort, then pick a topic for the detail.</p>
              <TopicExplorer />
            </section>

            <section aria-labelledby="tags">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 id="tags" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Viral hashtags</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Most-used hashtags by platform. Sort by volume or by how fast they grew this week.</p>
              <HashtagTable />
            </section>

            {/* Trending Repositories */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Social Media Repositories
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Open-source projects for building social media trending features. Star counts are sample figures; check each repository on GitHub for the current number.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingRepositories.map((repo) => (
                  <TrendingRepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </section>


            <RealSources />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Built with Next.js, React, TypeScript, and Tailwind CSS</p>
              <p className="mt-2">Social Media Trending Topics &copy; 2025. All data shown is sample data.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
