import { getSupabaseServerClient } from "@/lib/supabase/server-client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      console.error("No token found in Authorization header")
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    console.log("Token received, attempting to decode...")

    // Decode token to get user ID
    const parts = token.split(".")
    let userId: string | null = null

    try {
      if (parts.length === 1) {
        // Base64 encoded format (from login endpoint)
        const decoded = Buffer.from(token, "base64").toString("utf-8")
        console.log("Decoded token:", decoded)
        const payload = JSON.parse(decoded)
        userId = payload.userId
      } else if (parts.length === 3) {
        // JWT format
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString())
        userId = payload.sub || payload.user_id || payload.id || payload.userId
      }
    } catch (e) {
      console.error("Token decode error:", e)
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 })
    }

    if (!userId) {
      console.error("Could not extract userId from token")
      return NextResponse.json({ error: "Invalid token - no userId found" }, { status: 401 })
    }

    console.log("Extracted userId:", userId)

    // Fetch user data from Supabase
    const { data, error } = await getSupabaseServerClient()
      .from("users")
      .select("id, email, full_name, phone_number, country_code, date_of_birth, phone_verified, email_verified, agreed_to_terms, subscription_status, created_at, updated_at")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Supabase query error:", error.message, error.code)
      return NextResponse.json({ error: "Failed to fetch user", details: error.message, code: error.code }, { status: 500 })
    }

    if (!data) {
      console.error("User not found for userId:", userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("User data fetched successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/auth/user:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
