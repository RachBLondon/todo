export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          username: string
          full_name: string | null
          created_at: string
          updated_at: string
          onboarding_completed: boolean
        }
        Insert: {
          id: string
          email?: string | null
          username: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          email?: string | null
          username?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          emoji: string
          completed: boolean
          task_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          emoji?: string
          completed?: boolean
          task_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          emoji?: string
          completed?: boolean
          task_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          emoji: string
          active: boolean
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          emoji?: string
          active?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          emoji?: string
          active?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completion_date: string
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completion_date: string
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completion_date?: string
          created_at?: string
        }
      }
    }
    Views: {
      leaderboard_streaks: {
        Row: {
          id: string
          username: string
          streak: number
        }
      }
    }
    Functions: {
      calculate_weekday_streak: {
        Args: {
          p_habit_id: string
          p_current_date?: string
        }
        Returns: number
      }
      calculate_overall_user_streak: {
        Args: {
          p_user_id: string
          p_current_date?: string
        }
        Returns: number
      }
      refresh_leaderboard: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
