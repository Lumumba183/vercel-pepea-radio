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

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-b-2 border-yellow-600 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center px-6">
          <div className="shrink-0 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-black uppercase flex items-center gap-2 shadow-lg mr-4">
            <Newspaper size={16} />
            <span>Brief</span>
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
            <span>Brief</span>
          </div>
          <div className="flex-1 text-black/60 text-sm font-medium flex items-center gap-2">
            <AlertTriangle size={14} />
            No news available. Add articles in the admin panel.
          </div>
        </div>
      </div>
    )
  }

  // Duplicate items for seamless marquee
  const marqueeItems = [...items, ...items, ...items]

  return (
    <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-b-2 border-yellow-600 py-3 overflow-hidden relative">
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

      <div className="max-w-[1400px] mx-auto flex items-center">
        {/* Brief Badge */}
        <div className="shrink-0 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-black uppercase flex items-center gap-2 shadow-lg z-10 mr-4 animate-pulse">
          <Newspaper size={16} />
          <span>Brief</span>
        </div>

        {/* Marquee Container */}
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {marqueeItems.map((item, index) => {
              const title = item.is_manual ? item.custom_title : item.articles?.title
              const excerpt = item.is_manual ? item.custom_excerpt : item.articles?.excerpt
              const linkId = item.is_manual ? null : item.article_id

              return (
                <span key={`${item.id}-${index}`} className="inline-flex items-center mx-8">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 shrink-0" />
                  {linkId ? (
                    <Link
                      href={`/article/${linkId}`}
                      className="text-black font-semibold no-underline hover:text-red-700 transition-colors"
                    >
                      {title}
                      {excerpt && (
                        <span className="text-black/60 ml-2 font-normal">
                          — {excerpt.slice(0, 60)}...
                        </span>
                      )}
                    </Link>
                  ) : (
                    <span className="text-black font-semibold">
                      {title}
                      {excerpt && (
                        <span className="text-black/60 ml-2 font-normal">
                          — {excerpt.slice(0, 60)}...
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
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
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
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  )
}
