// Create a singleton instance for service role operations
let serviceRoleClient: any = null

export function getServiceRoleClient() {
  // Defer import to runtime to avoid build-time initialization
  if (!serviceRoleClient) {
    const { createClient } = require("@supabase/supabase-js")
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    }

    serviceRoleClient = createClient(url, key)
  }
  return serviceRoleClient
}

// Create a singleton instance for anonymous operations
let anonClient: any = null

export function getAnonClient() {
  // Defer import to runtime to avoid build-time initialization
  if (!anonClient) {
    const { createClient } = require("@supabase/supabase-js")
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
    }

    anonClient = createClient(url, key)
  }
  return anonClient
}
