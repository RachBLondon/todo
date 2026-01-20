import type { Database } from './database';

export type Habit = Database['public']['Tables']['habits']['Row'];
export type HabitInsert = Database['public']['Tables']['habits']['Insert'];
export type HabitUpdate = Database['public']['Tables']['habits']['Update'];

export type HabitCompletion = Database['public']['Tables']['habit_completions']['Row'];
export type HabitCompletionInsert = Database['public']['Tables']['habit_completions']['Insert'];

export interface HabitWithStreak extends Habit {
  streak: number;
  completedToday: boolean;
}
