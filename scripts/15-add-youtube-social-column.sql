-- Add YouTube social media column to page_settings table
ALTER TABLE public.page_settings
ADD COLUMN IF NOT EXISTS social_youtube VARCHAR(500);

-- Update the comment
COMMENT ON TABLE public.page_settings IS 'Stores page configuration including branding, hero section, features, footer content, and social media links (Facebook, Twitter, Instagram, YouTube)';
