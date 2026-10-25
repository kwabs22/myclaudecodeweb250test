import { platformStats } from '@/data/trendingTopics';
import Sparkline from './Sparkline';
import { PLATFORM_COLOURS } from './PlatformSplit';

export default function PlatformOverview() {
  const total = platformStats.reduce((s, p) => s + p.posts, 0);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {platformStats.map((p) => {
        const growth = ((p.history[13] - p.history[0]) / p.history[0]) * 100;
        return (
          <div key={p.platform} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <span className={`h-3 w-3 rounded-sm ${PLATFORM_COLOURS[p.platform]}`} aria-hidden />
                {p.platform}
              </h3>
              <span className={`text-xs font-medium ${growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {growth >= 0 ? '+' : ''}{growth.toFixed(0)}% in 14 days
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {p.posts.toLocaleString()} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">posts · {Math.round((p.posts / total) * 100)}% of all</span>
            </p>
            <Sparkline values={p.history} width={260} height={52} className="mt-2" />
            <dl className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between gap-3"><dt className="text-gray-500 dark:text-gray-400">Biggest topic</dt><dd className="font-medium text-right">{p.topTopic.title}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-gray-500 dark:text-gray-400">Top hashtag</dt><dd className="font-medium text-right">#{p.topHashtag.name}</dd></div>
            </dl>
          </div>
        );
      })}
    </div>
  );
}
