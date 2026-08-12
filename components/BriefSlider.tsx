'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Article } from '@/types'
import { Newspaper, AlertTriangle } from 'lucide-react'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Try to fetch brief items first
    fetch('/api/brief')
      .then(r => {
        if (!r.ok) throw new Error(`Brief API error: ${r.status}`)
        return r.json()
      })
      .then((data: BriefItem[]) => {
        // If brief_items table has entries, use them
        if (Array.isArray(data) && data.length > 0) {
          setItems(data)
          setLoading(false)
          return
        }
        // Otherwise, auto-populate from latest articles
        return fetch('/api/articles')
          .then(r => r.json())
          .then((articles: Article[]) => {
            if (!Array.isArray(articles) || articles.length === 0) {
              setItems([])
              setLoading(false)
              return
            }
            // Create brief items from top 5 latest articles
            const autoItems: BriefItem[] = articles.slice(0, 5).map((article, index) => ({
              id: -article.id, // negative to distinguish from DB items
              article_id: article.id,
              custom_title: null,
              custom_excerpt: null,
              position: index + 1,
              is_manual: false,
              articles: article,
            }))
            setItems(autoItems)
            setLoading(false)
          })
      })
      .catch(err => {
        console.error('BriefSlider error:', err)
        setError(err.message)
        // Fallback: try to load from articles API
        fetch('/api/articles')
          .then(r => r.json())
          .then((articles: Article[]) => {
            if (Array.isArray(articles) && articles.length > 0) {
              const autoItems: BriefItem[] = articles.slice(0, 5).map((article, index) => ({
                id: -article.id,
                article_id: article.id,
                custom_title: null,
                custom_excerpt: null,
                position: index + 1,
                is_manual: false,
                articles: article,
              }))
              setItems(autoItems)
            }
            setLoading(false)
          })
          .catch(() => setLoading(false))
      })
  }, [])

  // Compute shuffled items BEFORE any conditional returns (React hooks rule!)
  const shuffledItems = (() => {
    if (items.length <= 1) return items
    const result = [...items]
    for (let i = 1; i < result.length; i++) {
      const prevTitle = (result[i-1].is_manual ? result[i-1].custom_title : result[i-1].articles?.title) || ''
      const currTitle = (result[i].is_manual ? result[i].custom_title : result[i].articles?.title) || ''
      if (prevTitle.slice(0, 20).toLowerCase() === currTitle.slice(0, 20).toLowerCase() && i < result.length - 1) {
        [result[i], result[i+1]] = [result[i+1], result[i]]
      }
    }
    return result
  })()

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-b-2 border-yellow-600 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center px-6">
          <div className="shrink-0 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-black uppercase flex items-center gap-2 shadow-lg mr-4">
            <Newspaper size={16} />
            <span>Latest</span>
          </div>
          <div className="flex-1 text-black/60 text-sm font-medium">Loading latest news...</div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-b-2 border-yellow-600 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center px-6">
          <div className="shrink-0 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-black uppercase flex items-center gap-2 shadow-lg mr-4">
            <Newspaper size={16} />
            <span>Latest</span>
          </div>
          <div className="flex-1 text-black/60 text-sm font-medium flex items-center gap-2">
            <AlertTriangle size={14} />
            No news available. Add articles in the admin panel.
          </div>
        </div>
      </div>
    )
  }

  // For seamless infinite scroll, duplicate shuffled items ONCE (2x total)
  const marqueeItems = [...shuffledItems, ...shuffledItems]
  const duration = Math.max(25, shuffledItems.length * 5) // 5 seconds per item

  return (
    <div 
      className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-b-2 border-yellow-600 py-3 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />

      <div className="max-w-[1400px] mx-auto flex items-center">
        {/* Latest Badge */}
        <div className="shrink-0 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-black uppercase flex items-center gap-2 shadow-lg z-10 mr-4">
          <Newspaper size={16} />
          <span>Latest</span>
        </div>

        {/* Scrolling Marquee — Desktop & Mobile */}
        <div className="flex flex-1 overflow-hidden">
          <div 
            className="flex whitespace-nowrap"
            style={{
              animation: `marquee-scroll ${duration}s linear infinite`,
              animationPlayState: isHovered ? 'paused' : 'running',
            }}
          >
            {marqueeItems.map((item, index) => {
              const title = item.is_manual ? item.custom_title : item.articles?.title
              const excerpt = item.is_manual ? item.custom_excerpt : item.articles?.excerpt
              const linkId = item.is_manual ? null : item.article_id

              return (
                <span key={`${item.id}-${index}`} className="inline-flex items-center mx-4 md:mx-8">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-600 rounded-full mr-2 md:mr-3 shrink-0" />
                  {linkId ? (
                    <Link
                      href={`/article/${linkId}`}
                      className="text-black text-sm md:text-base font-semibold no-underline hover:text-red-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {title}
                      {excerpt && (
                        <span className="text-black/60 ml-2 font-normal hidden md:inline">
                          — {excerpt.slice(0, 40)}...
                        </span>
                      )}
                    </Link>
                  ) : (
                    <span className="text-black text-sm md:text-base font-semibold">
                      {title}
                      {excerpt && (
                        <span className="text-black/60 ml-2 font-normal hidden md:inline">
                          — {excerpt.slice(0, 40)}...
                        </span>
                      )}
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  )
}
