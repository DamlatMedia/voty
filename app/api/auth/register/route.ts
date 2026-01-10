import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      full_name,
      phone_number,
      country_code,
      date_of_birth,
      phone_verified,
      agree_to_terms,
    } = body

    console.log("[register] 📨 Received:", { email, full_name, phone_number })

    // Validate required fields
    if (
      !email ||
      !password ||
      !full_name ||
      !phone_number ||
      !country_code ||
      !date_of_birth
    ) {
      console.log("[register] ❌ Missing required fields")
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // ✅ Hash password with SHA256
    const password_hash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex")

    console.log("[register] 🔐 Password:", password)
    console.log("[register] 🔐 Password hash:", password_hash)

    // Insert user
    const { data, error } = await getSupabaseServerClient()
      .from("users")
      .insert([
        {
          email,
          full_name,
          phone_number,
          country_code,
          date_of_birth,
          password_hash, // ✅ Store hashed password
          phone_verified: !!phone_verified,
          email_verified: false,
          agreed_to_terms: !!agree_to_terms,
          subscription_status: "free",
        },
      ])
      .select("*")
      .limit(1)

    if (error) {
      console.log("[register] ❌ Database error:", error)
      // Handle unique email constraint
      const msg = (error as any).message || String(error)
      if (msg.toLowerCase().includes("duplicate") || msg.includes("unique")) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    if (!data || data.length === 0) {
      console.log("[register] ❌ No data returned")
      return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }

    const user = data[0]
    console.log("[register] ✅ User created:", user.id)

    // Remove sensitive fields before returning
    const safeUser = { ...user }
    delete (safeUser as any).password_hash

    return NextResponse.json({ success: true, user: safeUser }, { status: 201 })
  } catch (err) {
    console.error("[register] ❌ Unexpected error:", err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}