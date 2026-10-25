'use client';

import { useState } from 'react';
import { trendingHashtags, PLATFORMS } from '@/data/trendingTopics';
import { Platform } from '@/types/trending';
import { PLATFORM_COLOURS } from './PlatformSplit';

type SortKey = 'usageCount' | 'weeklyChange';

export default function HashtagTable() {
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [sort, setSort] = useState<SortKey>('usageCount');
  const rows = trendingHashtags.filter((h) => !platform || h.platform === platform).sort((a, b) => b[sort] - a[sort]);
  const max = Math.max(...trendingHashtags.map((h) => h.usageCount));
  const th = 'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider';
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Filter hashtags by platform">
        {(['', ...PLATFORMS] as (Platform | '')[]).map((p) => (
          <button key={p || 'all'} onClick={() => setPlatform(p)} aria-pressed={platform === p}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${platform === p ? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}>
            {p || 'All platforms'}
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className={th}>Hashtag</th>
              <th className={th}>Platform</th>
              <th className={th}>Category</th>
              <th className={th} aria-sort={sort === 'usageCount' ? 'descending' : 'none'}>
                <button onClick={() => setSort('usageCount')} className="uppercase tracking-wider">Posts{sort === 'usageCount' ? ' ↓' : ''}</button>
              </th>
              <th className={th} aria-sort={sort === 'weeklyChange' ? 'descending' : 'none'}>
                <button onClick={() => setSort('weeklyChange')} className="uppercase tracking-wider">7-day change{sort === 'weeklyChange' ? ' ↓' : ''}</button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">#{h.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  <span className="inline-flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-sm ${PLATFORM_COLOURS[h.platform]}`} aria-hidden />{h.platform}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">{h.category}</span></td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 tabular-nums">
                  <div className="flex items-center gap-2 min-w-[150px]">
                    <span className="w-14 text-right">{h.usageCount.toLocaleString()}</span>
                    <span className="h-1.5 flex-1 rounded-full bg-gray-100 dark:bg-gray-700" aria-hidden><span className="block h-1.5 rounded-full bg-blue-500" style={{ width: `${(h.usageCount / max) * 100}%` }} /></span>
                  </div>
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium tabular-nums ${h.weeklyChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {h.weeklyChange >= 0 ? '+' : ''}{h.weeklyChange.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
