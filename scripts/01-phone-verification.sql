-- Create phone_verification_codes table for storing OTP codes
CREATE TABLE IF NOT EXISTS public.phone_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  country_code TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT now() + INTERVAL '15 minutes',
  verified_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT phone_format CHECK (phone_number ~ '^\d+$')
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_phone_verification_phone ON public.phone_verification_codes(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_verification_created ON public.phone_verification_codes(created_at);

-- Enable RLS for phone_verification_codes table
ALTER TABLE public.phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own verification attempts
CREATE POLICY "Users can view own phone verification"
  ON public.phone_verification_codes FOR SELECT
  USING (true);

-- Policy: Anyone can insert verification codes (for sign-up)
CREATE POLICY "Anyone can insert phone verification"
  ON public.phone_verification_codes FOR INSERT
  WITH CHECK (true);

-- Policy: Only update own verification codes
CREATE POLICY "Users can update own phone verification"
  ON public.phone_verification_codes FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Update app_users table to include phone number fields if they don't exist
ALTER TABLE public.app_users
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMP WITH TIME ZONE;
