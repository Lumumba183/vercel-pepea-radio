import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function hashIp(ip: string): string {
  // Simple hash for privacy
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session_id, page, user_agent } = body

    // Get IP from headers (works behind proxies)
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
    const ip_hash = hashIp(ip)

    const { error } = await supabaseAdmin
      .from('page_views')
      .insert({ session_id, page, ip_hash, user_agent })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
