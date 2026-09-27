import { TrendChange } from '@/types/trending';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendingBadgeProps {
  change: TrendChange;
  percentage: number;
}

export default function TrendingBadge({ change, percentage }: TrendingBadgeProps) {
  const getChangeStyles = () => {
    switch (change) {
      case 'up':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
      case 'down':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30';
      case 'stable':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getIcon = () => {
    switch (change) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      case 'stable':
        return <Minus className="w-3 h-3" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getChangeStyles()}`}>
      {getIcon()}
      {Math.abs(percentage).toFixed(1)}%
    </span>
  );
}
