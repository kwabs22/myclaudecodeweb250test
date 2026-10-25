'use client';

import { useMemo, useState } from 'react';
import { Search, X, Clock, MessageCircle } from 'lucide-react';
import { trendingTopics, topicDetails, topicCategories } from '@/data/trendingTopics';
import { TrendingTopic } from '@/types/trending';
import TrendingBadge from './TrendingBadge';
import Sparkline from './Sparkline';
import PlatformSplit from './PlatformSplit';

type Sort = 'score' | 'posts' | 'change';
const SORTS: { id: Sort; label: string }[] = [
  { id: 'score', label: 'Score' },
  { id: 'posts', label: 'Posts' },
  { id: 'change', label: 'Fastest change' },
];

export default function TopicExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<Sort>('score');
  const [openId, setOpenId] = useState<string>(trendingTopics[0].id);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trendingTopics
      .filter((t) => !category || t.category === category)
      .filter((t) => !q || `${t.title} ${t.description} ${t.tags.join(' ')}`.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === 'score' ? b.trendingScore - a.trendingScore : sort === 'posts' ? b.postsCount - a.postsCount : Math.abs(b.changePercentage) - Math.abs(a.changePercentage),
      );
  }, [query, category, sort]);

  const open = trendingTopics.find((t) => t.id === openId) ?? shown[0];
  const detail = open ? topicDetails[open.id] : null;
  const byId = (id: string): TrendingTopic | undefined => trendingTopics.find((t) => t.id === id);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="relative flex-1 min-w-[200px]">
          <span className="sr-only">Search topics</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, tags, descriptions"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-9 pr-8 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </label>
        <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter by category">
        {['', ...topicCategories].map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              category === c
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-500'
            }`}
          >
            {c || 'All'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <ul className="lg:col-span-2 space-y-2 lg:max-h-[640px] lg:overflow-y-auto pr-1">
          {shown.length === 0 && <li className="text-sm text-gray-500 dark:text-gray-400 p-4">No topics match. Clear the search or pick another category.</li>}
          {shown.map((t, i) => (
            <li key={t.id}>
              <button
                onClick={() => setOpenId(t.id)}
                aria-pressed={open?.id === t.id}
                className={`w-full text-left p-3 rounded-lg border bg-white dark:bg-gray-800 transition-all ${
                  open?.id === t.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate"><span className="text-gray-400 mr-1.5 text-sm">{i + 1}</span>{t.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.category} · {t.postsCount.toLocaleString()} posts</p>
                  </div>
                  <TrendingBadge change={t.change} percentage={t.changePercentage} />
                </div>
                <Sparkline values={topicDetails[t.id].history} width={200} height={26} className="mt-2" />
              </button>
            </li>
          ))}
        </ul>

        {open && detail && (
          <article className="lg:col-span-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm" aria-live="polite">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{open.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{open.category}</p>
              </div>
              <TrendingBadge change={open.change} percentage={open.changePercentage} />
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{open.description}</p>

            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                ['Score', open.trendingScore.toLocaleString()],
                ['Posts', open.postsCount.toLocaleString()],
                ['Peak hour', detail.peakHour],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
                  <dt className="text-xs text-gray-500 dark:text-gray-400">{k}</dt>
                  <dd className="mt-0.5 font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>

            <h4 className="mt-5 mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />Score, last 14 days</h4>
            <Sparkline values={detail.history} width={520} height={110} labelled />

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Where it is posted</h4>
                <PlatformSplit shares={detail.platforms} />
              </div>
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tone of posts</h4>
                <div className="flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label={`${detail.sentiment.positive} percent positive, ${detail.sentiment.neutral} neutral, ${detail.sentiment.negative} negative`}>
                  <div className="bg-green-500" style={{ width: `${detail.sentiment.positive}%` }} />
                  <div className="bg-gray-400" style={{ width: `${detail.sentiment.neutral}%` }} />
                  <div className="bg-red-500" style={{ width: `${detail.sentiment.negative}%` }} />
                </div>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  {detail.sentiment.positive}% positive · {detail.sentiment.neutral}% neutral · {detail.sentiment.negative}% negative
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {open.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <h4 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 flex items-center gap-1"><MessageCircle className="w-3 h-3" />Top posts (sample)</h4>
            <ul className="space-y-2">
              {detail.topPosts.map((p) => (
                <li key={p.author + p.text} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-sm">
                  <p className="text-gray-800 dark:text-gray-200">{p.text}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{p.author} on {p.platform} · {p.likes.toLocaleString()} likes</p>
                </li>
              ))}
            </ul>

            <h4 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Related topics</h4>
            <div className="flex flex-wrap gap-2">
              {detail.related.map(byId).filter((t): t is TrendingTopic => !!t).map((t) => (
                <button key={t.id} onClick={() => { setCategory(''); setQuery(''); setOpenId(t.id); }} className="px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-500">
                  {t.title}
                </button>
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
