import { Card } from '../ui/Card';
import type { UserRank } from '@/types/leaderboard';

interface UserRankCardProps {
  rank: UserRank;
  streak: number;
}

export function UserRankCard({ rank, streak }: UserRankCardProps) {
  return (
    <Card className="bg-gradient-to-br from-lofi-accent to-lofi-tan border-2 border-lofi-accent">
      <div className="text-center">
        <p className="text-sm text-lofi-dark font-medium mb-2">
          Your Position
        </p>
        <div className="flex items-center justify-center gap-4 mb-2">
          <div>
            <p className="text-3xl font-bold text-lofi-dark">
              #{rank.rank}
            </p>
            <p className="text-xs text-lofi-brown">
              of {rank.totalUsers}
            </p>
          </div>
          <div className="h-12 w-px bg-lofi-muted" />
          <div>
            <p className="text-3xl font-bold text-lofi-dark flex items-center gap-1">
              <span className="text-2xl">🔥</span>
              {streak}
            </p>
            <p className="text-xs text-lofi-brown">
              day streak
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-lofi-muted">
          <p className="text-xs text-lofi-brown">
            Top {Math.round(rank.percentile)}% • Keep going!
          </p>
        </div>
      </div>
    </Card>
  );
}
