import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DateStreakBar } from '@/components/dashboard/DateStreakBar';
import { WeekStrip } from '@/components/dashboard/WeekStrip';
import { TaskList } from '@/components/tasks/TaskList';
import { HabitList } from '@/components/habits/HabitList';
import { OnboardingGuide } from '@/components/onboarding/OnboardingGuide';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <>
      <OnboardingGuide />
      <div className="space-y-5">
        <DateStreakBar userId={user.id} />

        <WeekStrip userId={user.id} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TaskList userId={user.id} />
          <HabitList userId={user.id} />
        </div>
      </div>
    </>
  );
}
