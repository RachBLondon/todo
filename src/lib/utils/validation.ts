/**
 * Validation utilities for tasks and habits
 */

export const MAX_TASKS_PER_DAY = 3;
export const MAX_ACTIVE_HABITS = 5;

/**
 * Validate if a user can add more tasks for a given day
 */
export function canAddTask(currentTaskCount: number): boolean {
  return currentTaskCount < MAX_TASKS_PER_DAY;
}

/**
 * Validate if a user can add more habits
 */
export function canAddHabit(currentHabitCount: number): boolean {
  return currentHabitCount < MAX_ACTIVE_HABITS;
}

/**
 * Get remaining task slots for the day
 */
export function getRemainingTaskSlots(currentTaskCount: number): number {
  return Math.max(0, MAX_TASKS_PER_DAY - currentTaskCount);
}

/**
 * Get remaining habit slots
 */
export function getRemainingHabitSlots(currentHabitCount: number): number {
  return Math.max(0, MAX_ACTIVE_HABITS - currentHabitCount);
}

/**
 * Validate task title
 */
export function validateTaskTitle(title: string): { valid: boolean; error?: string } {
  const trimmed = title.trim();

  if (!trimmed) {
    return { valid: false, error: 'Task title cannot be empty' };
  }

  if (trimmed.length > 200) {
    return { valid: false, error: 'Task title must be 200 characters or less' };
  }

  return { valid: true };
}

/**
 * Validate habit title
 */
export function validateHabitTitle(title: string): { valid: boolean; error?: string } {
  const trimmed = title.trim();

  if (!trimmed) {
    return { valid: false, error: 'Habit title cannot be empty' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Habit title must be 100 characters or less' };
  }

  return { valid: true };
}

/**
 * Validate username
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  const trimmed = username.trim();

  if (!trimmed) {
    return { valid: false, error: 'Username cannot be empty' };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: 'Username must be 20 characters or less' };
  }

  // Only allow alphanumeric, underscore, and hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { valid: true };
}
