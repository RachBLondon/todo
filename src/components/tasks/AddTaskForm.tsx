'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { EmojiPicker } from '../ui/EmojiPicker';
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
  const [emoji, setEmoji] = useState('📌');
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
          emoji,
          task_date: today,
          completed: false,
        });

      if (insertError) throw insertError;

      setTitle('');
      setEmoji('📌');
      onTaskAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canInteract()) {
    return (
      <div className="p-4 bg-lofi-tan/50 rounded-md border border-lofi-muted text-center">
        <p className="text-lofi-brown">
          🌴 It's the weekend - enjoy your rest!
        </p>
        <p className="text-sm text-lofi-muted mt-1">
          Tasks are for weekdays only
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <EmojiPicker
          value={emoji}
          onChange={setEmoji}
        />

        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task..."
            disabled={!canAddTask || isSubmitting}
            error={error}
          />
        </div>

        <Button
          type="submit"
          disabled={!canAddTask || !title.trim() || isSubmitting}
        >
          {isSubmitting ? '...' : 'Add'}
        </Button>
      </div>

      {currentTaskCount >= MAX_TASKS_PER_DAY && (
        <p className="text-sm text-lofi-muted text-center">
          Maximum {MAX_TASKS_PER_DAY} tasks per day reached
        </p>
      )}
    </form>
  );
}
