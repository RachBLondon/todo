'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateUsername } from '@/lib/utils/validation';
import { createClient } from '@/lib/supabase/client';

interface UsernameFormProps {
  userId: string;
  onComplete: () => void;
}

export function UsernameForm({ userId, onComplete }: UsernameFormProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate username format
    const validation = validateUsername(username);
    if (!validation.valid) {
      setError(validation.error || 'Invalid username');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Check if username is already taken
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.trim())
        .single();

      if (existing) {
        setError('Username is already taken');
        setIsLoading(false);
        return;
      }

      // Update profile with username
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('id', userId);

      if (updateError) throw updateError;

      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to set username');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-lofi-brown mb-2">
          Choose a username
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your_username"
          error={error}
          disabled={isLoading}
          autoFocus
        />
        <p className="mt-1 text-sm text-lofi-muted">
          3-20 characters, letters, numbers, underscore, and hyphen only
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !username.trim()}
        className="w-full"
      >
        {isLoading ? 'Setting username...' : 'Continue'}
      </Button>
    </form>
  );
}
