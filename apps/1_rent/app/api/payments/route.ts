import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { amount, card_number, expiry_date, cvv } = await request.json()

  // Mock payment processing - in production, integrate with Stripe
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const payment = {
    id: Date.now().toString(),
    amount,
    status: "completed",
    user_id: user.id,
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({ payment })
}
