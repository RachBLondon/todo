import type { Database } from './database';

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export interface TaskWithStatus extends Task {
  isToday: boolean;
  canEdit: boolean;
}
