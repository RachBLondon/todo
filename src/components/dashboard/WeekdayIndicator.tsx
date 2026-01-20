'use client';

import { useEffect, useState } from 'react';
import { formatWeekday, canInteract, getWeekendMessage } from '@/lib/utils/dates';

export function WeekdayIndicator() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const isWeekday = canInteract(currentDate);

  return (
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-lofi-dark mb-2">
        {formatWeekday(currentDate)}
      </h1>
      {!isWeekday && (
        <div className="inline-block bg-lofi-tan border border-lofi-muted rounded-lg px-4 py-2">
          <p className="text-lofi-brown">{getWeekendMessage()}</p>
          <p className="text-sm text-lofi-muted mt-1">
            Your streaks are safe - come back Monday!
          </p>
        </div>
      )}
    </div>
  );
}
