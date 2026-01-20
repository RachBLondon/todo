'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getAvatarPath } from '@/lib/utils/avatar';

export function TopBar() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    loadUser();
  }, []);

  const handleSignOut = async () => {
    await fetch('/auth/signout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <header className="bg-[#E3C8B1] sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Left: Nav Tabs */}
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`py-1 text-sm font-medium transition-colors hover:text-lofi-dark ${
                pathname === '/dashboard'
                  ? 'text-lofi-dark border-b-2 border-lofi-dark'
                  : 'text-lofi-dark/60'
              }`}
            >
              Today
            </Link>
            <Link
              href="/dashboard/leaderboard"
              className={`py-1 text-sm font-medium transition-colors hover:text-lofi-dark ${
                pathname === '/dashboard/leaderboard'
                  ? 'text-lofi-dark border-b-2 border-lofi-dark'
                  : 'text-lofi-dark/60'
              }`}
            >
              Leaderboard
            </Link>
          </nav>

          {/* Right: User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-lofi-dark/20 transition-all"
            >
              {userId ? (
                <Image
                  src={getAvatarPath(userId)}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-lofi-muted/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-lofi-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-36 bg-[#E3C8BB] rounded-lg py-1 z-20">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-lofi-muted hover:text-lofi-dark hover:bg-lofi-muted/10 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
