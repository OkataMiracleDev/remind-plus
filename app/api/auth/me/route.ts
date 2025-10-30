import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabaseServer'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
  return NextResponse.json({ user })
}
export const runtime = 'nodejs'
