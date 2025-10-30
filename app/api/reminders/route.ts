import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { createServerSupabaseClient } from "../../../lib/supabaseServer"
import { createReminderSchema } from "../../../lib/validators/createReminderSchema"
import { Resend } from "resend"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { user } = await supabase.auth.getUser().then((r) => ({ user: r.data.user }))
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const reminders = await prisma.reminder.findMany({ where: { createdByUserId: user.id }, orderBy: { date: "asc" } })
    return NextResponse.json({ reminders }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { user } = await supabase.auth.getUser().then((r) => ({ user: r.data.user }))
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const json = await req.json()
    const parsed = createReminderSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    const reminder = await prisma.reminder.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        date: new Date(parsed.data.date),
        time: parsed.data.time,
        recurring: parsed.data.recurring ?? false,
        teamId: parsed.data.teamId,
        createdByUserId: user.id
      }
    })
    // Fire email notification if Resend is configured
    try {
      const apiKey = process.env.RESEND_API_KEY
      if (apiKey && user.email) {
        const resend = new Resend(apiKey)
        await resend.emails.send({
          from: "Remind+ <notifications@remind.plus>",
          to: user.email,
          subject: `Reminder created: ${reminder.title}`,
          html: `<p>Your reminder "${reminder.title}" is scheduled on ${new Date(reminder.date).toLocaleDateString()} at ${reminder.time}.</p>`
        })
      }
    } catch {}
    return NextResponse.json({ reminder }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 })
  }
}
