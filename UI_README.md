# Social Media Trending Topics UI

A modern, responsive trending topics interface built with Next.js, React, TypeScript, and Tailwind CSS. This UI showcases trending topics across Twitter/X, TikTok, Reddit, and Instagram, along with social media repositories and viral hashtags, featuring a sleek dark/light mode toggle.

## 🚀 Features

### Core Components

1. **Trending Topics Widget** (`TrendingTopicsWidget`)
   - Sidebar widget displaying trending social media topics and hashtags
   - Filterable by trend direction (All, Rising, Falling)
   - Real-time status indicators
   - Smooth animations and transitions
   - Responsive design

2. **Trending Repository Cards** (`TrendingRepoCard`)
   - Display trending social media-related GitHub repositories
   - Shows stars, language, and daily growth
   - Trend indicators with percentage changes
   - Hover effects and transitions

3. **Viral Hashtags Table**
   - Displays most-used hashtags across Twitter/X, TikTok, Reddit, and Instagram
   - Platform indicators
   - Popularity metrics and post counts
   - Color-coded categories

4. **Dark/Light Mode**
   - System-level dark mode support
   - Smooth theme transitions
   - Persistent theme selection
   - Tailwind CSS dark mode utilities

### Design Features

- ✨ Modern gradient backgrounds
- 🎨 Color-coded trend indicators (green ↑, red ↓, gray →)
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible with ARIA labels
- 🎭 Smooth animations using Tailwind
- 📊 Data visualization with trend badges
- 🔍 Custom scrollbars for better UX

## 📁 Project Structure

```
myclaudecodeweb250test/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and Tailwind imports
│   │   ├── layout.tsx           # Root layout with metadata
│   │   └── page.tsx             # Main page component
│   ├── components/
│   │   ├── TrendingBadge.tsx    # Trend indicator component
│   │   ├── TrendingTopicItem.tsx # Individual topic card
│   │   ├── TrendingTopicsWidget.tsx # Main sidebar widget
│   │   └── TrendingRepoCard.tsx # Repository card component
│   ├── data/
│   │   └── trendingTopics.ts    # Sample data (topics, repos, functions)
│   └── types/
│       └── trending.ts          # TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── TRENDING_UI_LEARNING_RESOURCES.md  # UI/UX learning resources
├── SOCIAL_MEDIA_TRENDING_RESOURCES.md # Social media API & repo resources
└── UI_README.md (this file)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **UI Library**: React 18
- **Icons**: Lucide React
- **Build Tool**: Next.js (built on Webpack/Turbopack)

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:3000`
   - The UI will hot-reload as you make changes

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 🎨 Components Documentation

### TrendingTopicsWidget

The main sidebar component that displays trending topics.

**Props:**
```typescript
interface TrendingTopicsWidgetProps {
  topics: TrendingTopic[];      // Array of trending topics
  title?: string;               // Widget title (default: "Trending Topics")
  maxItems?: number;            // Max items to display (default: 8)
}
```

**Usage:**
```tsx
import TrendingTopicsWidget from '@/components/TrendingTopicsWidget';
import { trendingTopics } from '@/data/trendingTopics';

<TrendingTopicsWidget
  topics={trendingTopics}
  title="Game Dev Trends"
  maxItems={10}
/>
```

### TrendingBadge

Displays trend direction and percentage change.

**Props:**
```typescript
interface TrendingBadgeProps {
  change: 'up' | 'down' | 'stable';
  percentage: number;
}
```

**Usage:**
```tsx
<TrendingBadge change="up" percentage={23.5} />
```

### TrendingTopicItem

Individual topic card with metadata and tags.

**Props:**
```typescript
interface TrendingTopicItemProps {
  topic: TrendingTopic;
  rank: number;
}
```

### TrendingRepoCard

Repository card showing GitHub project stats.

**Props:**
```typescript
interface TrendingRepoCardProps {
  repo: TrendingRepository;
}
```

## 📊 Data Structure

### TrendingTopic Interface

```typescript
interface TrendingTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  trendingScore: number;
  postsCount: number;
  change: 'up' | 'down' | 'stable';
  changePercentage: number;
  tags: string[];
}
```

### TrendingRepository Interface

```typescript
interface TrendingRepository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  language: string;
  trending: boolean;
  change: 'up' | 'down' | 'stable';
  starsToday: number;
}
```

### TrendingFunction Interface

```typescript
interface TrendingFunction {
  id: string;
  name: string;
  project: string;
  complexity: 'High' | 'Medium' | 'Low';
  usageCount: number;
  category: string;
  trending: boolean;
}
```

## 🎯 Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Animation Speed

Modify animation durations in `tailwind.config.ts`:

```typescript
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',  // Adjust duration
}
```

### Data Source

Replace sample data in `src/data/trendingTopics.ts` with your own data source:

- Connect to a REST API
- Use GraphQL
- Integrate with GitHub API
- Connect to a database

## 🔌 Integration Examples

### Fetch from API

```typescript
'use client';

import { useEffect, useState } from 'react';
import TrendingTopicsWidget from '@/components/TrendingTopicsWidget';

export default function Page() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch('/api/trending')
      .then(res => res.json())
      .then(data => setTopics(data));
  }, []);

  return <TrendingTopicsWidget topics={topics} />;
}
```

### GitHub API Integration

```typescript
const fetchTrendingRepos = async () => {
  const response = await fetch(
    'https://api.github.com/search/repositories?q=game+development&sort=stars&order=desc'
  );
  const data = await response.json();
  return data.items;
};
```

## 🎨 Styling Guide

### Tailwind Classes Used

- **Layout**: `flex`, `grid`, `space-y-*`, `gap-*`
- **Spacing**: `p-*`, `m-*`, `px-*`, `py-*`
- **Colors**: `bg-*`, `text-*`, `border-*`
- **Dark Mode**: `dark:bg-*`, `dark:text-*`
- **Transitions**: `transition-*`, `duration-*`, `ease-*`
- **Hover**: `hover:*`, `group-hover:*`
- **Responsive**: `sm:*`, `md:*`, `lg:*`, `xl:*`

### Custom CSS

Custom scrollbar styling in `globals.css`:

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast ratios meet WCAG AA standards

## 🚀 Performance Optimizations

- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component (not used in sample data, but available)
- **CSS Purging**: Tailwind removes unused CSS in production
- **React 18**: Automatic batching and concurrent features
- **Static Generation**: Pre-render pages at build time when possible

## 🔮 Future Enhancements

Potential additions to the UI:

1. **Real-time Updates**
   - WebSocket integration
   - Live data polling
   - Notification system

2. **Advanced Filtering**
   - Multi-select filters
   - Date range selection
   - Search functionality

3. **Data Visualization**
   - Trend charts with react-trend
   - Sparklines for historical data
   - Interactive graphs

4. **User Features**
   - Save favorite topics
   - Custom topic alerts
   - User preferences

5. **Analytics**
   - Click tracking
   - Popular topics
   - User engagement metrics

## 📚 Learning Resources

See `TRENDING_UI_LEARNING_RESOURCES.md` for:
- Similar repositories to learn from
- UI component libraries
- Design patterns
- Best practices
- Recommended tech stack

## 🐛 Troubleshooting

### Common Issues

**Issue**: Dark mode not working
- **Solution**: Ensure `document.documentElement.classList.toggle('dark')` is called

**Issue**: Tailwind classes not applying
- **Solution**: Check `content` array in `tailwind.config.ts` includes your files

**Issue**: TypeScript errors
- **Solution**: Run `npm install` to ensure all type definitions are installed

**Issue**: Build fails
- **Solution**: Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## 📝 License

This project is part of a game development learning resource repository.

## 🤝 Contributing

To add new features:

1. Create new components in `src/components/`
2. Add types to `src/types/trending.ts`
3. Update sample data in `src/data/trendingTopics.ts`
4. Test in development mode
5. Build for production to verify

## 📞 Support

For issues or questions:
- Check the learning resources document
- Review the Next.js documentation
- Consult Tailwind CSS docs
- Review the TypeScript handbook

---

**Built with ❤️ using modern web technologies**

Last Updated: January 2025
