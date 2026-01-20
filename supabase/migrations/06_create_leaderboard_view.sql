-- Create a materialized view for leaderboard performance
-- This will be refreshed periodically to avoid calculating streaks on every query
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

-- Note: In production, you would set up a cron job to refresh this periodically
-- For now, it can be refreshed manually or via an API endpoint
-- Example cron (requires pg_cron extension):
-- SELECT cron.schedule('refresh-leaderboard', '0 */6 * * *', 'SELECT refresh_leaderboard()');
