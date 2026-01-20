import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-2 rounded-md border bg-lofi-cream text-lofi-brown placeholder:text-lofi-muted focus:outline-none focus:ring-2 focus:ring-lofi-accent focus:border-transparent transition-all duration-200';
    const errorStyles = error ? 'border-red-400' : 'border-lofi-muted';

    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
