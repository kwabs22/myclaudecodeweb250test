import { TrendingRepository } from '@/types/trending';
import TrendingBadge from './TrendingBadge';
import { Star, Code } from 'lucide-react';
import { daysAgo } from '@/lib/github';

interface TrendingRepoCardProps {
  repo: TrendingRepository;
}

export default function TrendingRepoCard({ repo }: TrendingRepoCardProps) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-md transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {repo.url ? (
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {repo.owner}/{repo.name}
              </a>
            ) : (
              <>{repo.owner}/{repo.name}</>
            )}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
            <Code className="w-3 h-3" />
            {repo.language}
          </p>
        </div>
        {repo.live ? (
          <span className="text-xs font-medium rounded-full px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">Live</span>
        ) : (
          <TrendingBadge change={repo.change} percentage={(repo.starsToday / repo.stars) * 100} />
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
        {repo.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          {repo.stars.toLocaleString()}
        </span>
        {repo.live && repo.createdAt ? (
          <span className="text-green-600 dark:text-green-400 font-medium">
            created {daysAgo(repo.createdAt) === 0 ? 'today' : `${daysAgo(repo.createdAt)} days ago`}
          </span>
        ) : (
          <span className="text-green-600 dark:text-green-400 font-medium">
            +{repo.starsToday} today
          </span>
        )}
      </div>
    </div>
  );
}
