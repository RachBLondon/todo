interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-12 rounded-full transition-all ${
              index < currentStep
                ? 'bg-lofi-accent'
                : index === currentStep
                ? 'bg-lofi-accent/50'
                : 'bg-lofi-muted'
            }`}
          />
        ))}
      </div>
      <p className="text-center text-sm text-lofi-brown">
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}
