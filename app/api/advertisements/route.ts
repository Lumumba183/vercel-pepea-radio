import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const now = new Date().toISOString()
  const { data: ads, error } = await supabase
    .from('advertisements')
    .select('*')
    .gte('expires_at', now)
    .order('created_at', { ascending: false })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(ads || [])
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!body.image_url?.trim()) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }
    if (!body.position) {
      return NextResponse.json({ error: 'Position is required' }, { status: 400 })
    }
    if (!body.expires_at) {
      return NextResponse.json({ error: 'Expiry date is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('advertisements')
      .insert(body)
      .select()
      .single()
    
    if (error) {
      console.error('POST ad error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error('POST ad unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create ad' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...update } = body
    
    if (id === undefined || id === null || id === '') {
      return NextResponse.json({ error: 'Ad ID is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('advertisements')
      .update(update)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('PUT ad error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('PUT ad unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update ad' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (id === null || id === undefined || id === '') {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    
    const { error } = await supabaseAdmin.from('advertisements').delete().eq('id', id)
    if (error) {
      console.error('DELETE ad error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE ad unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Failed to delete ad' }, { status: 500 })
  }
}
