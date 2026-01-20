'use client';

import { useState } from 'react';
import { Button } from './Button';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
}

const EMOJI_OPTIONS = [
  '📌', '✅', '🎯', '💪', '🔥', '⭐', '✨', '🚀',
  '📚', '💻', '🎨', '🏃', '🧘', '💧', '🥗', '😴',
  '📝', '💰', '🎵', '🎮', '📱', '☕', '🌱', '🔒'
];

export function EmojiPicker({ value, onChange, className = '' }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center text-2xl border-2 border-lofi-muted rounded-md hover:border-lofi-accent transition-all bg-lofi-cream"
      >
        {value}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Emoji grid */}
          <div className="absolute z-20 mt-2 p-3 bg-lofi-tan border border-lofi-muted rounded-lg shadow-lg">
            <div className="grid grid-cols-6 gap-2 max-w-xs">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onChange(emoji);
                    setIsOpen(false);
                  }}
                  className={`w-10 h-10 flex items-center justify-center text-xl rounded hover:bg-lofi-accent transition-all ${
                    value === emoji ? 'bg-lofi-accent' : 'bg-lofi-cream'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
