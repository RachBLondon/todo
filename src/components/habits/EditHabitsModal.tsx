'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EmojiPicker } from '../ui/EmojiPicker';
import { createClient } from '@/lib/supabase/client';
import { validateHabitTitle } from '@/lib/utils/validation';
import type { Habit } from '@/types/habits';

interface EditHabitsModalProps {
  habits: Habit[];
  onClose: () => void;
  onSave: () => void;
}

export function EditHabitsModal({ habits, onClose, onSave }: EditHabitsModalProps) {
  const [editedHabits, setEditedHabits] = useState(habits);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateHabit = (id: string, field: 'title' | 'emoji', value: string) => {
    setEditedHabits(prev =>
      prev.map(h => h.id === id ? { ...h, [field]: value } : h)
    );
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    // Validate all habits
    editedHabits.forEach(habit => {
      const validation = validateHabitTitle(habit.title);
      if (!validation.valid) {
        newErrors[habit.id] = validation.error || 'Invalid habit';
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      // Update each habit
      for (const habit of editedHabits) {
        const { error } = await supabase
          .from('habits')
          .update({
            title: habit.title.trim(),
            emoji: habit.emoji,
          })
          .eq('id', habit.id);

        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error updating habits:', err);
      alert('Failed to update habits');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-lofi-cream rounded-lg border border-lofi-muted max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-lofi-dark mb-4">
          Edit Habits
        </h2>

        <div className="space-y-4 mb-6">
          {editedHabits.map(habit => (
            <div key={habit.id} className="flex gap-3 items-start">
              <EmojiPicker
                value={habit.emoji}
                onChange={(emoji) => updateHabit(habit.id, 'emoji', emoji)}
              />

              <div className="flex-1">
                <Input
                  value={habit.title}
                  onChange={(e) => updateHabit(habit.id, 'title', e.target.value)}
                  error={errors[habit.id]}
                  disabled={isSaving}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || editedHabits.some(h => !h.title.trim())}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
