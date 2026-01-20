'use client';

import { useState } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { StreakBadge } from './StreakBadge';
import { createClient } from '@/lib/supabase/client';
import { canInteract, getDateString } from '@/lib/utils/dates';
import type { HabitWithStreak } from '@/types/habits';

interface HabitItemProps {
  habit: HabitWithStreak;
  onUpdate: () => void;
}

export function HabitItem({ habit, onUpdate }: HabitItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const canCheck = canInteract();

  const handleToggle = async () => {
    if (!canCheck) return;

    setIsUpdating(true);
    const supabase = createClient();
    const today = getDateString();

    if (habit.completedToday) {
      // Remove completion
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habit.id)
        .eq('completion_date', today);

      if (!error) {
        onUpdate();
      }
    } else {
      // Add completion
      const { error } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habit.id,
          user_id: habit.user_id,
          completion_date: today,
        });

      if (!error) {
        onUpdate();
      }
    }

    setIsUpdating(false);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-lofi-cream rounded-md border border-lofi-muted hover:border-lofi-accent transition-all">
      <Checkbox
        checked={habit.completedToday}
        onChange={handleToggle}
        disabled={!canCheck || isUpdating}
      />

      <span className="text-2xl">{habit.emoji}</span>

      <div className="flex-1">
        <h3 className="font-medium text-lofi-brown">{habit.title}</h3>
        {!canCheck && (
          <p className="text-xs text-lofi-muted">Rest day 🌴</p>
        )}
      </div>

      <StreakBadge streak={habit.streak} />
    </div>
  );
}
