'use client';

import { FOOTER_ASCII, getMotivationalQuote } from '@/lib/utils/ascii';
import { useEffect, useState } from 'react';

export function Footer() {
  const [quote, setQuote] = useState('one day at a time 🌱');

  useEffect(() => {
    setQuote(getMotivationalQuote());
  }, []);

  return (
    <footer className="mt-auto py-6 border-t border-lofi-muted">
      <div className="max-w-6xl mx-auto px-4">
        <pre className="ascii-art text-center text-sm">
          {`───────────────────────\n  ${quote}\n───────────────────────`}
        </pre>
      </div>
    </footer>
  );
}
