/**
 * ASCII art utilities for the lofi aesthetic
 */

export const HEADER_ASCII = `
┌─────────────────────┐
│   locked in 🔒      │
│   stay consistent   │
└─────────────────────┘
`;

export const FOOTER_ASCII = `
───────────────────────
  one day at a time 🌱
───────────────────────
`;

export const WEEKEND_ASCII = `
╔═══════════════════╗
║  Rest & Recharge  ║
║     🌴 🌊 ☀️      ║
╚═══════════════════╝
`;

/**
 * Generate a simple box around text
 */
export function generateBox(text: string): string {
  const lines = text.split('\n');
  const maxLength = Math.max(...lines.map(line => line.length));
  const topBottom = '─'.repeat(maxLength + 2);

  const boxed = [
    `┌${topBottom}┐`,
    ...lines.map(line => `│ ${line.padEnd(maxLength)} │`),
    `└${topBottom}┘`
  ];

  return boxed.join('\n');
}

/**
 * Generate a simple divider
 */
export function generateDivider(length: number = 30): string {
  return '─'.repeat(length);
}

/**
 * Get a random motivational quote with emoji
 */
export function getMotivationalQuote(): string {
  const quotes = [
    'one day at a time 🌱',
    'consistency is key 🔑',
    'small steps, big results 🚀',
    'keep showing up ✨',
    'progress over perfection 📈',
    'you got this 💪',
    'stay locked in 🔒',
    'build the habit 🏗️',
    'every day counts 📅',
    'momentum is building 🌊'
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
}
