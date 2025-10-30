import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { createServerSupabaseClient } from "../../../lib/supabaseServer"
import { z } from "zod"
import { generateTeamCode } from "../../../lib/teamCode"
import { joinTeamSchema } from "../../../lib/validators/joinTeamSchema"

const createTeamSchema = z.object({
  name: z.string().min(2),
  color: z.string().optional()
})

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { user } = await supabase.auth.getUser().then((r) => ({ user: r.data.user }))
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const teams = await prisma.team.findMany({ where: { adminId: user.id } })
    return NextResponse.json({ teams }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createServerSupabaseClient()
    const { user } = await supabase.auth.getUser().then((r) => ({ user: r.data.user }))
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (body?.action === "join") {
      const parsed = joinTeamSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })
      const team = await prisma.team.findUnique({ where: { code: parsed.data.code } })
      if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })
      await prisma.teamUser.upsert({
        where: { teamId_userId: { teamId: team.id, userId: user.id } },
        create: { teamId: team.id, userId: user.id },
        update: {}
      })
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const parsed = createTeamSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    const code = generateTeamCode()
    const team = await prisma.team.create({ data: { name: parsed.data.name, color: parsed.data.color, code, adminId: user.id } })
    return NextResponse.json({ team }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create or join team" }, { status: 500 })
  }
}