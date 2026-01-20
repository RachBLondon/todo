'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format, startOfWeek, addDays, isToday, isBefore } from 'date-fns';

interface WeekStripProps {
  userId: string;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function WeekStrip({ userId }: WeekStripProps) {
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    const loadWeekData = async () => {
      const supabase = createClient();
      const today = new Date();

      // Get Monday of current week
      const monday = startOfWeek(today, { weekStartsOn: 1 });

      // Get dates for Mon-Fri
      const weekDates = WEEKDAYS.map((_, i) => format(addDays(monday, i), 'yyyy-MM-dd'));

      // Fetch completions for this week
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('completion_date')
        .eq('user_id', userId)
        .in('completion_date', weekDates);

      if (completions) {
        const completed = new Set(completions.map(c => c.completion_date));
        setCompletedDays(completed);
      }

      // Get overall streak
      const { data: streakData } = await supabase.rpc('calculate_overall_user_streak', {
        p_user_id: userId,
      } as any);

      setStreak(typeof streakData === 'number' ? streakData : 0);
    };

    loadWeekData();
  }, [userId]);

  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-[#7FAF96] rounded-xl">
      {/* Weekday pills */}
      <div className="flex items-center gap-1.5">
        {WEEKDAYS.map((day, index) => {
          const date = addDays(monday, index);
          const dateStr = format(date, 'yyyy-MM-dd');
          const isCompleted = completedDays.has(dateStr);
          const isCurrent = isToday(date);
          const isPast = isBefore(date, today) && !isCurrent;
          const isFuture = !isPast && !isCurrent;

          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#2D4A3E] font-ui">{day}</span>
              <div
                className={`w-6 h-2 rounded-full transition-all ${
                  isCompleted
                    ? 'bg-[#3D6B4F]'
                    : isCurrent
                    ? 'bg-white/50'
                    : isFuture
                    ? 'bg-white/30'
                    : 'bg-[#2D4A3E]/20'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Streak label */}
      <span className="text-sm font-medium text-[#2D4A3E]">
        {streak > 0 ? `${streak}-day streak` : 'Start your streak'}
      </span>
    </div>
  );
}
