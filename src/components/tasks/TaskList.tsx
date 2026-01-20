'use client';

import { useEffect, useState } from 'react';
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

  const loadTasks = async () => {
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
  };

  useEffect(() => {
    loadTasks();
  }, [userId]);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-lofi-dark">
          Today's Tasks
        </h2>
        <span className="text-sm text-lofi-muted">
          {tasks.length}/{MAX_TASKS_PER_DAY} tasks
          {tasks.length > 0 && ` • ${completedCount} done`}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {isLoading ? (
          <div className="text-center py-8 text-lofi-muted">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-lofi-muted">
            No tasks yet. Add one below! 📝
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
