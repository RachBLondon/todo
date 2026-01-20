'use client';

import { useState } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
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
    <div className="flex items-center gap-3 p-3 bg-lofi-cream rounded-md border border-lofi-muted hover:border-lofi-accent transition-all group">
      <Checkbox
        checked={task.completed}
        onChange={handleToggle}
        disabled={isUpdating}
      />

      <span className="text-xl">{task.emoji}</span>

      <span
        className={`flex-1 ${
          task.completed ? 'line-through text-lofi-muted' : 'text-lofi-brown'
        }`}
      >
        {task.title}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isUpdating}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        🗑️
      </Button>
    </div>
  );
}
