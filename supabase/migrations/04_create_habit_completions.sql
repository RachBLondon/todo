-- Create habit_completions table
CREATE TABLE habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  completion_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, completion_date)
);

-- Enable Row Level Security
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own habit completions
CREATE POLICY "Users can view own habit completions"
  ON habit_completions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own habit completions
CREATE POLICY "Users can insert own habit completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own habit completions
CREATE POLICY "Users can delete own habit completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(completion_date);
CREATE INDEX idx_habit_completions_habit_date ON habit_completions(habit_id, completion_date);
