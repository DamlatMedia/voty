import { createClient } from "@supabase/supabase-js"

// Create a singleton instance for service role operations
let serviceRoleClient: ReturnType<typeof createClient> | null = null

export function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }

  if (!serviceRoleClient) {
    serviceRoleClient = createClient(url, key)
  }
  return serviceRoleClient
}

// Create a singleton instance for anonymous operations
let anonClient: ReturnType<typeof createClient> | null = null

export function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  if (!anonClient) {
    anonClient = createClient(url, key)
  }
  return anonClient
}
