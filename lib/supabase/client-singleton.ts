import { createClient } from "@supabase/supabase-js"

// Create a singleton instance for service role operations
let serviceRoleClient: ReturnType<typeof createClient> | null = null

export function getServiceRoleClient() {
  if (!serviceRoleClient) {
    serviceRoleClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return serviceRoleClient
}

// Create a singleton instance for anonymous operations
let anonClient: ReturnType<typeof createClient> | null = null

export function getAnonClient() {
  if (!anonClient) {
    anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return anonClient
}
