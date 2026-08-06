# Pepea Radio - Vercel Setup Guide

## Do You Need Supabase?

**Yes, you absolutely need Supabase.** Here's why:

| Feature | Needs Supabase? |
|---------|----------------|
| Articles (news content) | ✅ Yes |
| Programme Schedule | ✅ Yes |
| Public Reports (story submissions) | ✅ Yes |
| Site Settings (stream URL, YouTube) | ✅ Yes |
| Brief Slider content | ✅ Yes |
| User roles & permissions | ✅ Yes |
| Clerk handles | ❌ Auth only (login/signup) |

**Supabase is your database.** Clerk only handles authentication (who can log in). Supabase stores all your content, schedule, reports, and settings.

---

## Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/log in
2. Click **"New Project"**
3. Name it `pepea-radio`
4. Choose a region close to your users (e.g., `South Africa` for Kenya)
5. Wait for the project to be created (takes 1-2 minutes)
6. Once created, go to **Project Settings > API**
7. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Step 2: Run the Database Schema

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open `supabase/schema.sql` from this project and copy the entire contents
4. Paste it into the SQL Editor
5. Click **"Run"**
6. This creates all tables: `articles`, `schedule`, `reports`, `settings`, `app_users`, `brief_items`

### Step 3: Set Up Clerk

1. Go to [https://clerk.com](https://clerk.com) and sign up/log in
2. Click **"Create Application"**
3. Name it `pepea-radio`
4. Select authentication methods (Email + Password recommended, add Google if desired)
5. Go to **API Keys**
6. Copy:
   - `Publishable key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret key` → `CLERK_SECRET_KEY`
7. Go to **Sessions** and set session duration (recommend 7 days)
8. Go to **JWT Templates** — no changes needed for this setup

### Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in ALL the values from Steps 1 & 3:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ADMIN_EMAIL=your-email@example.com
   ```

### Step 5: Make Yourself Admin

After your first login via Clerk, you need to add yourself to the `app_users` table as admin:

1. Go to Supabase → **Table Editor** → `app_users`
2. Click **"Insert Row"**
3. Fill in:
   - `id`: Use your Clerk User ID (find it in Clerk Dashboard > Users)
   - `email`: Your email address
   - `full_name`: Your name
   - `role`: `admin`
   - `allowed_areas`: Click the array field and add: `articles`, `schedule`, `reports`, `users`, `brief`, `settings`, `all`
4. Click **"Save"**

Alternatively, run this SQL in the SQL Editor (replace the email):
```sql
INSERT INTO app_users (id, email, full_name, role, allowed_areas)
VALUES ('your-clerk-user-id', 'your-email@example.com', 'Your Name', 'admin', ARRAY['articles','schedule','reports','users','brief','settings','all'])
ON CONFLICT (email) DO UPDATE SET role = 'admin', allowed_areas = ARRAY['articles','schedule','reports','users','brief','settings','all'];
```

### Step 6: Deploy to Vercel

1. Push this code to GitHub (see below)
2. Go to [https://vercel.com](https://vercel.com) and sign up/log in
3. Click **"Add New Project"**
4. Import your GitHub repository (`vercel-pepea-radio`)
5. Vercel will auto-detect Next.js
6. Add ALL environment variables from Step 4 in the Vercel dashboard:
   - Go to **Settings > Environment Variables**
   - Add each one
7. Click **"Deploy"**
8. Wait for build (takes 2-3 minutes)
9. Your site is live! 🎉

### Step 7: Add Your Stream URL

1. Visit your deployed site
2. Go to `/admin` and sign in
3. Navigate to **Settings**
4. Paste your radio stream URL (e.g., from Zeno.fm, Radio.co, etc.)
5. Add your YouTube Channel ID if you have one
6. Click **Save Settings**

---

## Admin Panel Features

### Articles
- Create, edit, delete news articles
- Set categories: National News, County News, World News, Politics, Sports, Health, Celebrity, Swahili, Community, Opinion
- Mark articles as "Featured" to show on homepage
- Full HTML content support

### Programme Schedule
- Add/edit/delete radio shows
- Organize by day and time slot
- Set host names and descriptions

### Reports
- View public story submissions
- Mark as Reviewed / Resolved
- View full message details

### Users (Admin Only)
- Create staff accounts without Clerk sign-up
- Assign roles: `admin`, `editor`, `user`
- Control area access: articles, schedule, reports, users, brief, settings
- Only admins can access User Management

### Brief Slider
- Auto-fills from the 5 latest articles
- Add manual entries (not linked to articles)
- Reorder/remove items
- Displays as a scrolling ticker on the homepage

### Settings
- Stream URL: Your radio live stream link
- YouTube Channel ID: For embedding live video

---

## File Structure

```
vercel-pepea-radio/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard
│   │   ├── page.tsx        # Main admin (articles, schedule, reports, dashboard)
│   │   ├── users/page.tsx  # User management
│   │   ├── brief/page.tsx  # Brief slider management
│   │   └── settings/page.tsx # Site settings
│   ├── api/                # API routes
│   │   ├── articles/       # CRUD for articles
│   │   ├── schedule/       # CRUD for schedule
│   │   ├── reports/        # CRUD for reports
│   │   ├── settings/       # Site settings
│   │   ├── users/          # User management
│   │   └── brief/          # Brief slider items
│   ├── article/[id]/       # Article detail page
│   ├── news/               # News listing
│   ├── listen/             # Listen live page
│   ├── tv/                 # Pepea TV page
│   ├── schedule/           # Schedule page
│   ├── advertise/          # Advertise page
│   ├── report/             # Report story page
│   ├── about/              # About page
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── cookies/            # Cookie policy
│   ├── sign-in/            # Clerk sign in
│   ├── sign-up/            # Clerk sign up
│   ├── layout.tsx          # Root layout with Clerk
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── Header.tsx          # Site header/nav
│   ├── Footer.tsx          # Site footer
│   ├── PlayerBar.tsx       # Bottom audio player
│   └── BriefSlider.tsx     # Homepage brief ticker
├── lib/                    # Utilities
│   ├── supabase.ts         # Supabase clients
│   └── utils.ts            # Helper functions
├── types/                  # TypeScript types
│   └── index.ts
├── supabase/
│   └── schema.sql          # Database schema
├── .env.local.example      # Environment template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Icons | Lucide React |

---

## Troubleshooting

### "Access Denied" on Admin Panel
- Make sure you've added yourself to the `app_users` table with `role = 'admin'`
- Check that your email in Clerk matches the email in `app_users`

### Articles not showing
- Check Supabase → Table Editor → `articles` — are there rows?
- Check browser console for API errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Stream not playing
- Go to Admin → Settings and set your stream URL
- Test the URL directly in a browser tab (should download/play audio)
- Some streams need CORS headers — Zeno.fm usually works fine

### Build fails on Vercel
- Check that all environment variables are set
- Make sure `package.json` has all dependencies
- Check Vercel build logs for specific errors

---

## Post-Deploy Checklist

- [ ] Sign up via Clerk on the deployed site
- [ ] Add yourself as admin in Supabase `app_users` table
- [ ] Log in and verify admin panel loads
- [ ] Create your first article
- [ ] Set your radio stream URL in Settings
- [ ] Test the live player on `/listen`
- [ ] Submit a test report on `/report`
- [ ] Configure Brief slider (auto-fill or manual)
- [ ] Add team members via User Management

---

## Support

For issues with:
- **Clerk**: [clerk.com/docs](https://clerk.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
