-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "admins_can_view_all_videos" ON videos;
DROP POLICY IF EXISTS "admins_can_insert_videos" ON videos;
DROP POLICY IF EXISTS "admins_can_update_videos" ON videos;
DROP POLICY IF EXISTS "admins_can_delete_videos" ON videos;
DROP POLICY IF EXISTS "users_can_view_approved_videos" ON videos;
DROP POLICY IF EXISTS "public_can_view_approved_videos" ON videos;

-- Ensure RLS is enabled
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public (unauthenticated) users can view approved videos
CREATE POLICY "public_can_view_approved_videos" ON videos
FOR SELECT
USING (status = 'approved');

-- Authenticated users can view approved videos
CREATE POLICY "authenticated_can_view_approved_videos" ON videos
FOR SELECT
USING (status = 'approved');

-- Admins can view all videos
CREATE POLICY "admins_can_view_all_videos" ON videos
FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin' OR auth.uid()::text = uploaded_by::text);

-- Admins can insert videos
CREATE POLICY "admins_can_insert_videos" ON videos
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin');

-- Admins can update videos
CREATE POLICY "admins_can_update_videos" ON videos
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin' OR auth.uid()::text = uploaded_by::text)
WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin' OR auth.uid()::text = uploaded_by::text);

-- Admins can delete videos
CREATE POLICY "admins_can_delete_videos" ON videos
FOR DELETE
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin' OR auth.uid()::text = uploaded_by::text);
