-- Remove foreign key constraints from video_progress table
-- This allows progress to be tracked even if videos or users are deleted later
-- The UNIQUE constraint on (user_id, video_id) will still prevent duplicates

-- Drop the foreign key constraints
ALTER TABLE public.video_progress 
DROP CONSTRAINT IF EXISTS fk_user;

ALTER TABLE public.video_progress 
DROP CONSTRAINT IF EXISTS fk_video;

-- Re-create the UNIQUE constraint if it doesn't exist
-- This ensures we only have one progress record per user per video
ALTER TABLE public.video_progress 
ADD CONSTRAINT video_progress_user_id_video_id_key UNIQUE(user_id, video_id);

-- Add a comment explaining the table structure
COMMENT ON TABLE public.video_progress IS 'Tracks user video watching progress without foreign key constraints for flexibility';
