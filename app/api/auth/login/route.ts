import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[login] 📨 Raw request body:", JSON.stringify(body))

    let { email, password } = body

    // Trim whitespace
    email = email?.trim() || ""
    password = password?.trim() || ""

    console.log("[login] 📨 Trimmed email:", email)
    console.log("[login] 📨 Trimmed password:", password)

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      )
    }

    // Fetch user from Supabase by email - use limit(1) instead of .single()
    const { data: users, error } = await getSupabaseServerClient()
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1)

    if (error) {
      console.log("[login] ❌ Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Database error",
        },
        { status: 500 }
      )
    }

    if (!users || users.length === 0) {
      console.log("[login] ❌ User not found:", email)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      )
    }

    const user = users[0]
    console.log("[login] ✅ User found:", email)
    console.log("[login] 🔍 Stored password_hash:", user.password_hash)

    // Hash the provided password with SHA256
    const password_hash = crypto.createHash("sha256").update(password).digest("hex")

    console.log("[login] 🔍 Provided password:", `"${password}"`)
    console.log("[login] 🔍 Hashed provided password:", password_hash)
    console.log("[login] 🔍 Match?", password_hash === user.password_hash)

    // Compare hashed password with stored password_hash
    if (password_hash !== user.password_hash) {
      console.log("[login] ❌ Password MISMATCH")
      console.log("[login] ❌ Expected:", user.password_hash)
      console.log("[login] ❌ Got:", password_hash)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      )
    }

    console.log("[login] ✅ Password MATCH - User authenticated!")

    // Create token with user ID
    const token = Buffer.from(
      JSON.stringify({ userId: user.id, timestamp: Date.now() })
    ).toString("base64")

    // Return user data (without password_hash)
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        country_code: user.country_code,
        date_of_birth: user.date_of_birth,
        phone_verified: user.phone_verified,
        email_verified: user.email_verified,
        agreed_to_terms: user.agreed_to_terms,
        subscription_status: user.subscription_status,
        pic: user.pic,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    })

    // Set token cookie for middleware authentication
    response.cookies.set("sb-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[login] ❌ Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
      },
      { status: 500 }
    )
  }
}