-- Add profile picture column to users table
ALTER TABLE public.users
ADD COLUMN pic text NULL;

-- Add a comment to describe the column
COMMENT ON COLUMN public.users.pic IS 'User profile picture stored as base64 encoded string or URL';
