import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData, error } = await supabase.from("app_users").select("is_admin").eq("id", user.id).single()

    if (error) {
      return NextResponse.json({ role: "user", isAdmin: false }, { status: 200 })
    }

    return NextResponse.json(
      {
        role: userData?.is_admin ? "admin" : "user",
        isAdmin: userData?.is_admin || false,
        userId: user.id,
        email: user.email,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Role check error:", error)
    return NextResponse.json({ error: "Failed to check role" }, { status: 500 })
  }
}
