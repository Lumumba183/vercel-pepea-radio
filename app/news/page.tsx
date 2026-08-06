'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import Link from 'next/link'
import { Article } from '@/types'

const categories = ['All', 'National News', 'County News', 'World News', 'Politics', 'Sports', 'Health', 'Celebrity', 'Swahili', 'Community', 'Opinion']

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
                <div className="w-full h-[180px] bg-gradient-to-br from-[var(--bg-light)] to-[var(--card)] flex items-center justify-center relative">
                  <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{article.category}</span>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                  </svg>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 text-[var(--text)] leading-snug">{article.title}</h3>
                  <div className="flex gap-4 text-[var(--text-muted)] text-[0.8125rem] mb-3">
                    <span>{article.author}</span>
                    <span>{new Date(article.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
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
