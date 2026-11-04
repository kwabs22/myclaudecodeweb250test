import { TrendingRepository } from '@/types/trending';

/**
 * Live repositories from GitHub's public search API.
 *
 * The browser calls api.github.com directly with no key, so there is no server of ours and nothing to bill. GitHub limits
 * visitors without a token to 10 searches a minute, so the answer is kept for 15 minutes in sessionStorage. Never put a
 * token in this file: anything in client code is public.
 */
const CACHE_KEY = 'trends-hub-live-repos-v1';
const CACHE_MS = 15 * 60 * 1000;

export interface LiveResult {
  repos: TrendingRepository[];
  fetchedAt: number;
  fromCache: boolean;
}

export class LiveError extends Error {
  resetAt?: number;
  constructor(message: string, resetAt?: number) {
    super(message);
    this.resetAt = resetAt;
  }
}

interface GitHubItem {
  id: number;
  name: string;
  owner: { login: string };
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  created_at: string;
}

function readCache(): LiveResult | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LiveResult;
    if (Date.now() - parsed.fetchedAt < CACHE_MS && Array.isArray(parsed.repos)) return { ...parsed, fromCache: true };
  } catch {
    /* private windows and blocked storage throw: carry on without a cache */
  }
  return null;
}

function writeCache(result: LiveResult) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));
  } catch {
    /* ignore */
  }
}

export function daysAgo(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}

/** New repositories from the last 7 days with the most stars. GitHub's own Trending page uses a different, unpublished measure. */
export async function fetchLiveRepos(signal?: AbortSignal): Promise<LiveResult> {
  const cached = readCache();
  if (cached) return cached;
  const since = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(`created:>${since}`)}&sort=stars&order=desc&per_page=10`;
  let res: Response;
  try {
    res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, signal });
  } catch {
    throw new LiveError('Could not reach GitHub. Check your connection, or try again in a minute.');
  }
  if (res.status === 403 || res.status === 429) {
    const reset = Number(res.headers.get('x-ratelimit-reset'));
    throw new LiveError("GitHub's free limit for visitors without a token has been reached.", reset ? reset * 1000 : undefined);
  }
  if (!res.ok) throw new LiveError(`GitHub answered with status ${res.status}.`);
  const body = (await res.json()) as { items?: GitHubItem[] };
  const repos: TrendingRepository[] = (body.items ?? []).map((r) => ({
    id: String(r.id),
    name: r.name,
    owner: r.owner.login,
    description: r.description ?? 'No description',
    stars: r.stargazers_count,
    language: r.language ?? 'Not stated',
    trending: true,
    change: 'up',
    starsToday: 0,
    url: r.html_url,
    createdAt: r.created_at,
    live: true,
  }));
  const result: LiveResult = { repos, fetchedAt: Date.now(), fromCache: false };
  writeCache(result);
  return result;
}
