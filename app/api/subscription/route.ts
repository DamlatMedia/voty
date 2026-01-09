import { NextResponse } from "next/server"

export async function GET() {
  // Mock subscription data - replace with actual database query
  const subscription = {
    status: "active",
    expiresAt: "2024-12-31",
    plan: "premium",
  }

  return NextResponse.json(subscription)
}
