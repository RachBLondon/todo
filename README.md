# locked in 🔒

A minimalist, lofi-styled daily task and habit tracker to help you stay locked in on your weekday goals.

## Features

- **Tasks**: Max 3 per day, weekdays only
- **Habits**: Set 5 core habits during onboarding with weekday-only streak tracking
- **Leaderboard**: Global leaderboard showing users with the longest overall streaks
- **Authentication**: Google SSO (single sign-on)
- **Design**: ASCII art header, lofi aesthetic, emoji-rich UI

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Google OAuth credentials

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd todo
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API** and copy:
   - `Project URL`
   - `anon/public` key

3. Run the database migrations in the Supabase SQL Editor (in order):
   - `supabase/migrations/01_create_profiles.sql`
   - `supabase/migrations/02_create_tasks.sql`
   - `supabase/migrations/03_create_habits.sql`
   - `supabase/migrations/04_create_habit_completions.sql`
   - `supabase/migrations/05_create_streak_functions.sql`
   - `supabase/migrations/06_create_leaderboard_view.sql`

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)
6. Copy the **Client ID** and **Client Secret**

7. In Supabase Dashboard:
   - Go to **Authentication** → **Providers**
   - Enable Google provider
   - Paste your Client ID and Client Secret
   - Save

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Key Features Explained

### Weekday-Only System

- **Tasks and habits are only active Monday-Friday**
- Weekends display a rest message: "🌴 It's the weekend - enjoy your rest!"
- Streaks continue across weekends (Friday → Monday)
- Habit checkboxes are disabled on weekends

### Streak Calculation

- **Individual Habit Streaks**: Consecutive weekdays a habit was completed
- **Overall User Streak**: Consecutive weekdays with at least one habit completed
- Streaks are calculated server-side using PostgreSQL functions
- Weekend days are automatically skipped in calculations

### Limits

- **Max 3 tasks per day** (enforced by database constraint)
- **Max 5 active habits per user** (enforced by database constraint)
- Both limits have UI validation and helpful error messages

## Project Structure

```
todo/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Landing page
│   │   ├── layout.tsx        # Root layout
│   │   ├── auth/             # Auth callbacks
│   │   ├── onboarding/       # Username + habits setup
│   │   └── dashboard/        # Main app + leaderboard
│   ├── components/           # React components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Header, nav, footer
│   │   ├── auth/             # Google sign-in
│   │   ├── onboarding/       # Onboarding flow
│   │   ├── tasks/            # Task management
│   │   ├── habits/           # Habit tracking
│   │   ├── leaderboard/      # Leaderboard display
│   │   └── dashboard/        # Dashboard components
│   ├── lib/
│   │   ├── supabase/         # Supabase clients
│   │   └── utils/            # Utility functions
│   ├── types/                # TypeScript types
│   └── middleware.ts         # Auth & routing middleware
└── supabase/
    └── migrations/           # Database migrations
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Update Google OAuth

After deployment, add your production URL to:
- Google Cloud Console authorized redirect URIs
- Supabase Google provider configuration

Example: `https://your-app.vercel.app/auth/callback`

## Database Maintenance

### Refresh Leaderboard Cache

The leaderboard uses a materialized view for performance. To refresh:

```sql
SELECT refresh_leaderboard();
```

Consider setting up a cron job to refresh periodically (e.g., every 6 hours).

## Customization

### Color Scheme

Edit `src/app/globals.css` to customize the lofi color palette:

```css
:root {
  --lofi-cream: #F5F1E8;
  --lofi-tan: #E8DCC4;
  --lofi-brown: #8B7355;
  --lofi-accent: #D4A574;
  --lofi-muted: #C4B5A0;
  --lofi-dark: #4A3F35;
}
```

### ASCII Art

Edit `src/lib/utils/ascii.ts` to customize headers, footers, and motivational quotes.

### Emoji Options

Edit the `EMOJI_OPTIONS` array in `src/components/ui/EmojiPicker.tsx` to add or remove emoji choices.

## Troubleshooting

### "Maximum 3 tasks per day" error persists

- This is a database constraint
- Check that old tasks were properly deleted
- Verify the date is correct (timezone issues)

### Streaks not calculating correctly

- Ensure all migrations ran successfully
- Check that the PostgreSQL functions exist:
  ```sql
  SELECT * FROM pg_proc WHERE proname LIKE '%streak%';
  ```
- Verify habit_completions table has data

### Google OAuth not working

- Double-check redirect URIs match exactly (including http/https)
- Ensure Google+ API is enabled
- Verify Client ID and Secret in Supabase

## License

MIT

## Credits

Built with love for productivity enthusiasts who believe in consistency over perfection. 🌱
# todo
