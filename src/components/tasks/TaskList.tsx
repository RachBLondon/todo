'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '../ui/Card';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';
import { getDateString } from '@/lib/utils/dates';
import { MAX_TASKS_PER_DAY } from '@/lib/utils/validation';
import type { Task } from '@/types/tasks';

interface TaskListProps {
  userId: string;
}

export function TaskList({ userId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    const supabase = createClient();
    const today = getDateString();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('task_date', today)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setTasks(data);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold text-lofi-dark">Tasks</p>
        <span className="text-sm text-lofi-muted">
          {completedCount} / {MAX_TASKS_PER_DAY} completed
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {isLoading ? (
          <div className="text-center py-6 text-sm text-lofi-muted">
            Loading...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-6 text-sm text-lofi-muted">
            No tasks yet
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={loadTasks}
            />
          ))
        )}
      </div>

      <AddTaskForm
        userId={userId}
        currentTaskCount={tasks.length}
        onTaskAdded={loadTasks}
      />
    </Card>
  );
}
