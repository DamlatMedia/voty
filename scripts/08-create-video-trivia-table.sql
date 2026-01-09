-- Create video_trivia junction table to link videos with their trivia questions
-- This table links existing videos to existing trivia_questions
CREATE TABLE IF NOT EXISTS public.video_trivia (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL,
  trivia_question_id uuid NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT video_trivia_pkey PRIMARY KEY (id),
  CONSTRAINT video_trivia_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE,
  CONSTRAINT video_trivia_question_id_fkey FOREIGN KEY (trivia_question_id) REFERENCES public.trivia_questions(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create unique constraint to prevent duplicate associations
CREATE UNIQUE INDEX IF NOT EXISTS idx_video_trivia_unique 
  ON public.video_trivia USING btree (video_id, trivia_question_id) TABLESPACE pg_default;

-- Create index for faster lookups by video
CREATE INDEX IF NOT EXISTS idx_video_trivia_video_id 
  ON public.video_trivia USING btree (video_id) TABLESPACE pg_default;

-- Create index for faster lookups by question
CREATE INDEX IF NOT EXISTS idx_video_trivia_question_id 
  ON public.video_trivia USING btree (trivia_question_id) TABLESPACE pg_default;

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.video_trivia 
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Enable RLS
ALTER TABLE public.video_trivia ENABLE ROW LEVEL SECURITY;

-- Create policies for video_trivia
CREATE POLICY "anyone_can_view_video_trivia" ON public.video_trivia
FOR SELECT
USING (true);

CREATE POLICY "admins_can_manage_video_trivia" ON public.video_trivia
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin');
