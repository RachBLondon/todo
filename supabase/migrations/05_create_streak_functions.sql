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
-- A day counts if the user completed AT LEAST ONE habit
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
