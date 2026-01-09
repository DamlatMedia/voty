-- Add social media columns to page_settings table
ALTER TABLE public.page_settings
ADD COLUMN IF NOT EXISTS social_facebook VARCHAR(500),
ADD COLUMN IF NOT EXISTS social_twitter VARCHAR(500),
ADD COLUMN IF NOT EXISTS social_instagram VARCHAR(500);

-- Update the comment
COMMENT ON TABLE public.page_settings IS 'Stores page configuration including branding, hero section, features, footer content, and social media links';
