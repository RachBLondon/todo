import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'bg-lofi-tan border border-lofi-muted rounded-lg';

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${paddings[padding]} ${className}`}
        style={{ boxShadow: 'var(--shadow-lofi)' }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
