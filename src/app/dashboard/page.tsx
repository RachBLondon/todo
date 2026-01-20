import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { WeekdayIndicator } from '@/components/dashboard/WeekdayIndicator';
import { StreakStats } from '@/components/dashboard/StreakStats';
import { TaskList } from '@/components/tasks/TaskList';
import { HabitList } from '@/components/habits/HabitList';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <WeekdayIndicator />

      <StreakStats userId={user.id} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskList userId={user.id} />
        <HabitList userId={user.id} />
      </div>
    </div>
  );
}
