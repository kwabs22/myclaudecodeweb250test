import { TrendingTopic } from '@/types/trending';
import TrendingBadge from './TrendingBadge';
import { MessageCircle, Tag } from 'lucide-react';

interface TrendingTopicItemProps {
  topic: TrendingTopic;
  rank: number;
}

export default function TrendingTopicItem({ topic, rank }: TrendingTopicItemProps) {
  return (
    <div className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800 animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 min-w-[24px]">
            #{rank}
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {topic.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {topic.category}
            </p>
          </div>
        </div>
        <TrendingBadge change={topic.change} percentage={topic.changePercentage} />
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
        {topic.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {topic.postsCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            {topic.tags.length} tags
          </span>
        </div>
        <div className="text-xs font-medium text-gray-400 dark:text-gray-500">
          {topic.trendingScore.toLocaleString()} pts
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        {topic.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
