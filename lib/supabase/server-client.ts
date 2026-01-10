export function getSupabaseServerClient() {
  // Defer import to runtime to avoid build-time Supabase initialization
  const { createClient } = require("@supabase/supabase-js")
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase server environment variables")
  }

  return createClient(url, key)
}
