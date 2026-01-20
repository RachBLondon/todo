import type { Database } from './database';

export type LeaderboardEntry = Database['public']['Views']['leaderboard_streaks']['Row'];

export interface LeaderboardEntryWithRank extends LeaderboardEntry {
  rank: number;
  isCurrentUser: boolean;
  medal?: '🥇' | '🥈' | '🥉';
}

export interface UserRank {
  rank: number;
  totalUsers: number;
  percentile: number;
}
