import {
  TrendingTopic,
  TrendingRepository,
  TrendingHashtag,
  TopicDetail,
  Platform,
} from '@/types/trending';

export const PLATFORMS: Platform[] = ['Twitter/X', 'TikTok', 'Reddit', 'Instagram'];

export const trendingTopics: TrendingTopic[] = [
  {
    id: '1',
    title: '#AIRevolution',
    category: 'Technology',
    description: 'Latest developments in artificial intelligence and machine learning',
    trendingScore: 156700,
    postsCount: 45320,
    change: 'up',
    changePercentage: 34.5,
    tags: ['AI', 'MachineLearning', 'Technology'],
  },
  {
    id: '2',
    title: '#ClimateAction',
    category: 'Environment',
    description: 'Global discussions on climate change and sustainability',
    trendingScore: 132400,
    postsCount: 38910,
    change: 'up',
    changePercentage: 18.3,
    tags: ['Climate', 'Sustainability', 'Environment'],
  },
  {
    id: '3',
    title: '#TechEarnings',
    category: 'Business',
    description: 'Major tech companies reporting quarterly earnings',
    trendingScore: 98750,
    postsCount: 27650,
    change: 'up',
    changePercentage: 42.1,
    tags: ['Business', 'Finance', 'Technology'],
  },
  {
    id: '4',
    title: '#Olympics2025',
    category: 'Sports',
    description: 'Winter Olympics preparation and athlete stories',
    trendingScore: 87200,
    postsCount: 31420,
    change: 'stable',
    changePercentage: 3.2,
    tags: ['Sports', 'Olympics', 'Athletes'],
  },
  {
    id: '5',
    title: '#CryptoNews',
    category: 'Finance',
    description: 'Cryptocurrency market updates and blockchain innovations',
    trendingScore: 76540,
    postsCount: 21890,
    change: 'down',
    changePercentage: -12.4,
    tags: ['Crypto', 'Blockchain', 'Finance'],
  },
  {
    id: '6',
    title: '#MentalHealthMatters',
    category: 'Health',
    description: 'Mental health awareness and support initiatives',
    trendingScore: 68930,
    postsCount: 19200,
    change: 'up',
    changePercentage: 15.7,
    tags: ['MentalHealth', 'Wellness', 'Support'],
  },
  {
    id: '7',
    title: '#SpaceExploration',
    category: 'Science',
    description: 'Latest missions and discoveries in space exploration',
    trendingScore: 61200,
    postsCount: 17540,
    change: 'up',
    changePercentage: 22.8,
    tags: ['Space', 'NASA', 'Science'],
  },
  {
    id: '8',
    title: '#SustainableFashion',
    category: 'Lifestyle',
    description: 'Eco-friendly fashion trends and ethical brands',
    trendingScore: 54300,
    postsCount: 14820,
    change: 'up',
    changePercentage: 9.6,
    tags: ['Fashion', 'Sustainability', 'EcoFriendly'],
  },
  {
    id: '9',
    title: '#WorkFromHome',
    category: 'Work',
    description: 'Remote work tips, tools, and productivity hacks',
    trendingScore: 49200,
    postsCount: 13650,
    change: 'stable',
    changePercentage: 2.1,
    tags: ['Remote', 'Productivity', 'Work'],
  },
  {
    id: '10',
    title: '#FoodieLife',
    category: 'Food',
    description: 'Viral recipes and restaurant recommendations',
    trendingScore: 43800,
    postsCount: 11290,
    change: 'up',
    changePercentage: 11.3,
    tags: ['Food', 'Cooking', 'Restaurants'],
  },
];

export const trendingRepositories: TrendingRepository[] = [
  {
    id: '1',
    name: 'twitter-clone',
    owner: 'Sayedhanzala777',
    description: 'TwitterXClone - Responsive React web app with trending topics and dark mode',
    stars: 2340,
    language: 'TypeScript',
    trending: true,
    change: 'up',
    starsToday: 234,
  },
  {
    id: '2',
    name: 'reddit-trending',
    owner: 'treandalizer',
    description: 'Top 10 Trending Reddit posts with React, TypeScript, and Tailwind CSS',
    stars: 1580,
    language: 'TypeScript',
    trending: true,
    change: 'up',
    starsToday: 156,
  },
  {
    id: '3',
    name: 'react-twitter-embed',
    owner: 'saurabhnemade',
    description: 'Simplest way to add Twitter widgets to your React project',
    stars: 4820,
    language: 'JavaScript',
    trending: true,
    change: 'up',
    starsToday: 89,
  },
  {
    id: '4',
    name: 'react-share',
    owner: 'nygardk',
    description: 'Social media share buttons and share counts for React',
    stars: 4150,
    language: 'TypeScript',
    trending: true,
    change: 'stable',
    starsToday: 45,
  },
  {
    id: '5',
    name: 'twitter-trends-api',
    owner: 'loretoparisi',
    description: 'Twitter Trends API examples with country and language filtering',
    stars: 892,
    language: 'JavaScript',
    trending: true,
    change: 'up',
    starsToday: 67,
  },
  {
    id: '6',
    name: 'node-widgets',
    owner: 'reddit',
    description: 'Official Reddit React components with Redux actions and reducers',
    stars: 3240,
    language: 'JavaScript',
    trending: true,
    change: 'up',
    starsToday: 52,
  },
];

export const trendingHashtags: TrendingHashtag[] = [
  { id: '1', name: 'TrendingUp', platform: 'Twitter/X', category: 'Viral', usageCount: 45320, weeklyChange: 18.2 },
  { id: '2', name: 'ForYouPage', platform: 'TikTok', category: 'Discovery', usageCount: 89430, weeklyChange: 6.4 },
  { id: '3', name: 'AskReddit', platform: 'Reddit', category: 'Community', usageCount: 12560, weeklyChange: -2.1 },
  { id: '4', name: 'ThrowbackThursday', platform: 'Instagram', category: 'Lifestyle', usageCount: 23890, weeklyChange: 1.3 },
  { id: '5', name: 'BreakingNews', platform: 'Twitter/X', category: 'News', usageCount: 34210, weeklyChange: 27.9 },
  { id: '6', name: 'LifeHacks', platform: 'TikTok', category: 'Tips', usageCount: 19780, weeklyChange: 11.0 },
  { id: '7', name: 'AITools', platform: 'Twitter/X', category: 'Technology', usageCount: 28640, weeklyChange: 41.5 },
  { id: '8', name: 'BookTok', platform: 'TikTok', category: 'Books', usageCount: 31200, weeklyChange: 3.8 },
  { id: '9', name: 'TodayILearned', platform: 'Reddit', category: 'Education', usageCount: 17450, weeklyChange: 0.9 },
  { id: '10', name: 'OOTD', platform: 'Instagram', category: 'Fashion', usageCount: 52100, weeklyChange: -4.6 },
];

/**
 * Per-topic detail. Everything below is made-up sample data, shaped like what a trends API would return.
 * The 14-day history is generated from each topic's current score and change so it ends where the list says it does.
 */
function makeHistory(id: number, score: number, changePct: number): number[] {
  const start = score / (1 + changePct / 100);
  return Array.from({ length: 14 }, (_, i) => {
    const t = i / 13;
    const wobble = Math.sin(id * 12.9898 + i * 78.233) * 0.06;
    return Math.round((start + (score - start) * t) * (1 + wobble * (1 - t * 0.6)));
  });
}

type Extra = Omit<TopicDetail, 'history'>;
const P = (x: number, t: number, r: number, i: number): Record<Platform, number> => ({
  'Twitter/X': x,
  TikTok: t,
  Reddit: r,
  Instagram: i,
});

const extras: Record<string, Extra> = {
  '1': {
    platforms: P(46, 14, 30, 10),
    sentiment: { positive: 54, neutral: 31, negative: 15 },
    peakHour: '15:00 UTC',
    related: ['3', '7'],
    topPosts: [
      { platform: 'Twitter/X', author: '@lena_codes', text: 'The pace of model releases this month is hard to keep up with. A thread on what actually changed.', likes: 12400 },
      { platform: 'Reddit', author: 'u/gradient_descent', text: 'What are you building with the new open weights models? Share your stack.', likes: 6100 },
    ],
  },
  '2': {
    platforms: P(33, 27, 12, 28),
    sentiment: { positive: 41, neutral: 36, negative: 23 },
    peakHour: '12:00 UTC',
    related: ['8', '7'],
    topPosts: [
      { platform: 'Instagram', author: '@greenroutes', text: 'Seven swaps that cut our household waste in half. Photos inside.', likes: 9800 },
      { platform: 'TikTok', author: '@planetwise', text: 'How a small town runs on 100 percent local solar.', likes: 21300 },
    ],
  },
  '3': {
    platforms: P(58, 4, 31, 7),
    sentiment: { positive: 38, neutral: 49, negative: 13 },
    peakHour: '21:00 UTC',
    related: ['1', '5'],
    topPosts: [
      { platform: 'Twitter/X', author: '@marketwatcher', text: 'Cloud revenue beat again. Margins are the story, not the headline number.', likes: 7700 },
      { platform: 'Reddit', author: 'u/bagholder_anon', text: 'Earnings thread: what did you take away from the calls?', likes: 4300 },
    ],
  },
  '4': {
    platforms: P(30, 22, 8, 40),
    sentiment: { positive: 71, neutral: 24, negative: 5 },
    peakHour: '18:00 UTC',
    related: ['10', '6'],
    topPosts: [
      { platform: 'Instagram', author: '@alpine_training', text: 'Four years of work for one run. Behind the scenes with the team.', likes: 15200 },
      { platform: 'TikTok', author: '@icepath', text: 'Curling explained in 40 seconds.', likes: 18900 },
    ],
  },
  '5': {
    platforms: P(52, 8, 34, 6),
    sentiment: { positive: 22, neutral: 33, negative: 45 },
    peakHour: '14:00 UTC',
    related: ['3', '1'],
    topPosts: [
      { platform: 'Twitter/X', author: '@ledgerlines', text: 'Volatility is back. A chart of the last 30 days against the usual range.', likes: 5900 },
      { platform: 'Reddit', author: 'u/hodl_or_fold', text: 'Daily discussion: is this a dip or a trend change?', likes: 3800 },
    ],
  },
  '6': {
    platforms: P(24, 31, 17, 28),
    sentiment: { positive: 63, neutral: 29, negative: 8 },
    peakHour: '20:00 UTC',
    related: ['9', '10'],
    topPosts: [
      { platform: 'TikTok', author: '@quietmind', text: 'Three things that help on a bad day. None of them cost anything.', likes: 33100 },
      { platform: 'Instagram', author: '@restfully', text: 'A reminder that rest is productive.', likes: 14700 },
    ],
  },
  '7': {
    platforms: P(41, 24, 21, 14),
    sentiment: { positive: 68, neutral: 28, negative: 4 },
    peakHour: '19:00 UTC',
    related: ['1', '2'],
    topPosts: [
      { platform: 'TikTok', author: '@orbitdaily', text: 'The new telescope images, explained in plain words.', likes: 41800 },
      { platform: 'Twitter/X', author: '@deepfield', text: 'A thread on what the latest spectra say about the atmosphere.', likes: 8900 },
    ],
  },
  '8': {
    platforms: P(11, 29, 6, 54),
    sentiment: { positive: 64, neutral: 30, negative: 6 },
    peakHour: '17:00 UTC',
    related: ['2', '10'],
    topPosts: [
      { platform: 'Instagram', author: '@thriftedthreads', text: 'Whole outfit under 40, all second hand.', likes: 11200 },
      { platform: 'TikTok', author: '@mendit', text: 'Fixing a hem instead of buying new.', likes: 16400 },
    ],
  },
  '9': {
    platforms: P(27, 12, 49, 12),
    sentiment: { positive: 44, neutral: 41, negative: 15 },
    peakHour: '09:00 UTC',
    related: ['6', '1'],
    topPosts: [
      { platform: 'Reddit', author: 'u/standing_desk', text: 'Two years remote: what I would do differently.', likes: 5200 },
      { platform: 'Twitter/X', author: '@asyncfirst', text: 'Meetings that could have been a doc, ranked.', likes: 6800 },
    ],
  },
  '10': {
    platforms: P(8, 33, 11, 48),
    sentiment: { positive: 74, neutral: 22, negative: 4 },
    peakHour: '19:00 UTC',
    related: ['8', '4'],
    topPosts: [
      { platform: 'Instagram', author: '@plateandpage', text: 'The ten minute pasta that started the whole trend.', likes: 24500 },
      { platform: 'TikTok', author: '@quickforks', text: 'Dinner for two in one pan.', likes: 38700 },
    ],
  },
};

export const topicDetails: Record<string, TopicDetail> = Object.fromEntries(
  trendingTopics.map((t) => [t.id, { history: makeHistory(Number(t.id), t.trendingScore, t.changePercentage), ...extras[t.id] }]),
);

export const topicCategories = Array.from(new Set(trendingTopics.map((t) => t.category))).sort();

/** Platform totals, worked out from each topic's post count and platform split. */
export const platformStats = PLATFORMS.map((platform) => {
  const posts = Math.round(trendingTopics.reduce((sum, t) => sum + (t.postsCount * topicDetails[t.id].platforms[platform]) / 100, 0));
  const topics = trendingTopics
    .map((t) => ({ t, n: (t.postsCount * topicDetails[t.id].platforms[platform]) / 100 }))
    .sort((a, b) => b.n - a.n);
  const history = trendingTopics.reduce(
    (acc, t) => acc.map((v, i) => v + (topicDetails[t.id].history[i] * topicDetails[t.id].platforms[platform]) / 100),
    Array<number>(14).fill(0),
  );
  const tags = trendingHashtags.filter((h) => h.platform === platform).sort((a, b) => b.usageCount - a.usageCount);
  return { platform, posts, topTopic: topics[0].t, history, topHashtag: tags[0] };
});
