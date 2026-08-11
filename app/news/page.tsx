'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import Link from 'next/link'
import { Article } from '@/types'
import { Image as ImageIcon } from 'lucide-react'

const categories = ['All', 'National News', 'County News', 'World News', 'Politics', 'Sports', 'Health', 'Medical', 'Celebrity', 'Swahili', 'Community', 'Opinion']

function formatDate(dateStr: string | undefined | null, createdAt?: string | undefined | null): string {
  const d = dateStr || createdAt
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(data => {
        setArticles(data)
        setLoading(false)
      })
  }, [])

  const filtered = activeCategory === 'All' ? articles : articles.filter(a => a.category === activeCategory)

  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[1400px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">News & Articles</h1>
        <p className="text-[var(--text-muted)] mb-8">Breaking stories from across Kenya and the world</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:bg-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[var(--text-muted)] text-center py-12">Loading articles...</p>
        ) : filtered.length === 0 ? (
          <p className="text-[var(--text-muted)] text-center py-12">No articles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(article => (
              <Link key={article.id} href={`/article/${article.id}`} className="bg-[var(--card)] rounded-xl overflow-hidden border border-[var(--border)] transition-all hover:-translate-y-1 hover:border-blue-600 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] no-underline block">
                <div className="w-full h-[180px] relative overflow-hidden">
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--bg-light)] to-[var(--card)] flex items-center justify-center">
                      <ImageIcon size={32} className="text-[var(--text-muted)]" />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{article.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 text-[var(--text)] leading-snug">{article.title}</h3>
                  <div className="flex gap-4 text-[var(--text-muted)] text-[0.8125rem] mb-3">
                    <span>{article.author}</span>
                    <span>{formatDate(article.date, article.created_at)}</span>
                    <span>{article.read_time}</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-[0.9375rem] leading-relaxed">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}
