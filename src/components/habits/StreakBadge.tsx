interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (streak === 0) {
    return (
      <span className={`${sizes[size]} text-lofi-muted`}>
        No streak yet
      </span>
    );
  }

  return (
    <span className={`${sizes[size]} font-semibold text-lofi-dark flex items-center gap-1`}>
      <span className="animate-pulse">🔥</span>
      <span>{streak}</span>
    </span>
  );
}
