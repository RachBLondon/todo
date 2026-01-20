import { format, isToday as isTodayFn, isWeekend, addDays, subDays } from 'date-fns';

/**
 * Check if a date is a weekday (Monday-Friday)
 */
export function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isTodayFn(date);
}

/**
 * Get the previous weekday before a given date
 * If the date is Monday, returns previous Friday
 */
export function getPreviousWeekday(date: Date): Date {
  const dayOfWeek = date.getDay();

  // If Sunday (0), go back 2 days to Friday
  if (dayOfWeek === 0) {
    return subDays(date, 2);
  }
  // If Monday (1), go back 3 days to Friday
  if (dayOfWeek === 1) {
    return subDays(date, 3);
  }
  // Otherwise, just go back 1 day
  return subDays(date, 1);
}

/**
 * Get the next weekday after a given date
 * If the date is Friday, returns next Monday
 */
export function getNextWeekday(date: Date): Date {
  const dayOfWeek = date.getDay();

  // If Friday (5), go forward 3 days to Monday
  if (dayOfWeek === 5) {
    return addDays(date, 3);
  }
  // If Saturday (6), go forward 2 days to Monday
  if (dayOfWeek === 6) {
    return addDays(date, 2);
  }
  // Otherwise, just go forward 1 day
  return addDays(date, 1);
}

/**
 * Format a date as a weekday name with date
 * Example: "Monday, Jan 20"
 */
export function formatWeekday(date: Date): string {
  return format(date, 'EEEE, MMM d');
}

/**
 * Format a date as a full date string
 * Example: "January 20, 2026"
 */
export function formatFullDate(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

/**
 * Get a user-friendly weekend message
 */
export function getWeekendMessage(): string {
  return "🌴 It's the weekend - enjoy your rest!";
}

/**
 * Get the current date in YYYY-MM-DD format for database queries
 */
export function getDateString(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Check if we should allow task/habit interactions
 * Only allow on weekdays
 */
export function canInteract(date: Date = new Date()): boolean {
  return isWeekday(date);
}
