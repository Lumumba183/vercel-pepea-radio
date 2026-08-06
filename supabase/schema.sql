-- Pepea Radio - Supabase Database Schema
-- Run this in the Supabase SQL Editor

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'National News',
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  featured BOOLEAN NOT NULL DEFAULT false,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedule table
CREATE TABLE IF NOT EXISTS schedule (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  show TEXT NOT NULL,
  host TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table (public story submissions)
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  stream_url TEXT NOT NULL DEFAULT 'https://stream.zeno.fm/placeholder',
  youtube_channel_id TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App users table (synced from Clerk, for role management)
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  allowed_areas TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brief items table (for the homepage slider)
CREATE TABLE IF NOT EXISTS brief_items (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE SET NULL,
  custom_title TEXT,
  custom_excerpt TEXT,
  position INTEGER NOT NULL DEFAULT 1,
  is_manual BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brief_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to articles, schedule, brief_items
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read schedule" ON schedule FOR SELECT USING (true);
CREATE POLICY "Public read brief_items" ON brief_items FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Allow public to submit reports
CREATE POLICY "Public insert reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read reports" ON reports FOR SELECT USING (true);

-- Admin-only write policies (using service role in API, so these are permissive)
CREATE POLICY "Admin all articles" ON articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all schedule" ON schedule FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all reports" ON reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all app_users" ON app_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all brief_items" ON brief_items FOR ALL USING (true) WITH CHECK (true);

-- Insert default schedule data
INSERT INTO schedule (day, time, show, host, description) VALUES
('Monday', '06:00 - 10:00', 'Morning Glory', 'DJ Mzazi', 'Start your day with energy, news, and great music.'),
('Monday', '10:00 - 14:00', 'Midday Mix', 'Sarah J', 'The best blend of hits and conversation.'),
('Monday', '14:00 - 18:00', 'Drive Time', 'Big Mike', 'Traffic updates, sports, and afternoon vibes.'),
('Monday', '18:00 - 22:00', 'Evening Express', 'Linda K', 'Deep conversations and relaxing tunes.'),
('Tuesday', '06:00 - 10:00', 'Morning Glory', 'DJ Mzazi', 'Start your day with energy, news, and great music.'),
('Tuesday', '10:00 - 14:00', 'Talk Central', 'James O', 'Current affairs and expert interviews.'),
('Tuesday', '14:00 - 18:00', 'Drive Time', 'Big Mike', 'Traffic updates, sports, and afternoon vibes.'),
('Tuesday', '18:00 - 22:00', 'Reggae Nights', 'Ras Kim', 'Roots, rock, and reggae until late.'),
('Wednesday', '06:00 - 10:00', 'Morning Glory', 'DJ Mzazi', 'Start your day with energy, news, and great music.'),
('Wednesday', '10:00 - 14:00', 'Midday Mix', 'Sarah J', 'The best blend of hits and conversation.'),
('Wednesday', '14:00 - 18:00', 'Drive Time', 'Big Mike', 'Traffic updates, sports, and afternoon vibes.'),
('Wednesday', '18:00 - 22:00', 'Gospel Hour', 'Pastor Ann', 'Inspirational music and messages.'),
('Thursday', '06:00 - 10:00', 'Morning Glory', 'DJ Mzazi', 'Start your day with energy, news, and great music.'),
('Thursday', '10:00 - 14:00', 'Talk Central', 'James O', 'Current affairs and expert interviews.'),
('Thursday', '14:00 - 18:00', 'Drive Time', 'Big Mike', 'Traffic updates, sports, and afternoon vibes.'),
('Thursday', '18:00 - 22:00', 'Hip Hop HQ', 'MC Flex', 'The freshest hip hop and rap from Kenya and beyond.'),
('Friday', '06:00 - 10:00', 'Morning Glory', 'DJ Mzazi', 'Start your day with energy, news, and great music.'),
('Friday', '10:00 - 14:00', 'Midday Mix', 'Sarah J', 'The best blend of hits and conversation.'),
('Friday', '14:00 - 18:00', 'Drive Time', 'Big Mike', 'Traffic updates, sports, and afternoon vibes.'),
('Friday', '18:00 - 23:00', 'Friday Jam', 'The Crew', 'The biggest party on radio. Non-stop hits.'),
('Saturday', '08:00 - 12:00', 'Weekend Wake-Up', 'Lisa M', 'Easy Saturday mornings with soft music and lifestyle.'),
('Saturday', '12:00 - 16:00', 'Sports Saturday', 'Kevin O', 'Live match commentary, analysis, and fan calls.'),
('Saturday', '16:00 - 20:00', 'Saturday Groove', 'DJ Vee', 'Afrobeat, benga, and dancehall to kick off the night.'),
('Sunday', '08:00 - 12:00', 'Sunday Soul', 'Grace W', 'Gospel, inspiration, and family talk.'),
('Sunday', '12:00 - 15:00', 'Sundowner', 'Tom K', 'Chill vibes and reflective conversations.'),
('Sunday', '15:00 - 19:00', 'Chart Show', 'DJ Mzazi', 'Counting down the biggest hits of the week.')
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO settings (id, stream_url, youtube_channel_id) VALUES (1, 'https://stream.zeno.fm/placeholder', '')
ON CONFLICT (id) DO NOTHING;
