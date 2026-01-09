import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { videoId, userId } = body

  // Mock vote creation - replace with actual database insert
  console.log(`Vote received for video ${videoId} from user ${userId}`)

  return NextResponse.json({
    success: true,
    message: "Vote recorded",
  })
}
