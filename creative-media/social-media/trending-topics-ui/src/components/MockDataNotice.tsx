import { AlertTriangle, ExternalLink } from 'lucide-react';

export const REAL_SOURCES = [
  { name: 'X (Twitter)', what: 'Live trending topics', url: 'https://x.com/explore/tabs/trending', api: 'https://docs.x.com/', apiLabel: 'API docs' },
  { name: 'TikTok', what: 'Trending hashtags and sounds by country', url: 'https://ads.tiktok.com/business/creativecenter/hashtag/pc/en', api: 'https://developers.tiktok.com/products/research-api/', apiLabel: 'Research API' },
  { name: 'Reddit', what: 'Most popular posts right now', url: 'https://www.reddit.com/r/popular/', api: 'https://www.reddit.com/dev/api/', apiLabel: 'API docs' },
  { name: 'Instagram', what: 'No public trends page; Meta offers researcher access', url: 'https://transparency.meta.com/researchtools/meta-content-library', api: 'https://developers.facebook.com/docs/instagram-platform/', apiLabel: 'Platform docs' },
  { name: 'Google Trends', what: 'Search interest over time, across topics', url: 'https://trends.google.com/trends/', api: 'https://support.google.com/trends', apiLabel: 'Help centre' },
  { name: 'GitHub Trending', what: 'Repositories gaining stars today', url: 'https://github.com/trending', api: 'https://docs.github.com/en/rest', apiLabel: 'REST API' },
];

export function MockDataBanner() {
  return (
    <div role="note" className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-300 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-start gap-3 text-sm text-amber-900 dark:text-amber-100">
        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" aria-hidden />
        <p>
          <strong>Sample data.</strong> Every number, trend line, post and percentage on this page is made up to show what a trends dashboard could look like. Nothing here is pulled from X, TikTok, Reddit or Instagram.{' '}
          <a href="#real-data" className="underline font-medium">Where to find the real figures</a>
        </p>
      </div>
    </div>
  );
}

export function RealSources() {
  return (
    <section id="real-data" aria-labelledby="real-data-title" className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-6">
      <h2 id="real-data-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Where to find the real data</h2>
      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
        These are the official places to see what is actually trending, and the developer pages for building something live on top of them. Access rules and prices change, so check each one.
      </p>
      <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {REAL_SOURCES.map((s) => (
          <li key={s.name} className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
            <p className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{s.what}</p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                Open <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              </a>
              <a href={s.api} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                {s.apiLabel} <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              </a>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
