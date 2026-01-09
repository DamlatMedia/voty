-- Create video_progress table to track user video watching progress
CREATE TABLE IF NOT EXISTS public.video_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL,
  progress_seconds FLOAT DEFAULT 0,
  total_duration_seconds FLOAT NOT NULL,
  status VARCHAR(50) DEFAULT 'watching', -- 'watching', 'completed'
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign keys
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_video FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE,
  UNIQUE(user_id, video_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON public.video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_video_id ON public.video_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_status ON public.video_progress(status);
CREATE INDEX IF NOT EXISTS idx_video_progress_user_status ON public.video_progress(user_id, status);

-- Enable RLS
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
CREATE POLICY "Users can view their own video progress"
  ON public.video_progress
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can insert their own progress
CREATE POLICY "Users can create their own video progress"
  ON public.video_progress
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own progress
CREATE POLICY "Users can update their own video progress"
  ON public.video_progress
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can delete their own progress
CREATE POLICY "Users can delete their own video progress"
  ON public.video_progress
  FOR DELETE
  USING (user_id = auth.uid());
