import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { UserRankCard } from '@/components/leaderboard/UserRankCard';
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
      <div>
        <h1 className="text-3xl font-bold text-lofi-dark mb-2">Leaderboard 🏆</h1>
        <p className="text-lofi-brown">
          Top streakers worldwide. Weekdays only, one day at a time.
        </p>
      </div>

      {userRank && currentUserEntry && (
        <UserRankCard rank={userRank} streak={currentUserEntry.streak} />
      )}

      <Card>
        <h2 className="text-xl font-bold text-lofi-dark mb-4">
          Top 100 Streaks
        </h2>
        <LeaderboardTable entries={entriesWithRanks.slice(0, 100)} />
      </Card>

      <div className="text-center text-sm text-lofi-muted">
        <p>Streaks update in real-time based on habit completions</p>
        <p className="mt-1">Keep showing up to climb the ranks!</p>
      </div>
    </div>
  );
}
