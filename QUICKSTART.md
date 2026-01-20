# Quick Start Guide

## ⚡ Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (1-2 minutes)

### 3. Run Database Migrations

In Supabase Dashboard → SQL Editor, run these files in order:

**Copy/paste each file's content and run:**

1. `supabase/migrations/01_create_profiles.sql`
2. `supabase/migrations/02_create_tasks.sql`
3. `supabase/migrations/03_create_habits.sql`
4. `supabase/migrations/04_create_habit_completions.sql`
5. `supabase/migrations/05_create_streak_functions.sql`
6. `supabase/migrations/06_create_leaderboard_view.sql`

### 4. Configure Google OAuth

**In Google Cloud Console:**
1. Create a new project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:3000/auth/callback`

**In Supabase Dashboard:**
1. Go to Authentication → Providers → Google
2. Enable Google provider
3. Paste your Client ID and Client Secret

### 5. Set Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: Supabase Dashboard → Project Settings → API

### 6. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## ✅ Verification Checklist

- [ ] Dependencies installed
- [ ] Supabase project created
- [ ] All 6 migrations run successfully
- [ ] Google OAuth configured in both Google and Supabase
- [ ] `.env.local` file created with correct values
- [ ] App running on localhost:3000
- [ ] Can sign in with Google
- [ ] Username setup works
- [ ] Can add habits
- [ ] Dashboard loads
- [ ] Can add tasks (on weekday)
- [ ] Can check off habits
- [ ] Leaderboard shows your streak

## 🐛 Common Issues

**"Invalid credentials" error:**
- Double-check your `.env.local` values
- Restart dev server after adding env variables

**Google OAuth fails:**
- Verify redirect URI is exactly `http://localhost:3000/auth/callback`
- Check Client ID/Secret are correct

**Migrations fail:**
- Run them in exact order (01 through 06)
- Make sure previous migration succeeded before running next

**Can't add tasks on weekend:**
- This is expected! Tasks are weekdays only
- Try again on Monday-Friday

## 🚀 Next Steps

1. Test the complete user flow
2. Add some test data
3. Check streak calculations
4. Deploy to Vercel (see README.md)

Need help? Check the full README.md for detailed troubleshooting.
