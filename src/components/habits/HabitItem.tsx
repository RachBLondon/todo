'use client';

import { useState } from 'react';
import { Checkbox } from '../ui/Checkbox';
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
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-lofi-muted/5 transition-colors">
      <Checkbox
        checked={habit.completedToday}
        onChange={handleToggle}
        disabled={!canCheck || isUpdating}
      />

      <span
        className={`flex-1 text-base ${
          habit.completedToday ? 'text-lofi-muted' : 'text-lofi-dark'
        }`}
      >
        {habit.title}
      </span>

      {habit.streak > 0 && (
        <span className="text-xs text-lofi-muted tabular-nums">
          {habit.streak}d
        </span>
      )}
    </div>
  );
}
