import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Create client at module level - Node.js caches this instance
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request) {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization")
    let token = authHeader?.replace("Bearer ", "")

    // If no header, try to get from cookies
    if (!token) {
      const cookieStore = await cookies()
      token = cookieStore.get("sb-auth-token")?.value || cookieStore.get("votyToken")?.value
    }

    if (!token) {
      console.error("No token found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Decode token to get user ID
    try {
      const parts = token.split(".")
      let userId: string | null = null

      if (parts.length === 3) {
        // JWT format
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString())
        userId = payload.sub || payload.user_id || payload.id || payload.userId
      } else if (parts.length === 1) {
        // Base64 encoded format
        const payload = JSON.parse(Buffer.from(token, "base64").toString())
        userId = payload.userId || payload.sub || payload.id
      }

      if (!userId) {
        console.error("Could not extract user ID from token")
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      const { fullName, email, profilePic, subscription_status } = await request.json()

      console.log("Updating user:", userId, { fullName, email, profilePic, subscription_status })

      // Update user data in Supabase
      const { data, error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          email: email,
          pic: profilePic,
          subscription_status: subscription_status,
        })
        .eq("id", userId)
        .select()

      if (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Failed to update profile", details: error.message }, { status: 500 })
      }

      if (!data || data.length === 0) {
        console.error("User not found for update:", userId)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      console.log("User updated successfully:", data[0])
      return NextResponse.json({ success: true, data: data[0] })
    } catch (tokenError) {
      console.error("Error decoding token:", tokenError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error in update-profile endpoint:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
