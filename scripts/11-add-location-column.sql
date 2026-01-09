-- Add location column to page_settings table
ALTER TABLE public.page_settings
ADD COLUMN IF NOT EXISTS footer_contact_location VARCHAR(255);

-- Update the comment
COMMENT ON TABLE public.page_settings IS 'Stores page configuration including branding, hero section, features, footer content (email, phone, location), and social media links';
