'use client';

import { useState } from 'react';
import TrendingTopicsWidget from '@/components/TrendingTopicsWidget';
import TrendingRepoCard from '@/components/TrendingRepoCard';
import { trendingTopics, trendingRepositories, trendingHashtags } from '@/data/trendingTopics';
import { TrendingUp, Github, Hash, Moon, Sun } from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome Section */}
              <section className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-3">
                  Welcome to Social Trends Hub
                </h2>
                <p className="text-blue-100 mb-4">
                  Stay up-to-date with what's trending across Twitter/X, TikTok, Reddit, and Instagram.
                  Explore viral hashtags, trending repositories, and popular topics in real-time.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
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

              {/* Trending Repositories */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Social Media Repositories
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Open-source projects for building social media trending features
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingRepositories.map((repo) => (
                    <TrendingRepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </section>

              {/* Viral Hashtags */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Viral Hashtags Across Platforms
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Most-used hashtags trending on Twitter/X, TikTok, Reddit, and Instagram
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Hashtag
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Platform
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Popularity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Posts
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {trendingHashtags.map((hashtag) => (
                          <tr
                            key={hashtag.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                #{hashtag.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {hashtag.project}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                {hashtag.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  hashtag.complexity === 'High'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    : hashtag.complexity === 'Medium'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                }`}
                              >
                                {hashtag.complexity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {hashtag.usageCount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar - Trending Topics Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <TrendingTopicsWidget topics={trendingTopics} maxItems={8} />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Built with Next.js, React, TypeScript, and Tailwind CSS</p>
              <p className="mt-2">Social Media Trending Topics &copy; 2025</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
