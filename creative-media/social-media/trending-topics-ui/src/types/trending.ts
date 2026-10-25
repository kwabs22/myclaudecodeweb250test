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

export type Platform = 'Twitter/X' | 'TikTok' | 'Reddit' | 'Instagram';

export interface SamplePost {
  platform: Platform;
  author: string;
  text: string;
  likes: number;
}

/** Extra detail shown when a topic is opened. Sample data, not a live feed. */
export interface TopicDetail {
  /** Daily trending score for the last 14 days, oldest first. */
  history: number[];
  /** Share of posts per platform, in percent. Sums to 100. */
  platforms: Record<Platform, number>;
  /** Share of posts by tone, in percent. Sums to 100. */
  sentiment: { positive: number; neutral: number; negative: number };
  peakHour: string;
  related: string[];
  topPosts: SamplePost[];
}

export interface TrendingHashtag {
  id: string;
  name: string;
  platform: Platform;
  category: string;
  usageCount: number;
  /** Change in usage over the last 7 days, in percent. */
  weeklyChange: number;
}
