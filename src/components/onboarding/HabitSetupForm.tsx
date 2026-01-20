'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { EmojiPicker } from '../ui/EmojiPicker';
import { validateHabitTitle, MAX_ACTIVE_HABITS } from '@/lib/utils/validation';
import { createClient } from '@/lib/supabase/client';

interface Habit {
  title: string;
  emoji: string;
  display_order: number;
}

interface HabitSetupFormProps {
  userId: string;
  onComplete: () => void;
}

export function HabitSetupForm({ userId, onComplete }: HabitSetupFormProps) {
  const [habits, setHabits] = useState<Habit[]>([
    { title: '', emoji: '✅', display_order: 0 }
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addHabit = () => {
    if (habits.length < MAX_ACTIVE_HABITS) {
      setHabits([...habits, { title: '', emoji: '✅', display_order: habits.length }]);
      setErrors([...errors, '']);
    }
  };

  const removeHabit = (index: number) => {
    setHabits(habits.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  const updateHabit = (index: number, field: keyof Habit, value: string) => {
    const newHabits = [...habits];
    newHabits[index] = { ...newHabits[index], [field]: value };
    setHabits(newHabits);

    // Clear error for this field
    const newErrors = [...errors];
    newErrors[index] = '';
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    let hasError = false;

    // Validate all habits
    habits.forEach((habit) => {
      const validation = validateHabitTitle(habit.title);
      if (!validation.valid) {
        newErrors.push(validation.error || 'Invalid habit');
        hasError = true;
      } else {
        newErrors.push('');
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Insert all habits
      const habitsToInsert = habits.map((habit, index) => ({
        user_id: userId,
        title: habit.title.trim(),
        emoji: habit.emoji,
        display_order: index,
        active: true,
      }));

      const { error: insertError } = await supabase
        .from('habits')
        .insert(habitsToInsert);

      if (insertError) throw insertError;

      // Mark onboarding as complete
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId);

      if (updateError) throw updateError;

      onComplete();
    } catch (err: any) {
      console.error('Error creating habits:', err);
      setErrors(['Failed to create habits. Please try again.']);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {habits.map((habit, index) => (
          <div key={index} className="flex gap-3 items-start">
            <EmojiPicker
              value={habit.emoji}
              onChange={(emoji) => updateHabit(index, 'emoji', emoji)}
            />

            <div className="flex-1">
              <Input
                value={habit.title}
                onChange={(e) => updateHabit(index, 'title', e.target.value)}
                placeholder={`Habit ${index + 1}`}
                error={errors[index]}
                disabled={isLoading}
              />
            </div>

            {habits.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeHabit(index)}
                disabled={isLoading}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
      </div>

      {habits.length < MAX_ACTIVE_HABITS && (
        <Button
          type="button"
          variant="secondary"
          onClick={addHabit}
          disabled={isLoading}
          className="w-full"
        >
          Add Habit ({habits.length}/{MAX_ACTIVE_HABITS})
        </Button>
      )}

      <Button
        type="submit"
        disabled={isLoading || habits.some(h => !h.title.trim())}
        className="w-full"
      >
        {isLoading ? 'Creating habits...' : 'Complete Setup'}
      </Button>

      <p className="text-sm text-lofi-muted text-center">
        You can edit these habits later from the dashboard
      </p>
    </form>
  );
}
