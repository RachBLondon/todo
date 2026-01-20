'use client';

import { useState } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { createClient } from '@/lib/supabase/client';
import type { Task } from '@/types/tasks';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

export function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', task.id);

    if (!error) {
      onUpdate();
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;

    setIsUpdating(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task.id);

    if (!error) {
      onUpdate();
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-lofi-muted/5 transition-colors group">
      <Checkbox
        checked={task.completed}
        onChange={handleToggle}
        disabled={isUpdating}
      />

      <span
        className={`flex-1 text-base ${
          task.completed ? 'line-through text-lofi-muted' : 'text-lofi-dark'
        }`}
      >
        {task.title}
      </span>

      <button
        onClick={handleDelete}
        disabled={isUpdating}
        className="opacity-0 group-hover:opacity-100 p-1 text-lofi-muted hover:text-red-500 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
