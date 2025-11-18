'use client';

import { useState } from 'react';
import TrendingTopicsWidget from '@/components/TrendingTopicsWidget';
import TrendingRepoCard from '@/components/TrendingRepoCard';
import { trendingTopics, trendingRepositories, trendingFunctions } from '@/data/trendingTopics';
import { Gamepad2, Github, Code2, Moon, Sun } from 'lucide-react';

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
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Game Dev Hub
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Discover trending topics in game development
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
                  Welcome to Game Dev Trending Topics
                </h2>
                <p className="text-blue-100 mb-4">
                  Stay up-to-date with the latest trends in game development. Explore trending
                  topics, repositories, and popular functions across major game engines.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">{trendingTopics.length}</p>
                    <p className="text-sm text-blue-100 mt-1">Trending Topics</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">{trendingRepositories.length}</p>
                    <p className="text-sm text-blue-100 mt-1">Hot Repos</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">{trendingFunctions.length}</p>
                    <p className="text-sm text-blue-100 mt-1">Top Functions</p>
                  </div>
                </div>
              </section>

              {/* Trending Repositories */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Trending Repositories
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingRepositories.map((repo) => (
                    <TrendingRepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </section>

              {/* Trending Functions */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Popular Functions
                  </h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Function
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Complexity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Usage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {trendingFunctions.map((func) => (
                          <tr
                            key={func.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                                {func.name}()
                              </code>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {func.project}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                {func.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  func.complexity === 'High'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    : func.complexity === 'Medium'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                }`}
                              >
                                {func.complexity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {func.usageCount.toLocaleString()}
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
              <p className="mt-2">Game Development Trending Topics &copy; 2025</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
