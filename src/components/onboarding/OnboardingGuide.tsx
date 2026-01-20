'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const STORAGE_KEY = 'lockedin_onboarding_seen';

const steps = [
  {
    icon: '/icons/Tasks.png',
    title: 'Daily Tasks',
    description: 'Add up to 3 tasks each weekday. Keep it focused.',
  },
  {
    icon: '/icons/Habits.png',
    title: 'Core Habits',
    description: 'Set 5 habits you want to build. Track them daily.',
  },
  {
    icon: '/icons/streaks.png',
    title: 'Streaks',
    description: 'Complete habits on weekdays to build your streak.',
  },
  {
    icon: '/icons/leader-board.png',
    title: 'Leaderboard',
    description: 'See how you rank against others globally.',
  },
];

export function OnboardingGuide() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  };

  const handleSkip = () => {
    handleDismiss();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#E3C8BB] rounded-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-lofi-muted/20">
          <div
            className="h-full bg-accent-orange transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-lofi-tan/50 rounded-2xl">
            <Image src={step.icon} alt="" width={32} height={32} />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-lofi-dark mb-2">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-lofi-muted mb-8">
            {step.description}
          </p>

          {/* Step indicator */}
          <div className="flex justify-center gap-1.5 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-accent-orange' : 'bg-lofi-muted/30'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-3 text-sm font-medium text-lofi-muted hover:text-lofi-dark transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-accent-orange rounded-xl hover:bg-accent-orange/90 transition-colors"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
