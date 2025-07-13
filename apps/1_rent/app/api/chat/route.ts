import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Mock chat data - in production, this would fetch from database
  const chats = [
    {
      id: "1",
      participants: [user.id, "landlord-1"],
      last_message: "The deposit has been processed successfully.",
      updated_at: new Date().toISOString(),
    },
  ]

  return NextResponse.json({ chats })
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { message, chat_id } = await request.json()

  // Mock message creation - in production, this would save to database
  const newMessage = {
    id: Date.now().toString(),
    content: message,
    sender_id: user.id,
    chat_id,
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({ message: newMessage })
}
