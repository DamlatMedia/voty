-- Create videos table with proper schema
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploader_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  view_count INTEGER DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_videos_updated_at ON videos;
CREATE TRIGGER trigger_videos_updated_at
BEFORE UPDATE ON videos
FOR EACH ROW
EXECUTE FUNCTION update_videos_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Allow admins to see and manage all videos
CREATE POLICY "admins_can_view_all_videos" ON videos
FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "admins_can_insert_videos" ON videos
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "admins_can_update_videos" ON videos
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "admins_can_delete_videos" ON videos
FOR DELETE
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin');

-- Allow users to view approved videos
CREATE POLICY "users_can_view_approved_videos" ON videos
FOR SELECT
USING (status = 'approved' OR auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin');
