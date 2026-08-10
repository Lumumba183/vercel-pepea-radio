import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({
        stream_url: 'https://stream.zeno.fm/placeholder',
        youtube_channel_id: '',
        twitch_channel: '',
        live_source: 'youtube',
      })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { data: existing } = await supabaseAdmin.from('settings').select('id').eq('id', 1).single()

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .update(body)
      .eq('id', 1)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } else {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .insert({ id: 1, ...body })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }
}
