-- ============================================
-- Pepea Radio Analytics: page_views table
-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql
-- ============================================

-- Create the page_views table for analytics tracking
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  page TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for fast querying by date (used in dashboard stats)
CREATE INDEX IF NOT EXISTS idx_page_views_created_at 
  ON page_views (created_at DESC);

-- Add index for session lookups (used in live viewers count)
CREATE INDEX IF NOT EXISTS idx_page_views_session_id 
  ON page_views (session_id);

-- Add index for page breakdown (used in top pages)
CREATE INDEX IF NOT EXISTS idx_page_views_page 
  ON page_views (page);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow service role (backend) to insert/read all data
CREATE POLICY "Service role can insert page views" 
  ON page_views FOR INSERT 
  TO service_role 
  WITH CHECK (true);

CREATE POLICY "Service role can read page views" 
  ON page_views FOR SELECT 
  TO service_role 
  USING (true);

-- ============================================
-- After running this SQL, the analytics will work:
-- 
-- /api/analytics/track   → stores page views  ✅
-- /api/analytics         → returns dashboard stats  ✅
-- 
-- Dashboard cards that will show data:
-- • Live Viewers (unique sessions in last 5 min)
-- • Views Today
-- • Total Views
-- • Top Pages breakdown
-- ============================================
