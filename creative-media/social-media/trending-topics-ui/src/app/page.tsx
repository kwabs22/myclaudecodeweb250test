'use client';

import { useEffect, useState } from 'react';
import TopicExplorer from '@/components/TopicExplorer';
import PlatformOverview from '@/components/PlatformOverview';
import HashtagTable from '@/components/HashtagTable';
import { MockDataBanner, RealSources } from '@/components/MockDataNotice';
import TrendingRepoCard from '@/components/TrendingRepoCard';
import { trendingTopics, trendingRepositories, trendingHashtags } from '@/data/trendingTopics';
import { fetchLiveRepos, LiveError, LiveResult } from '@/lib/github';
import { TrendingRepository } from '@/types/trending';
import { TrendingUp, Github, Hash, Moon, Sun, Layers, Flame } from 'lucide-react';

type LiveState = { status: 'idle' | 'loading' | 'ok' | 'error'; repos: TrendingRepository[]; message: string; fetchedAt: number; fromCache: boolean };

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState<'sample' | 'live'>('sample');
  const [live, setLive] = useState<LiveState>({ status: 'idle', repos: [], message: '', fetchedAt: 0, fromCache: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (mode !== 'live') return;
    const controller = new AbortController();
    setLive((s) => ({ ...s, status: 'loading', message: '' }));
    fetchLiveRepos(controller.signal)
      .then((r: LiveResult) => setLive({ status: 'ok', repos: r.repos, message: '', fetchedAt: r.fetchedAt, fromCache: r.fromCache }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        const err = e instanceof LiveError ? e : new LiveError('Something went wrong fetching live data.');
        const when = err.resetAt ? ` Try again after ${new Date(err.resetAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.` : '';
        setLive((s) => ({ ...s, status: 'error', message: err.message + when }));
      });
    return () => controller.abort();
  }, [mode, attempt]);

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
                Compare platforms, open a topic to see its 14-day trend, where it is posted and how people feel about it. All figures are sample data for the demo; only the repositories section can be switched to live GitHub results.
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
                  {mode === 'live' ? 'New on GitHub this week' : 'Social Media Repositories'}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-3" role="group" aria-label="Repository data source">
                <button
                  type="button"
                  aria-pressed={mode === 'sample'}
                  onClick={() => setMode('sample')}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${mode === 'sample' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}
                >
                  Sample
                </button>
                <button
                  type="button"
                  aria-pressed={mode === 'live'}
                  onClick={() => setMode('live')}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${mode === 'live' ? 'bg-green-600 border-green-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}
                >
                  Live from GitHub
                </button>
              </div>
              {mode === 'sample' ? (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Open-source projects for building social media trending features. Star counts are sample figures; check each repository on GitHub for the current number.
                </p>
              ) : (
                <div className="mb-4 space-y-1 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
                  <p>
                    The ten new repositories from the last 7 days with the most stars, straight from GitHub's search. GitHub's own Trending page uses a different measure, so the lists will not match.
                  </p>
                  <p>
                    Free to use: your browser asks GitHub's public API directly, with no key and no server of ours in between, so nothing is billed to anyone. Visitors without a GitHub token get 10 searches a minute, so the answer is kept for 15 minutes.
                  </p>
                  {live.status === 'loading' && <p className="font-medium">Loading from GitHub…</p>}
                  {live.status === 'ok' && (
                    <p className="font-medium text-green-700 dark:text-green-400">
                      Fetched {new Date(live.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {live.fromCache ? ' (kept from earlier)' : ''}.
                    </p>
                  )}
                  {live.status === 'error' && (
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      {live.message}{' '}
                      <button type="button" className="underline" onClick={() => setAttempt((n) => n + 1)}>Try again</button>
                      {' · '}
                      <button type="button" className="underline" onClick={() => setMode('sample')}>Back to sample data</button>
                    </p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(mode === 'live' && live.status === 'ok' ? live.repos : mode === 'live' ? [] : trendingRepositories).map((repo) => (
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
              <p className="mt-2">Social Media Trending Topics &copy; 2025. All data shown is sample data, except the repositories when switched to Live.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
