'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Article } from '@/types'
import { Newspaper } from 'lucide-react'

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

  useEffect(() => {
    fetch('/api/brief')
      .then(r => r.json())
      .then(data => setItems(data || []))
  }, [])

  if (items.length === 0) return null

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
