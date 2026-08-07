'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Article } from '@/types'
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react'

interface BriefItem {
  id: number
  article_id: number | null
  custom_title: string | null
  custom_excerpt: string | null
  position: number
  is_manual: boolean
  articles?: Article
}

export default function BriefSlider() {
  const [items, setItems] = useState<BriefItem[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch('/api/brief')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data)
        else setItems([])
      })
      .catch(() => setItems([]))
  }, [])

  useEffect(() => {
    if (items.length <= 1) return
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [items.length])

  if (items.length === 0) return null

  const item = items[current]
  const title = item.is_manual ? item.custom_title : item.articles?.title
  const excerpt = item.is_manual ? item.custom_excerpt : item.articles?.excerpt
  const linkId = item.is_manual ? null : item.article_id

  return (
    <div className="bg-gradient-to-r from-blue-900/30 to-red-900/30 border-b border-[var(--border)] py-3 px-6">
      <div className="max-w-[1400px] mx-auto flex items-center gap-4">
        <span className="shrink-0 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
          <Newspaper size={12} /> Brief
        </span>
        <div className="flex-1 min-w-0">
          {linkId ? (
            <Link href={`/article/${linkId}`} className="text-[var(--text)] no-underline hover:text-blue-400 transition-all truncate block">
              <strong>{title}</strong>
              {excerpt && <span className="text-[var(--text-muted)] ml-2 hidden sm:inline">— {excerpt.slice(0, 80)}...</span>}
            </Link>
          ) : (
            <span className="text-[var(--text)] truncate block">
              <strong>{title}</strong>
              {excerpt && <span className="text-[var(--text-muted)] ml-2 hidden sm:inline">— {excerpt.slice(0, 80)}...</span>}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setCurrent(prev => (prev - 1 + items.length) % items.length)} className="w-7 h-7 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] cursor-pointer hover:text-white transition-all">
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-[var(--text-muted)] px-1">{current + 1}/{items.length}</span>
          <button onClick={() => setCurrent(prev => (prev + 1) % items.length)} className="w-7 h-7 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] cursor-pointer hover:text-white transition-all">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
