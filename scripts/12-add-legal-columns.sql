-- Add legal/policy columns to page_settings table
ALTER TABLE public.page_settings
ADD COLUMN IF NOT EXISTS privacy_policy_content TEXT,
ADD COLUMN IF NOT EXISTS terms_of_service_content TEXT;

-- Update the comment
COMMENT ON TABLE public.page_settings IS 'Stores page configuration including branding, hero section, features, footer content (email, phone, location), social media links, and legal pages (privacy policy, terms of service)';
