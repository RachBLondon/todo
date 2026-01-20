-- ============================================
-- LOCKED IN 🔒 - Complete Database Setup
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view public profile data"
  ON profiles FOR SELECT
  USING (true);

-- Create index on username for fast lookups
CREATE INDEX idx_profiles_username ON profiles(username);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. TASKS TABLE
-- ============================================

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  emoji TEXT DEFAULT '📌',
  completed BOOLEAN DEFAULT FALSE,
  task_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_task_date ON tasks(task_date);
CREATE INDEX idx_tasks_user_date ON tasks(user_id, task_date);

-- Create function to validate max 3 tasks per day
CREATE OR REPLACE FUNCTION check_max_tasks_per_day()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM tasks
    WHERE user_id = NEW.user_id
    AND task_date = NEW.task_date
  ) >= 3 THEN
    RAISE EXCEPTION 'Maximum 3 tasks per day allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce max tasks
CREATE TRIGGER enforce_max_tasks
  BEFORE INSERT ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION check_max_tasks_per_day();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. HABITS TABLE
-- ============================================

-- Create habits table
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  emoji TEXT DEFAULT '✅',
  active BOOLEAN DEFAULT TRUE,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_active ON habits(active);
CREATE INDEX idx_habits_user_active ON habits(user_id, active);

-- Create function to validate max 5 active habits per user
CREATE OR REPLACE FUNCTION check_max_habits_per_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.active = TRUE AND (
    SELECT COUNT(*)
    FROM habits
    WHERE user_id = NEW.user_id
    AND active = TRUE
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
  ) >= 5 THEN
    RAISE EXCEPTION 'Maximum 5 active habits allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce max habits
CREATE TRIGGER enforce_max_habits
  BEFORE INSERT OR UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION check_max_habits_per_user();

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. HABIT COMPLETIONS TABLE
-- ============================================

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
CREATE POLICY "Users can view own habit completions"
  ON habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(completion_date);
CREATE INDEX idx_habit_completions_habit_date ON habit_completions(habit_id, completion_date);

-- ============================================
-- 5. STREAK CALCULATION FUNCTIONS
-- ============================================

-- Function to calculate weekday streak for a single habit
CREATE OR REPLACE FUNCTION calculate_weekday_streak(
  p_habit_id UUID,
  p_current_date DATE DEFAULT CURRENT_DATE
)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_check_date DATE;
  v_completed BOOLEAN;
  v_day_of_week INTEGER;
  v_max_iterations INTEGER := 260; -- About 1 year of weekdays
  v_iteration INTEGER := 0;
BEGIN
  -- Start from the most recent weekday
  v_check_date := p_current_date;
  v_day_of_week := EXTRACT(DOW FROM v_check_date);

  -- If today is Saturday (6), go back to Friday
  IF v_day_of_week = 6 THEN
    v_check_date := v_check_date - INTERVAL '1 day';
  -- If today is Sunday (0), go back to Friday
  ELSIF v_day_of_week = 0 THEN
    v_check_date := v_check_date - INTERVAL '2 days';
  END IF;

  -- Loop through weekdays counting streak
  LOOP
    v_iteration := v_iteration + 1;
    EXIT WHEN v_iteration > v_max_iterations;

    v_day_of_week := EXTRACT(DOW FROM v_check_date);

    -- Skip weekends
    IF v_day_of_week = 0 OR v_day_of_week = 6 THEN
      v_check_date := v_check_date - INTERVAL '1 day';
      CONTINUE;
    END IF;

    -- Check if habit was completed on this date
    SELECT EXISTS(
      SELECT 1
      FROM habit_completions
      WHERE habit_id = p_habit_id
      AND completion_date = v_check_date
    ) INTO v_completed;

    -- If not completed, streak is broken
    IF NOT v_completed THEN
      EXIT;
    END IF;

    -- Increment streak and move to previous weekday
    v_streak := v_streak + 1;
    v_check_date := v_check_date - INTERVAL '1 day';
  END LOOP;

  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate overall user streak (across all habits)
CREATE OR REPLACE FUNCTION calculate_overall_user_streak(
  p_user_id UUID,
  p_current_date DATE DEFAULT CURRENT_DATE
)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_check_date DATE;
  v_has_completion BOOLEAN;
  v_day_of_week INTEGER;
  v_max_iterations INTEGER := 260; -- About 1 year of weekdays
  v_iteration INTEGER := 0;
BEGIN
  -- Start from the most recent weekday
  v_check_date := p_current_date;
  v_day_of_week := EXTRACT(DOW FROM v_check_date);

  -- If today is Saturday (6), go back to Friday
  IF v_day_of_week = 6 THEN
    v_check_date := v_check_date - INTERVAL '1 day';
  -- If today is Sunday (0), go back to Friday
  ELSIF v_day_of_week = 0 THEN
    v_check_date := v_check_date - INTERVAL '2 days';
  END IF;

  -- Loop through weekdays counting streak
  LOOP
    v_iteration := v_iteration + 1;
    EXIT WHEN v_iteration > v_max_iterations;

    v_day_of_week := EXTRACT(DOW FROM v_check_date);

    -- Skip weekends
    IF v_day_of_week = 0 OR v_day_of_week = 6 THEN
      v_check_date := v_check_date - INTERVAL '1 day';
      CONTINUE;
    END IF;

    -- Check if user completed at least one habit on this date
    SELECT EXISTS(
      SELECT 1
      FROM habit_completions
      WHERE user_id = p_user_id
      AND completion_date = v_check_date
    ) INTO v_has_completion;

    -- If no completions, streak is broken
    IF NOT v_has_completion THEN
      EXIT;
    END IF;

    -- Increment streak and move to previous weekday
    v_streak := v_streak + 1;
    v_check_date := v_check_date - INTERVAL '1 day';
  END LOOP;

  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. LEADERBOARD VIEW
-- ============================================

-- Create a materialized view for leaderboard performance
CREATE MATERIALIZED VIEW leaderboard_streaks AS
SELECT
  p.id,
  p.username,
  calculate_overall_user_streak(p.id, CURRENT_DATE) as streak
FROM profiles p
WHERE p.onboarding_completed = TRUE
  AND p.username IS NOT NULL
ORDER BY streak DESC;

-- Create index on the materialized view
CREATE INDEX idx_leaderboard_streaks_streak ON leaderboard_streaks(streak DESC);
CREATE UNIQUE INDEX idx_leaderboard_streaks_id ON leaderboard_streaks(id);

-- Create function to refresh the leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_streaks;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================
-- Next steps:
-- 1. Set up Google OAuth in Authentication > Providers
-- 2. Add your environment variables to .env.local
-- 3. Run: npm run dev
-- ============================================
