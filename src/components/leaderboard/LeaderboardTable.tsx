'use client';

import Image from 'next/image';
import type { LeaderboardEntryWithRank } from '@/types/leaderboard';
import { getAvatarPath } from '@/lib/utils/avatar';

interface LeaderboardTableProps {
  entries: LeaderboardEntryWithRank[];
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-lofi-muted">
        No entries yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${
            entry.isCurrentUser
              ? 'bg-accent-orange/10'
              : 'hover:bg-lofi-muted/5'
          }`}
        >
          <span className="w-6 text-sm text-lofi-muted tabular-nums">
            {entry.rank}
          </span>
          <Image
            src={getAvatarPath(entry.id)}
            alt=""
            width={28}
            height={28}
            className="w-7 h-7 rounded-full"
          />
          <span className={`flex-1 text-sm ${entry.isCurrentUser ? 'font-medium text-lofi-dark' : 'text-lofi-dark'}`}>
            {entry.username}
            {entry.isCurrentUser && (
              <span className="ml-2 text-xs text-accent-orange">you</span>
            )}
          </span>
          <span className="text-sm text-lofi-muted tabular-nums">
            {entry.streak}d
          </span>
        </div>
      ))}
    </div>
  );
}
