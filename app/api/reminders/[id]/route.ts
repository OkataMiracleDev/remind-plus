import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { createServerSupabaseClient } from "../../../../lib/supabaseServer"
import { z } from "zod"

const updateReminderSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().optional(), // ISO date
  time: z.string().optional(),
  recurring: z.boolean().optional(),
})

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const { user } = await supabase.auth.getUser().then((r) => ({ user: r.data.user }))
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const body = await req.json()
    const parsed = updateReminderSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

    const data: any = { ...parsed.data }
    if (data.date) data.date = new Date(data.date)

    const reminder = await prisma.reminder.update({
      where: { id: params.id },
      data,
    })
    if (reminder.createdByUserId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ reminder }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const { user } = await supabase.auth.getUser().then((r) => ({ user: r.data.user }))
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const existing = await prisma.reminder.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (existing.createdByUserId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    await prisma.reminder.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 })
  }
}

export const runtime = 'nodejs'
