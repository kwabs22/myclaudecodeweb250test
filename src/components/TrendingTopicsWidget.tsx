'use client';

import { useState } from 'react';
import { TrendingTopic } from '@/types/trending';
import TrendingTopicItem from './TrendingTopicItem';
import { TrendingUp, Filter, Clock } from 'lucide-react';

interface TrendingTopicsWidgetProps {
  topics: TrendingTopic[];
  title?: string;
  maxItems?: number;
}

export default function TrendingTopicsWidget({
  topics,
  title = 'Trending Topics',
  maxItems = 8
}: TrendingTopicsWidgetProps) {
  const [filter, setFilter] = useState<'all' | 'up' | 'down'>('all');

  const filteredTopics = topics
    .filter(topic => filter === 'all' || topic.change === filter)
    .slice(0, maxItems);

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated 5 min ago
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'up' | 'down')}
            className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="up">Rising</option>
            <option value="down">Falling</option>
          </select>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredTopics.map((topic, index) => (
          <TrendingTopicItem key={topic.id} topic={topic} rank={index + 1} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Showing {filteredTopics.length} of {topics.length} trending topics
        </p>
      </div>
    </div>
  );
}
