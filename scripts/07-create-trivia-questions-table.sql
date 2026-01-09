-- Create trivia_questions table
CREATE TABLE IF NOT EXISTS public.trivia_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer VARCHAR(10) NOT NULL,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'medium',
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_trivia_category ON public.trivia_questions(category);
CREATE INDEX IF NOT EXISTS idx_trivia_admin_id ON public.trivia_questions(admin_id);
CREATE INDEX IF NOT EXISTS idx_trivia_difficulty ON public.trivia_questions(difficulty);

-- Enable RLS
ALTER TABLE public.trivia_questions ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all trivia questions
CREATE POLICY "Admins can view trivia questions"
  ON public.trivia_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Admins can insert their own trivia questions
CREATE POLICY "Admins can create trivia questions"
  ON public.trivia_questions
  FOR INSERT
  WITH CHECK (
    admin_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Admins can update their own trivia questions
CREATE POLICY "Admins can update trivia questions"
  ON public.trivia_questions
  FOR UPDATE
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

-- Policy: Admins can delete their own trivia questions
CREATE POLICY "Admins can delete trivia questions"
  ON public.trivia_questions
  FOR DELETE
  USING (admin_id = auth.uid());

-- Policy: Regular users can view trivia questions for quizzes
CREATE POLICY "Users can view trivia questions"
  ON public.trivia_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'user'
    )
  );

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_trivia_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS trigger_update_trivia_questions_updated_at ON public.trivia_questions;
CREATE TRIGGER trigger_update_trivia_questions_updated_at
  BEFORE UPDATE ON public.trivia_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_trivia_questions_updated_at();
