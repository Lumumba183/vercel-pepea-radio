import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!body.excerpt?.trim()) {
      return NextResponse.json({ error: 'Excerpt is required' }, { status: 400 })
    }
    if (!body.category?.trim()) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }
    if (!body.author?.trim()) {
      return NextResponse.json({ error: 'Author is required' }, { status: 400 })
    }

    // Auto-set date if not provided
    if (!body.date) {
      body.date = new Date().toISOString().split('T')[0]
    }

    // If setting as main news, unset any existing main news first
    if (body.is_main_news === true) {
      await supabaseAdmin
        .from('articles')
        .update({ is_main_news: false })
        .eq('is_main_news', true)
    }

    // Strip id if present (SERIAL auto-generates it)
    const { id, ...insertData } = body

    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('POST article error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error('POST article unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create article' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...update } = body

    if (id === undefined || id === null || id === '') {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    // If setting as main news, unset any existing main news
    if (update.is_main_news === true) {
      await supabaseAdmin
        .from('articles')
        .update({ is_main_news: false })
        .eq('is_main_news', true)
    }

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('PUT article error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('PUT article unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (id === null || id === undefined || id === '') return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabaseAdmin.from('articles').delete().eq('id', id)
    if (error) {
      console.error('DELETE article error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE article unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Failed to delete article' }, { status: 500 })
  }
}
