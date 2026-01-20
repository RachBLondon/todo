'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { validateTaskTitle, MAX_TASKS_PER_DAY } from '@/lib/utils/validation';
import { getDateString, canInteract } from '@/lib/utils/dates';

interface AddTaskFormProps {
  userId: string;
  currentTaskCount: number;
  onTaskAdded: () => void;
}

export function AddTaskForm({ userId, currentTaskCount, onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAddTask = canInteract() && currentTaskCount < MAX_TASKS_PER_DAY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!canInteract()) {
      setError('Tasks can only be added on weekdays');
      return;
    }

    if (currentTaskCount >= MAX_TASKS_PER_DAY) {
      setError(`Maximum ${MAX_TASKS_PER_DAY} tasks per day`);
      return;
    }

    const validation = validateTaskTitle(title);
    if (!validation.valid) {
      setError(validation.error || 'Invalid task title');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const today = getDateString();

      const { error: insertError } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: title.trim(),
          emoji: '📌',
          task_date: today,
          completed: false,
        });

      if (insertError) throw insertError;

      setTitle('');
      onTaskAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canInteract()) {
    return (
      <div className="py-3 text-center">
        <p className="text-sm text-lofi-muted">
          Weekend - tasks resume Monday
        </p>
      </div>
    );
  }

  if (currentTaskCount >= MAX_TASKS_PER_DAY) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          disabled={!canAddTask || isSubmitting}
          className="flex-1 px-3 py-2.5 text-base bg-lofi-muted/5 border-0 rounded-lg placeholder:text-lofi-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-orange/30"
        />
        <button
          type="submit"
          disabled={!canAddTask || !title.trim() || isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-lofi-dark rounded-lg hover:bg-lofi-dark/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </form>
  );
}
