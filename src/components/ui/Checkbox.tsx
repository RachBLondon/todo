'use client';

import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`w-5 h-5 rounded border-2 border-lofi-muted text-lofi-accent focus:ring-2 focus:ring-lofi-accent focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-lofi-brown cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
