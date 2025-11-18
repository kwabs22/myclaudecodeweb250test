# Social Media Trending Topics - Learning Resources

This document contains curated repositories and resources for building social media trending topics UIs, including Twitter/X, TikTok, Instagram, Reddit, and more.

## 📚 Overview

Based on research conducted in January 2025, here are the best repositories, APIs, and resources for learning to build social media trending topics widgets and interfaces.

---

## 🐦 Twitter/X Trending Topics

### GitHub Repositories

#### 1. **twitter-trends-api** (loretoparisi)
- **URL**: https://github.com/loretoparisi/twitter-trends-api
- **Description**: Twitter Trends API examples
- **Features**:
  - Get top trending topics by ISO 3166-2 Country Code
  - Filter by ISO 639-1 Language Code
  - Place type filtering
- **Best For**: Learning Twitter API integration

#### 2. **trending-twitter** (eliasdabbas)
- **URL**: https://github.com/eliasdabbas/trending-twitter
- **Description**: Simple dashboard for getting currently trending hashtags and topics on Twitter
- **Features**:
  - Get trending in any location(s)
  - Compare trends across locations
  - Visualize trend data
  - Export raw data
- **Best For**: Dashboard implementations

#### 3. **Twitter Clone with Trending Topics** (Sayedhanzala777)
- **URL**: https://github.com/Sayedhanzala777/twitter-clone
- **Description**: TwitterXClone - A responsive React web app mimicking Twitter/X
- **Tech Stack**: React, Tailwind CSS, Lucide Icons, Vite
- **Features**:
  - Tweet posting, likes, retweets, replies
  - **Trending topics sidebar**
  - "Who to follow" suggestions
  - Dark mode
- **Best For**: Full Twitter/X clone implementation

#### 4. **twitterfinal** (deeyadas6)
- **URL**: https://github.com/deeyadas6/twitterfinal
- **Description**: Frontend-only clone of X.com (formerly Twitter)
- **Tech Stack**: Vite, React (JavaScript)
- **Features**:
  - Dynamically displays data using API
  - Right.jsx component displays current trending topics
  - Mimics real-time interactions
- **Best For**: Trending topics component examples

### GitHub Topics to Explore
- **twitter-trends**: https://github.com/topics/twitter-trends
- **twitter-trending**: https://github.com/topics/twitter-trending
- **twitter-api**: https://github.com/topics/twitter-api
- **trending-topics**: https://github.com/topics/trending-topics

### React Components for Twitter

#### 1. **react-twitter-embed** (saurabhnemade)
- **URL**: https://github.com/saurabhnemade/react-twitter-embed
- **Description**: Simplest way to add Twitter widgets to your React project
- **Components**:
  - TwitterHashtagButton
  - TwitterTimelineEmbed
  - TwitterShareButton
- **Best For**: Embedding Twitter widgets

#### 2. **react-twitter-widgets** (andrewsuzuki)
- **URL**: https://github.com/andrewsuzuki/react-twitter-widgets
- **NPM**: https://www.npmjs.com/package/react-twitter-widgets
- **Description**: Quick and easy Twitter widgets for React
- **Widgets Available**:
  - Timeline
  - Share
  - Follow
  - Hashtag
  - Mention
  - Tweet
- **Best For**: Pre-built Twitter widget components

#### 3. **react-hashtag** (cristianbote)
- **URL**: https://github.com/cristianbote/react-hashtag
- **Description**: Super small component to custom render hashtags within text
- **Best For**: Hashtag rendering and highlighting

### Tutorial Resources

#### 1. **Building a Twitter Sidebar Clone with Material-UI and React**
- **URL**: https://blog.openreplay.com/building-a-twitter-sidebar-clone-with-material-ui-and-react/
- **Topics**: Material Icons, button components, sidebar navigation
- **Best For**: Material-UI implementation

#### 2. **Create frontend for Twitter clone using React.js**
- **URL**: https://saurabhnative.hashnode.dev/create-frontend-for-twitter-clone-using-reactjs
- **Topics**:
  - Dummy search input
  - Trending categories
  - Topics to follow in right sidebar
- **Best For**: Beginner-friendly tutorial

#### 3. **DhiWise - Create React Twitter Clone**
- **URL**: https://www.dhiwise.com/post/building-a-react-twitter-clone-from-scratch
- **Components**: Sidebar, Feed, Widgets
- **Best For**: Advanced features and patterns

### Important Note
⚠️ Some Twitter API tools are currently down due to new Twitter API policies. Consider alternative approaches or paid API access.

---

## 🎵 TikTok Trending Hashtags

### Official TikTok APIs

1. **TikTok Research API**
   - **URL**: https://developers.tiktok.com/doc/research-api-specs-query-videos
   - **Features**: Query videos using hashtags
   - **Fields**: region_code, hashtag_name
   - **Best For**: Academic research, official projects

2. **TikTok Discovery API**
   - Provides trending content data
   - Hashtag analytics
   - Best For: Authorized applications

### Third-Party Solutions

⚠️ **Note**: No official public API for TikTok trending hashtags. Use third-party solutions:

#### 1. **TickerTrends API**
- **URL**: https://blog.tickertrends.io/p/tiktok-trends-api-timeseries-hashtag-analytics
- **Description**: TikTok Trends API with full hashtag analytics
- **Features**:
  - Track thousands of trending hashtags
  - Real-time view data
  - Time-series data
  - HTTP endpoints returning JSON
- **Best For**: Production applications needing trend data

#### 2. **TikTok Trending Data API (RapidAPI)**
- **URL**: https://rapidapi.com/earned/api/tiktok-trending-data
- **Features**:
  - Trending Users
  - Trending Hashtags
  - Trending Songs
- **Best For**: Quick integration via RapidAPI

#### 3. **Apify TikTok Scrapers**
- **Hashtag API**: https://apify.com/novi/tiktok-hashtag-api
- **Trending Hashtags Scraper**: https://apify.com/lexis-solutions/tiktok-trending-hashtags-scraper
- **Hashtag Scraper**: https://apify.com/clockworks/tiktok-hashtag-scraper
- **Features**:
  - Extract data for competition monitoring
  - Market research
  - Trend analysis
- **Best For**: Data scraping and analysis

#### 4. **tiktok-trending-data-api** (GitHub)
- **URL**: https://github.com/ogohogo/tiktok-trending-data-api
- **Description**: Scraping TikTok Discovery Data API every 1 hour using GitHub Actions
- **Best For**: Automated trend tracking

### React Integration
- No pre-built React components found
- Use standard HTTP requests (fetch, axios)
- Implement custom hooks for data fetching
- Consider caching strategies for API rate limits

---

## 🔴 Reddit Trending Posts

### GitHub Repositories

#### 1. **reddit-trending** (treandalizer)
- **URL**: https://github.com/treandalizer/reddit-trending
- **Description**: Top 10 Trending Reddit
- **Tech Stack**: React, TypeScript, Express, Tailwind CSS
- **Type**: Full-stack web application
- **Features**:
  - Display trending Reddit posts
  - Search for posts on specific topics
- **Best For**: Modern full-stack implementation

#### 2. **RedditWidget** (Robbie08)
- **URL**: https://github.com/Robbie08/RedditWidget
- **Description**: Display top 10 posts of any subreddit using Reddit API
- **Type**: React practice project
- **Best For**: Learning Reddit API consumption

#### 3. **node-widgets** (reddit - Official)
- **URL**: https://github.com/reddit/node-widgets
- **Description**: Collection of Reddit specific React components
- **Includes**: Redux actions and reducers
- **Best For**: Official Reddit component patterns

#### 4. **article-react-reddit-widget** (GioLogist)
- **URL**: https://github.com/GioLogist/article-react-reddit-widget
- **Description**: Complete Reddit widget implementation
- **Tech**: React hooks
- **Features**: Display latest posts from subreddits
- **Best For**: Widget component examples

#### 5. **Reddit-Clone** (TheUzair)
- **URL**: https://github.com/TheUzair/Reddit-Clone
- **Description**: Feature-rich Reddit clone
- **Tech Stack**: Next.js 15, React 19, Tailwind CSS
- **Features**:
  - Posts, comments, user interactions
  - Modern design principles
  - Cutting-edge technologies
- **Best For**: Advanced Next.js implementation

### Reddit API
- **Official API**: https://www.reddit.com/dev/api/
- **Free tier available**
- **JSON endpoints**
- **No authentication required for public data**
- **Rate limiting**: 60 requests per minute

---

## 📱 Instagram Trending

### Challenges
- Instagram restricts API access significantly
- Most trending data requires business accounts
- Official API is limited

### Alternatives
- **Instagram Graph API**: For business/creator accounts
- **Third-party scrapers**: Use with caution (terms of service)
- **Apify Instagram scrapers**: Various options available

---

## 🌐 Multi-Platform Solutions

### Social Media Share Components

#### 1. **react-share** (nygardk)
- **URL**: https://github.com/nygardk/react-share
- **Description**: Social media share buttons and share counts for React
- **Platforms**: Facebook, Twitter, LinkedIn, Reddit, WhatsApp, Telegram, and more
- **Hashtag Support**: Yes
- **Best For**: Social sharing functionality

#### 2. **@phntms/react-share** (phantomstudios)
- **URL**: https://github.com/phantomstudios/react-share
- **Description**: All-in-one React library for social media sharing
- **Features**:
  - Custom Page Sharing Meta
  - Social Media Sharing Buttons
  - Built-in platform support
- **Best For**: Meta tags and sharing

#### 3. **react-social** (olahol)
- **URL**: https://github.com/olahol/react-social
- **Description**: Simple React components for social buttons
- **Platforms**: Facebook, Twitter, Pinterest
- **Features**: Social counts
- **Best For**: Basic social buttons

---

## 🎨 UI/UX Design Patterns

### Trending Topics Widget Best Practices

1. **Layout**
   - Sidebar placement (typically right side)
   - Card-based design
   - Compact, scannable list

2. **Information Hierarchy**
   - Topic/hashtag name (prominent)
   - Category/context (subtle)
   - Post count/engagement metrics
   - Trend direction indicator

3. **Visual Indicators**
   - 🔺 Rising trends (green)
   - 🔻 Falling trends (red)
   - ➖ Stable trends (gray/blue)
   - 🔥 Hot/viral indicator
   - ⚡ New trending badge

4. **Interactivity**
   - Click to view topic details
   - Hover effects for engagement
   - Smooth animations (fade-in, slide)
   - Loading states (skeleton loaders)

5. **Filtering Options**
   - By location/geography
   - By time period (24h, 7d, 30d)
   - By category
   - By trend direction

6. **Real-time Updates**
   - Auto-refresh (polling)
   - WebSocket connections
   - Update indicators
   - Timestamp display

---

## 🛠️ Recommended Tech Stack

### Core Framework
- **Next.js 14+**: SSR, API routes, App Router
- **React 18+**: Concurrent features, hooks
- **TypeScript**: Type safety for API responses

### Styling
- **Tailwind CSS**: Utility-first, rapid development
- **CSS Modules**: Component-scoped styles
- **styled-components**: Dynamic styling

### UI Components
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless primitives
- **Lucide React**: Icon library
- **Framer Motion**: Animations

### State Management
- **React Query (TanStack Query)**: Server state, caching, auto-refetch
- **Zustand**: Lightweight client state
- **SWR**: Stale-while-revalidate data fetching

### Data Fetching
- **Axios**: HTTP client
- **React Query**: Server state management
- **SWR**: Data fetching hooks
- **WebSocket**: Real-time updates

---

## 📊 API Integration Patterns

### Pattern 1: Client-Side Fetching

```typescript
import { useEffect, useState } from 'react';

function useTrendingTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trending')
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        setLoading(false);
      });
  }, []);

  return { topics, loading };
}
```

### Pattern 2: React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function useTrendingTopics() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: () => fetch('/api/trending').then(r => r.json()),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Pattern 3: SWR

```typescript
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(r => r.json());

function useTrendingTopics() {
  const { data, error } = useSWR('/api/trending', fetcher, {
    refreshInterval: 5 * 60 * 1000,
  });

  return {
    topics: data,
    isLoading: !error && !data,
    isError: error,
  };
}
```

### Pattern 4: Server Components (Next.js App Router)

```typescript
async function getTrendingTopics() {
  const res = await fetch('https://api.example.com/trending', {
    next: { revalidate: 300 } // 5 minutes
  });
  return res.json();
}

export default async function TrendingWidget() {
  const topics = await getTrendingTopics();
  return <TrendingList topics={topics} />;
}
```

---

## 🔐 API Authentication & Rate Limits

### Twitter/X API
- **Authentication**: OAuth 2.0, API keys
- **Rate Limits**: Varies by tier (Free, Basic, Pro, Enterprise)
- **Trending Endpoint**: Limited to authenticated apps
- **Cost**: Free tier very limited, paid tiers required for production

### Reddit API
- **Authentication**: OAuth 2.0 (optional for public data)
- **Rate Limits**: 60 requests/minute
- **Cost**: Free
- **Best For**: Most accessible for developers

### TikTok API
- **Authentication**: API credentials required
- **Rate Limits**: Varies by endpoint
- **Trending**: No official public endpoint
- **Best For**: Use third-party solutions

---

## 💡 Implementation Tips

### 1. Caching Strategy
- Cache API responses to reduce requests
- Use stale-while-revalidate pattern
- Implement in-memory cache (Redis) for server
- LocalStorage for client-side caching

### 2. Error Handling
- Graceful degradation when API fails
- Show cached data if available
- User-friendly error messages
- Retry logic with exponential backoff

### 3. Performance
- Lazy load trending widget
- Virtualize long lists (react-window)
- Optimize re-renders (React.memo, useMemo)
- Compress API responses (gzip)

### 4. Accessibility
- Keyboard navigation
- Screen reader support (ARIA labels)
- Focus management
- Color contrast ratios

### 5. Mobile Optimization
- Touch-friendly tap targets (44x44px minimum)
- Swipe gestures for navigation
- Responsive breakpoints
- Collapsible sidebar on mobile

---

## 🎯 Example Data Structures

### Twitter Trending Topic

```typescript
interface TwitterTrend {
  name: string;              // "#ReactJS"
  query: string;             // "%23ReactJS"
  url: string;               // "http://twitter.com/search?q=%23ReactJS"
  promoted_content: null;
  tweet_volume: number;      // 125000
  location: {
    name: string;            // "United States"
    woeid: number;           // 23424977
  };
}
```

### TikTok Trending Hashtag

```typescript
interface TikTokTrend {
  id: string;
  title: string;             // "fyp"
  view_count: number;
  video_count: number;
  is_commerce: boolean;
  rank: number;
  trend_type: 'rising' | 'stable' | 'falling';
}
```

### Reddit Trending Post

```typescript
interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  thumbnail: string;
  url: string;
}
```

---

## 📚 Additional Resources

### Articles & Tutorials
- Twitter API v2 Documentation
- Reddit API Documentation
- TikTok for Developers
- Building Real-time Features with WebSockets
- React Query Best Practices

### Video Tutorials
- "Build a Twitter Clone" (YouTube)
- "Reddit API Tutorial" (YouTube)
- "Real-time Trending Topics Dashboard" (YouTube)

### Communities
- r/reactjs (Reddit)
- React Discord
- Twitter Developer Community
- Stack Overflow

---

## 🚀 Quick Start Templates

### Basic Trending Widget Structure

```
TrendingWidget/
├── components/
│   ├── TrendingWidget.tsx       # Main container
│   ├── TrendingItem.tsx         # Individual trend
│   ├── TrendingBadge.tsx        # Trend indicator
│   ├── TrendingFilters.tsx      # Filter controls
│   └── TrendingSkeleton.tsx     # Loading state
├── hooks/
│   ├── useTrending.ts           # Data fetching hook
│   └── useTrendingFilters.ts    # Filter logic
├── types/
│   └── trending.ts              # TypeScript types
├── api/
│   └── trending.ts              # API integration
└── utils/
    └── formatters.ts            # Data formatting
```

---

## 🔗 Quick Links

### GitHub Topics
- https://github.com/topics/twitter-trends
- https://github.com/topics/trending-topics
- https://github.com/topics/hashtag
- https://github.com/topics/react-twitter
- https://github.com/topics/twitter-clone-reactjs

### Official Documentation
- Twitter API: https://developer.twitter.com/en/docs
- Reddit API: https://www.reddit.com/dev/api
- TikTok Developers: https://developers.tiktok.com

---

## ⚠️ Legal & Ethical Considerations

1. **Terms of Service**: Always comply with platform TOS
2. **Rate Limits**: Respect API rate limits
3. **Data Privacy**: Handle user data responsibly
4. **Scraping**: Use official APIs when possible
5. **Attribution**: Credit data sources appropriately
6. **Caching**: Don't violate freshness requirements

---

## 🎓 Learning Path

### Beginner
1. Build basic trending list with static data
2. Style with Tailwind CSS
3. Add trend indicators
4. Implement filtering

### Intermediate
1. Integrate Reddit API (easiest to start)
2. Add real-time updates with polling
3. Implement caching with React Query
4. Add loading states and error handling

### Advanced
1. Multi-platform aggregation
2. WebSocket for real-time updates
3. Advanced filtering and search
4. Analytics and tracking
5. Personalized trending based on user interests

---

Last Updated: January 2025

**Note**: Social media APIs change frequently. Always check official documentation for the latest information.
