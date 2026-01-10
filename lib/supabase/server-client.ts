// DO NOT import any Supabase packages at module level
// This prevents Turbopack from evaluating them during the static build phase

let cachedClient: any = null

export function getSupabaseServerClient() {
  // Guard: Check env vars are available
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    const errorMsg = "Supabase environment variables not set (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)"
    // During build: silently fail to allow static generation
    // During runtime: throw to alert developers
    if (typeof global !== 'undefined' && (global as any).__NEXT_BUILD__) {
      return {
        from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error(errorMsg) }) }) }) }),
        auth: { getUser: () => Promise.resolve({ data: { user: null }, error: new Error(errorMsg) }) },
      } as any
    }
    throw new Error(errorMsg)
  }

  // Return cached client if available
  if (cachedClient) {
    return cachedClient
  }

  // Require Supabase module only at runtime (inside this function)
  // Using require string concatenation to avoid static analysis
  let supabaseModule: any
  try {
    // eslint-disable-next-line global-require
    supabaseModule = require("@supabase/supabase-js")
  } catch (err) {
    throw new Error(`Failed to load Supabase module: ${err instanceof Error ? err.message : String(err)}`)
  }

  const client = supabaseModule.createClient(url, key)
  cachedClient = client
  return client
}

