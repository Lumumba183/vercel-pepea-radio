export interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  read_time: string
  featured: boolean
  is_main_news: boolean
  content: string
  image_url: string | null
  created_at?: string
}

export interface ScheduleItem {
  id: number
  day: string
  time: string
  show: string
  host: string
  description: string
  created_at?: string
}

export interface Report {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'New' | 'Reviewed' | 'Resolved'
  date: string
  created_at?: string
}

export interface SiteSettings {
  id: number
  stream_url: string
  youtube_channel_id: string
  twitch_channel: string
  live_source: 'youtube' | 'twitch'
  updated_at?: string
}

export interface BriefItem {
  id: number
  article_id: number | null
  custom_title: string | null
  custom_excerpt: string | null
  position: number
  is_manual: boolean
  created_at?: string
}

export interface AppUser {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'editor' | 'user'
  allowed_areas: string[]
  created_at?: string
}

export interface AnalyticsSummary {
  live_viewers: number
  today_views: number
  total_views: number
  period_views: number
}
