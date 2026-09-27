export type TrendChange = 'up' | 'down' | 'stable';

export interface TrendingTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  trendingScore: number;
  postsCount: number;
  change: TrendChange;
  changePercentage: number;
  tags: string[];
}

export interface TrendingRepository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  language: string;
  trending: boolean;
  change: TrendChange;
  starsToday: number;
}

export interface TrendingFunction {
  id: string;
  name: string;
  project: string;
  complexity: string;
  usageCount: number;
  category: string;
  trending: boolean;
}
