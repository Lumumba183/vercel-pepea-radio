import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')

    // Live viewers = unique sessions in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: liveData, error: liveError } = await supabaseAdmin
      .from('page_views')
      .select('session_id')
      .gte('created_at', fiveMinutesAgo)

    if (liveError) throw liveError
    const liveSessions = new Set(liveData?.map(v => v.session_id) || [])
    const live_viewers = liveSessions.size

    // Today's views
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const { count: today_views, error: todayError } = await supabaseAdmin
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString())

    if (todayError) throw todayError

    // Total views (all time)
    const { count: total_views, error: totalError } = await supabaseAdmin
      .from('page_views')
      .select('*', { count: 'exact', head: true })

    if (totalError) throw totalError

    // Period views (if date range provided)
    let period_views = 0
    if (startDate && endDate) {
      const { count, error: periodError } = await supabaseAdmin
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      if (periodError) throw periodError
      period_views = count || 0
    }

    // Page breakdown (top 10 pages today)
    const { data: pageBreakdown, error: breakdownError } = await supabaseAdmin
      .from('page_views')
      .select('page')
      .gte('created_at', todayStart.toISOString())

    if (breakdownError) throw breakdownError

    const pageStats: Record<string, number> = {}
    pageBreakdown?.forEach(v => {
      pageStats[v.page] = (pageStats[v.page] || 0) + 1
    })
    const topPages = Object.entries(pageStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    return NextResponse.json({
      live_viewers,
      today_views: today_views || 0,
      total_views: total_views || 0,
      period_views,
      top_pages: topPages,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Analytics error' }, { status: 500 })
  }
}
