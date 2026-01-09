-- Create page_settings table
CREATE TABLE IF NOT EXISTS public.page_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Branding
  site_name VARCHAR(255) NOT NULL DEFAULT 'VotNG',
  brand_name VARCHAR(255),
  brand_tagline VARCHAR(255),
  site_image VARCHAR(500),
  primary_color VARCHAR(20),
  -- Hero Section
  hero_title VARCHAR(255),
  hero_subtitle VARCHAR(255),
  hero_description TEXT,
  hero_image VARCHAR(500),
  -- Features Section
  features_title VARCHAR(255),
  features_list JSONB DEFAULT '[]'::jsonb,
  -- Footer
  footer_brand_text TEXT,
  footer_about TEXT,
  footer_contact_email VARCHAR(255),
  footer_contact_phone VARCHAR(20),
  footer_text TEXT,
  -- General/SEO
  site_title VARCHAR(255),
  site_description TEXT,
  -- Admin
  admin_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on admin_id
CREATE INDEX IF NOT EXISTS idx_page_settings_admin_id ON public.page_settings(admin_id);

-- Enable RLS
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Public users can view page settings
CREATE POLICY "Anyone can view page settings"
  ON public.page_settings
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert page settings
CREATE POLICY "Admins can create page settings"
  ON public.page_settings
  FOR INSERT
  WITH CHECK (
    admin_id = auth.uid()
  );

-- Policy: Only admins can update page settings
CREATE POLICY "Admins can update page settings"
  ON public.page_settings
  FOR UPDATE
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

-- Policy: Only admins can delete page settings
CREATE POLICY "Admins can delete page settings"
  ON public.page_settings
  FOR DELETE
  USING (admin_id = auth.uid());

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_page_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS trigger_update_page_settings_updated_at ON public.page_settings;
CREATE TRIGGER trigger_update_page_settings_updated_at
  BEFORE UPDATE ON public.page_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_page_settings_updated_at();
