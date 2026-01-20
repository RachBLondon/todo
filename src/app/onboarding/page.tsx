'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AsciiHeader } from '@/components/layout/AsciiHeader';
import { Card } from '@/components/ui/Card';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { UsernameForm } from '@/components/onboarding/UsernameForm';
import { HabitSetupForm } from '@/components/onboarding/HabitSetupForm';

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/');
        return;
      }

      setUserId(user.id);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleUsernameComplete = () => {
    setStep(1);
  };

  const handleHabitsComplete = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lofi-brown">Loading...</p>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AsciiHeader />

        <Card className="mt-8">
          <OnboardingProgress currentStep={step} totalSteps={2} />

          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-lofi-dark mb-2 text-center">
                Welcome! 👋
              </h2>
              <p className="text-lofi-brown mb-6 text-center">
                Let's get you set up with a username
              </p>
              <UsernameForm userId={userId} onComplete={handleUsernameComplete} />
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-lofi-dark mb-2 text-center">
                Set Your Core Habits 🎯
              </h2>
              <p className="text-lofi-brown mb-6 text-center">
                Choose 1-5 habits you want to track every weekday
              </p>
              <HabitSetupForm userId={userId} onComplete={handleHabitsComplete} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
