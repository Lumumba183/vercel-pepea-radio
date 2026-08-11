-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL DEFAULT 'sidebar',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad inquiries table
CREATE TABLE IF NOT EXISTS ad_inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  ad_space TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for active advertisements
CREATE POLICY "Public can view active ads" ON advertisements
  FOR SELECT USING (is_active = true AND expires_at > NOW());

-- Service role can do everything
CREATE POLICY "Service role full access" ON advertisements
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access inquiries" ON ad_inquiries
  FOR ALL USING (true) WITH CHECK (true);

-- Public can create inquiries
CREATE POLICY "Public can create inquiries" ON ad_inquiries
  FOR INSERT WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET SETUP (Run in Supabase Dashboard)
-- ============================================
-- 1. Go to Supabase Dashboard → Storage → New Bucket
-- 2. Create bucket named: "ad-images"
-- 3. Set Public: YES (so images are publicly accessible)
-- 4. Set File size limit: 5MB
-- 5. Set Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- 
-- OR run this SQL in the SQL Editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('ad-images', 'ad-images', true);
--
-- Then set the bucket policy to allow public read:
-- CREATE POLICY "Public can read ad images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'ad-images');
--
-- And allow service role to upload:
-- CREATE POLICY "Service role can upload ad images" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'ad-images');
-- CREATE POLICY "Service role can delete ad images" ON storage.objects
--   FOR DELETE USING (bucket_id = 'ad-images');
