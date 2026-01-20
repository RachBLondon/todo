import Image from 'next/image';
import { AsciiHeader } from '@/components/layout/AsciiHeader';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AsciiHeader />

        <Card className="mt-8 text-center">
          <h1 className="text-2xl font-bold text-lofi-dark mb-4">
            Stay Consistent. Build Momentum.
          </h1>

          <p className="text-lofi-brown mb-6 max-w-md mx-auto">
            Track up to 3 daily tasks and 5 core habits. Weekdays only.
            Build your streak and climb the leaderboard.
          </p>

          <div className="flex justify-center">
            <GoogleSignInButton />
          </div>
        </Card>

        <div className="mt-8 text-center">
          <div className="inline-block bg-lofi-tan border border-lofi-muted rounded-lg p-6">
            <h2 className="text-lg font-semibold text-lofi-dark mb-3">
              How it works
            </h2>
            <div className="text-left text-lofi-brown space-y-3">
              <p className="flex items-center gap-2">
                <Image src="/icons/Tasks.png" alt="" width={20} height={20} />
                <span><strong>Tasks:</strong> Max 3 per day (weekdays only)</span>
              </p>
              <p className="flex items-center gap-2">
                <Image src="/icons/Habits.png" alt="" width={20} height={20} />
                <span><strong>Habits:</strong> Set 5 core habits during onboarding</span>
              </p>
              <p className="flex items-center gap-2">
                <Image src="/icons/streaks.png" alt="" width={20} height={20} />
                <span><strong>Streaks:</strong> Consecutive weekdays completed</span>
              </p>
              <p className="flex items-center gap-2">
                <Image src="/icons/leader-board.png" alt="" width={20} height={20} />
                <span><strong>Leaderboard:</strong> Compete with others globally</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-lofi-muted">
          <p>Weekends are for rest. Tasks and habits reset Monday-Friday.</p>
        </div>
      </div>
    </div>
  );
}
