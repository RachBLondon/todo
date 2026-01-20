'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Card } from '../ui/Card';

interface StreakStatsProps {
  userId: string;
}

export function StreakStats({ userId }: StreakStatsProps) {
  const [overallStreak, setOverallStreak] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStreak = async () => {
      const supabase = createClient();

      const { data, error } = await supabase.rpc('calculate_overall_user_streak', {
        p_user_id: userId,
      } as any);

      if (!error) {
        setOverallStreak((data as number) || 0);
      }
      setIsLoading(false);
    };

    loadStreak();
  }, [userId]);

  if (isLoading) {
    return (
      <Card className="text-center">
        <p className="text-lofi-muted">Loading streak...</p>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-accent-orange">
      <div className="text-center">
        <p className="text-sm text-lofi-dark font-medium mb-2 flex items-center justify-center gap-2">
          <Image src="/icons/streaks.png" alt="" width={20} height={20} />
          Your Overall Streak
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-bold text-lofi-dark">
            {overallStreak}
          </span>
          <span className="text-lg text-lofi-brown">
            {overallStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
        <p className="text-xs text-lofi-brown mt-2">
          Consecutive weekdays with at least one habit completed
        </p>
      </div>
    </Card>
  );
}
