'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/components/Header'
import { Article } from '@/types'
import { ArrowLeft, Newspaper, Plus, Trash2, RefreshCw } from 'lucide-react'

interface BriefItem {
  id: number
  article_id: number | null
  custom_title: string | null
  custom_excerpt: string | null
  position: number
  is_manual: boolean
}

export default function BriefPage() {
  const { user, isLoaded } = useUser()
  const [briefItems, setBriefItems] = useState<BriefItem[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ article_id: '' as string | number, custom_title: '', custom_excerpt: '', is_manual: false })

  const [autoFilling, setAutoFilling] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { setLoading(false); return }
    Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/brief').then(r => r.json()),
      fetch('/api/articles').then(r => r.json()),
    ]).then(([users, brief, arts]) => {
      const me = users.find((u: any) => u.email === user.primaryEmailAddress?.emailAddress)
      if (me?.role === 'admin') setIsAdmin(true)
      setBriefItems(brief || [])
      setArticles(arts || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [isLoaded, user])

  const addBrief = async () => {
    const body: any = {
      position: briefItems.length + 1,
      is_manual: form.is_manual,
    }
    if (form.is_manual) {
      body.custom_title = form.custom_title
      body.custom_excerpt = form.custom_excerpt
      body.article_id = null
    } else {
      body.article_id = Number(form.article_id)
      body.custom_title = null
      body.custom_excerpt = null
    }
    await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setShowForm(false)
    setForm({ article_id: '', custom_title: '', custom_excerpt: '', is_manual: false })
    const res = await fetch('/api/brief')
    setBriefItems(await res.json())
  }

  const deleteBrief = async (id: number) => {
    if (!confirm('Remove from Brief?')) return
    await fetch(`/api/brief?id=${id}`, { method: 'DELETE' })
    const res = await fetch('/api/brief')
    setBriefItems(await res.json())
  }

  const autoFill = async () => {
    if (autoFilling) return
    setAutoFilling(true)
    try {
      // Step 1: Delete all existing brief items
      for (const item of briefItems) {
        await fetch(`/api/brief?id=${item.id}`, { method: 'DELETE' })
      }
      
      // Step 2: Add latest 5 articles
      const latest = articles.slice(0, 5)
      for (let i = 0; i < latest.length; i++) {
        await fetch('/api/brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            article_id: latest[i].id, 
            position: i + 1, 
            is_manual: false, 
            custom_title: null, 
            custom_excerpt: null 
          }),
        })
      }
      
      // Step 3: Refresh
      const res = await fetch('/api/brief')
      setBriefItems(await res.json())
      alert(`Auto-filled with ${latest.length} latest articles!`)
    } catch (err: any) {
      alert('Auto-fill failed: ' + err.message)
    } finally {
      setAutoFilling(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <>
        <Header />
        <main className="mt-[70px] flex items-center justify-center min-h-[50vh]"><p className="text-[var(--text-muted)]">Loading...</p></main>
      </>
    )
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="mt-[70px] flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <Link href="/admin" className="px-6 py-3 rounded-xl bg-[var(--card)] text-[var(--text)] border border-[var(--border)] no-underline hover:bg-[var(--card-hover)] transition-all">Back to Admin</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-all"><ArrowLeft size={20} /></Link>
          <h1 className="text-3xl font-extrabold">Brief Slider</h1>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <p className="text-[var(--text-muted)]">Manage the scrolling Brief bar on the homepage. Auto-fills from the 5 latest articles.</p>
          <div className="flex gap-2">
            <button 
              onClick={autoFill} 
              disabled={autoFilling}
              className="px-4 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-sm font-medium cursor-pointer hover:bg-[var(--card-hover)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={14} className={autoFilling ? 'animate-spin' : ''} /> 
              {autoFilling ? 'Filling...' : 'Auto-Fill Latest 5'}
            </button>
            <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium cursor-pointer hover:bg-blue-700 transition-all flex items-center gap-2">
              <Plus size={16} /> Add Manual
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Add Brief Item</h3>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input type="checkbox" checked={form.is_manual} onChange={e => setForm({ ...form, is_manual: e.target.checked })} />
                <span className="text-sm">Manual entry (not linked to an article)</span>
              </label>
            </div>
            {form.is_manual ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1.5 font-medium text-sm">Custom Title</label>
                  <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]" value={form.custom_title} onChange={e => setForm({ ...form, custom_title: e.target.value })} />
                </div>
                <div>
                  <label className="block mb-1.5 font-medium text-sm">Custom Excerpt</label>
                  <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]" value={form.custom_excerpt} onChange={e => setForm({ ...form, custom_excerpt: e.target.value })} />
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block mb-1.5 font-medium text-sm">Select Article</label>
                <select className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]" value={form.article_id} onChange={e => setForm({ ...form, article_id: e.target.value })}>
                  <option value="">-- Choose an article --</option>
                  {articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={addBrief} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700 transition-all">Add to Brief</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold cursor-pointer hover:bg-[var(--card-hover)] transition-all">Cancel</button>
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Position</th><th>Type</th><th>Title</th><th>Linked Article</th><th>Actions</th></tr></thead>
            <tbody>
              {briefItems.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-[var(--text-muted)]">No brief items. Click Auto-Fill or Add Manual.</td></tr>}
              {briefItems.map(b => {
                const linked = articles.find(a => a.id === b.article_id)
                return (
                  <tr key={b.id}>
                    <td>{b.position}</td>
                    <td><span className={`badge ${b.is_manual ? 'bg-gold/15 text-gold' : 'bg-blue-600/15 text-blue-600'}`}>{b.is_manual ? 'Manual' : 'Auto'}</span></td>
                    <td><strong>{b.is_manual ? b.custom_title : linked?.title || 'Unknown'}</strong></td>
                    <td>{linked ? <Link href={`/article/${linked.id}`} className="text-blue-400 no-underline hover:underline">View Article</Link> : '—'}</td>
                    <td>
                      <button onClick={() => deleteBrief(b.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm cursor-pointer hover:bg-red-700 transition-all flex items-center gap-1">
                        <Trash2 size={12} /> Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
