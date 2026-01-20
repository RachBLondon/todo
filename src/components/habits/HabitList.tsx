'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { HabitItem } from './HabitItem';
import { EditHabitsModal } from './EditHabitsModal';
import { getDateString } from '@/lib/utils/dates';
import { MAX_ACTIVE_HABITS } from '@/lib/utils/validation';
import type { Habit, HabitWithStreak } from '@/types/habits';

interface HabitListProps {
  userId: string;
}

export function HabitList({ userId }: HabitListProps) {
  const [habits, setHabits] = useState<HabitWithStreak[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadHabits = async () => {
    const supabase = createClient();
    const today = getDateString();

    // Fetch habits
    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (habitsError || !habitsData) {
      setIsLoading(false);
      return;
    }

    // Fetch completions for today
    const { data: completionsData } = await supabase
      .from('habit_completions')
      .select('habit_id')
      .eq('user_id', userId)
      .eq('completion_date', today);

    const completedIds = new Set(completionsData?.map(c => c.habit_id) || []);

    // Fetch streaks for each habit
    const habitsWithStreaks = await Promise.all(
      habitsData.map(async (habit) => {
        const { data: streakData } = await supabase.rpc('calculate_weekday_streak', {
          p_habit_id: habit.id,
        } as any);

        return {
          ...habit,
          streak: (streakData as number) || 0,
          completedToday: completedIds.has(habit.id),
        };
      })
    );

    setHabits(habitsWithStreaks);
    setIsLoading(false);
  };

  useEffect(() => {
    loadHabits();
  }, [userId]);

  const completedCount = habits.filter(h => h.completedToday).length;

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-lofi-dark">
            Core Habits
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-lofi-muted">
              {completedCount}/{habits.length} today
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Edit
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-lofi-muted">
              Loading habits...
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-8 text-lofi-muted">
              No habits set up yet
            </div>
          ) : (
            habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onUpdate={loadHabits}
              />
            ))
          )}

          {/* Show empty slots */}
          {habits.length < MAX_ACTIVE_HABITS && (
            <div className="text-center py-4 text-sm text-lofi-muted">
              {MAX_ACTIVE_HABITS - habits.length} empty habit slot{MAX_ACTIVE_HABITS - habits.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </Card>

      {showEditModal && (
        <EditHabitsModal
          habits={habits}
          onClose={() => setShowEditModal(false)}
          onSave={loadHabits}
        />
      )}
    </>
  );
}
