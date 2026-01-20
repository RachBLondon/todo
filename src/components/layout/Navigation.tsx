'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';

export function Navigation() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await fetch('/auth/signout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <nav className="border-b border-lofi-muted bg-lofi-tan/50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-md transition-all ${
                pathname === '/dashboard'
                  ? 'bg-lofi-accent text-lofi-dark'
                  : 'text-lofi-brown hover:bg-lofi-muted'
              }`}
            >
              Today
            </Link>
            <Link
              href="/dashboard/leaderboard"
              className={`px-4 py-2 rounded-md transition-all ${
                pathname === '/dashboard/leaderboard'
                  ? 'bg-lofi-accent text-lofi-dark'
                  : 'text-lofi-brown hover:bg-lofi-muted'
              }`}
            >
              Leaderboard
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
