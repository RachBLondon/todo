import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import type { LeaderboardEntryWithRank, UserRank } from '@/types/leaderboard';

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Fetch leaderboard data - calculate streaks for all users
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('onboarding_completed', true)
    .not('username', 'is', null)
    .returns<{ id: string; username: string }[]>();

  if (!profiles || profiles.length === 0) {
    return <div>Error loading leaderboard</div>;
  }

  // Calculate streaks for all users
  const entriesWithStreaks = await Promise.all(
    profiles.map(async (profile) => {
      const { data: streakData } = await supabase.rpc('calculate_overall_user_streak', {
        p_user_id: profile.id,
      } as any);

      return {
        id: profile.id,
        username: profile.username,
        streak: typeof streakData === 'number' ? streakData : 0,
      };
    })
  );

  // Sort by streak descending
  const sortedEntries = entriesWithStreaks.sort((a, b) => b.streak - a.streak);

  // Add ranks and medals
  const entriesWithRanks: LeaderboardEntryWithRank[] = sortedEntries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    isCurrentUser: entry.id === user.id,
    medal:
      index === 0 ? '🥇' :
      index === 1 ? '🥈' :
      index === 2 ? '🥉' :
      undefined,
  }));

  // Get current user's rank
  const currentUserEntry = entriesWithRanks.find(e => e.isCurrentUser);
  const userRank: UserRank | null = currentUserEntry
    ? {
        rank: currentUserEntry.rank,
        totalUsers: entriesWithRanks.length,
        percentile: (currentUserEntry.rank / entriesWithRanks.length) * 100,
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-lofi-dark">
          Leaderboard
        </h1>
        {userRank && (
          <span className="text-sm text-lofi-muted">
            You are #{userRank.rank} of {userRank.totalUsers}
          </span>
        )}
      </div>

      <Card>
        <LeaderboardTable entries={entriesWithRanks.slice(0, 100)} />
      </Card>
    </div>
  );
}
