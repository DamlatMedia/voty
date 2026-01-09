import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const user = {
    id: "demo-user-1",
    name: "Demo User",
    email: "demo@voty.com",
    role: "user",
    subscription: {
      status: "active",
      expiresAt: "2025-12-31",
    },
  }

  return NextResponse.json(user)
}
