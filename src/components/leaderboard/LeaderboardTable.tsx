'use client';

import type { LeaderboardEntryWithRank } from '@/types/leaderboard';

interface LeaderboardTableProps {
  entries: LeaderboardEntryWithRank[];
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-lofi-muted">
        No entries yet. Be the first to build a streak!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-lofi-muted">
            <th className="text-left py-3 px-4 text-lofi-dark font-semibold">Rank</th>
            <th className="text-left py-3 px-4 text-lofi-dark font-semibold">User</th>
            <th className="text-right py-3 px-4 text-lofi-dark font-semibold">Streak</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className={`border-b border-lofi-muted transition-all ${
                entry.isCurrentUser
                  ? 'bg-lofi-accent/20 font-semibold'
                  : 'hover:bg-lofi-tan/50'
              }`}
            >
              <td className="py-3 px-4 text-lofi-brown">
                <div className="flex items-center gap-2">
                  {entry.medal && <span className="text-2xl">{entry.medal}</span>}
                  <span>{entry.rank}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-lofi-brown">
                {entry.username}
                {entry.isCurrentUser && (
                  <span className="ml-2 text-xs bg-lofi-accent text-lofi-dark px-2 py-0.5 rounded">
                    You
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xl">🔥</span>
                  <span className="font-semibold text-lofi-dark">{entry.streak}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
