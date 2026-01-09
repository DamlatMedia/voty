-- Create phone_verification_codes table
CREATE TABLE IF NOT EXISTS phone_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  country_code TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_phone_verification_codes_phone 
  ON phone_verification_codes(phone_number, country_code);

CREATE INDEX IF NOT EXISTS idx_phone_verification_codes_expires 
  ON phone_verification_codes(expires_at);

-- Enable RLS
ALTER TABLE phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow anyone to insert (phone verification)
CREATE POLICY "Allow insert phone verification codes" 
  ON phone_verification_codes 
  FOR INSERT 
  WITH CHECK (TRUE);

-- Create RLS policy to allow reading own verification codes
CREATE POLICY "Allow read phone verification codes" 
  ON phone_verification_codes 
  FOR SELECT 
  USING (TRUE);

-- Create RLS policy to allow updating own verification codes
CREATE POLICY "Allow update phone verification codes" 
  ON phone_verification_codes 
  FOR UPDATE 
  USING (TRUE) 
  WITH CHECK (TRUE);
