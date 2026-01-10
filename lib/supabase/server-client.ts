// Lazy load Supabase client only when actually needed at runtime
let supabaseCreateClient: any = null

function getSuperbaseCreateFunction() {
  if (supabaseCreateClient) return supabaseCreateClient
  
  // Only attempt to load if we have environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    // Return a dummy function during build
    return () => {
      throw new Error("Supabase not initialized: missing environment variables")
    }
  }
  
  try {
    const { createClient } = require("@supabase/supabase-js")
    supabaseCreateClient = createClient
    return supabaseCreateClient
  } catch (err) {
    // If require fails during build, return dummy
    return () => {
      throw new Error("Supabase library not available")
    }
  }
}

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables")
  }

  const createClient = getSuperbaseCreateFunction()
  return createClient(url, key)
}

