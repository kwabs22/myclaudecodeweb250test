import { Platform } from '@/types/trending';

/** One colour per platform. Every segment is also labelled in text, so colour is never the only cue. */
export const PLATFORM_COLOURS: Record<Platform, string> = {
  'Twitter/X': 'bg-blue-500',
  TikTok: 'bg-orange-500',
  Reddit: 'bg-emerald-500',
  Instagram: 'bg-fuchsia-500',
};

export default function PlatformSplit({ shares }: { shares: Record<Platform, number> }) {
  const entries = (Object.entries(shares) as [Platform, number][]).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label={entries.map(([p, v]) => `${p} ${v} percent`).join(', ')}>
        {entries.map(([p, v]) => (
          <div key={p} className={PLATFORM_COLOURS[p]} style={{ width: `${v}%` }} title={`${p} ${v}%`} />
        ))}
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
        {entries.map(([p, v]) => (
          <li key={p} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-sm ${PLATFORM_COLOURS[p]}`} aria-hidden />
            <span className="flex-1">{p}</span>
            <span className="font-medium tabular-nums">{v}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
