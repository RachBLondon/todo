'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatWeekday, canInteract } from '@/lib/utils/dates';

interface DateStreakBarProps {
  userId: string;
}

export function DateStreakBar({ userId }: DateStreakBarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const isWeekday = canInteract(currentDate);

  return (
    <div className="flex items-end justify-between py-2">
      {/* Left: Logo */}
      <Link href="/dashboard">
        <Image
          src="/logo.png"
          alt="Locked In"
          width={160}
          height={60}
          className="w-auto"
        />
      </Link>

      {/* Right: Date */}
      <div className="text-right">
        <p className="text-lg font-bold text-lofi-dark">
          {formatWeekday(currentDate)}
        </p>
        {!isWeekday && (
          <p className="text-xs text-lofi-muted">Weekend - streaks are safe</p>
        )}
      </div>
    </div>
  );
}
