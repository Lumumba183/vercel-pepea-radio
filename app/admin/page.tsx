'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import Header from '@/components/Header'
import { Article, Report, ScheduleItem, AnalyticsSummary } from '@/types'
import {
  LayoutDashboard, FileText, Calendar, Inbox, Settings, Users, Newspaper, BarChart3,
  Image as ImageIcon, Star, TrendingUp, Eye, Users as UsersIcon, Activity, Megaphone
} from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'reports', label: 'Reports', icon: Inbox },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'brief', label: 'Brief', icon: Newspaper },
  { id: 'ads', label: 'Ads', icon: Megaphone },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminPage() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [articles, setArticles] = useState<Article[]>([])
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refreshArticles = useCallback(async () => {
    try {
      const res = await fetch(`/api/articles?_=${Date.now()}`)
      if (!res.ok) {
        console.error('refreshArticles failed:', res.status, await res.text())
        return
      }
      const data = await res.json()
      if (!Array.isArray(data)) {
        console.error('refreshArticles: expected array, got:', typeof data, data)
        return
      }
      setArticles(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('refreshArticles error:', err)
    }
  }, [])

  const refreshSchedule = useCallback(async () => {
    try {
      const res = await fetch('/api/schedule')
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data)) setSchedule(data)
    } catch (err) { console.error('refreshSchedule error:', err) }
  }, [])

  const refreshReports = useCallback(async () => {
    try {
      const res = await fetch('/api/reports')
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data)) setReports(data)
    } catch (err) { console.error('refreshReports error:', err) }
  }, [])

  const refreshAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics')
      if (!res.ok) return
      const data = await res.json()
      setAnalytics(data)
    } catch (err) { console.error('refreshAnalytics error:', err) }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    if (!user) return

    fetch('/api/users')
      .then(r => r.json())
      .then((users) => {
        const me = users.find((u: any) => u.email === user.primaryEmailAddress?.emailAddress)
        if (me?.role === 'admin') setIsAdmin(true)
        else if (user.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL) setIsAdmin(true)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    refreshArticles()
    refreshSchedule()
    refreshReports()
    refreshAnalytics()
  }, [isLoaded, user, refreshArticles, refreshSchedule, refreshReports, refreshAnalytics])

  if (!isLoaded || loading) {
    return (
      <>
        <Header />
        <main className="mt-[70px] flex items-center justify-center min-h-[50vh]">
          <p className="text-[var(--text-muted)]">Loading admin panel...</p>
        </main>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="mt-[70px] flex flex-col items-center justify-center min-h-[50vh] px-6">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-[var(--text-muted)] mb-6">Please sign in to access the admin panel.</p>
          <Link href="/sign-in" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold no-underline hover:bg-blue-700 transition-all">Sign In</Link>
        </main>
      </>
    )
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="mt-[70px] flex flex-col items-center justify-center min-h-[50vh] px-6">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p className="text-[var(--text-muted)] mb-6">You do not have admin privileges.</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-[var(--card)] text-[var(--text)] border border-[var(--border)] no-underline hover:bg-[var(--card-hover)] transition-all">Go Home</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="mt-[70px] flex min-h-[calc(100vh-70px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-[var(--bg-light)] border-r border-[var(--border)] fixed h-[calc(100vh-70px)] overflow-y-auto hidden lg:block p-6">
          <h3 className="text-xs uppercase tracking-[0.1em] text-[var(--text-muted)] mb-4">Management</h3>
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--card)] text-[var(--text)] border-l-3 border-red-600'
                    : 'text-[var(--text-muted)] hover:bg-[var(--card)] hover:text-[var(--text)]'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Tabs */}
        <div className="lg:hidden fixed top-[70px] left-0 right-0 bg-[var(--bg-light)] border-b border-[var(--border)] z-50 overflow-x-auto">
          <div className="flex gap-1 p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === tab.id ? 'bg-[var(--card)] text-[var(--text)]' : 'text-[var(--text-muted)]'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-8 mt-12 lg:mt-0">
          {activeTab === 'dashboard' && <DashboardTab articles={articles} schedule={schedule} reports={reports} analytics={analytics} />}
          {activeTab === 'articles' && <ArticlesTab articles={articles} onRefresh={refreshArticles} lastUpdated={lastUpdated} />}
          {activeTab === 'schedule' && <ScheduleTab schedule={schedule} onRefresh={() => fetch('/api/schedule').then(r => r.json()).then(setSchedule)} />}
          {activeTab === 'reports' && <ReportsTab reports={reports} onRefresh={() => fetch('/api/reports').then(r => r.json()).then(setReports)} />}
          {activeTab === 'users' && <UsersRedirect />}
          {activeTab === 'brief' && <BriefRedirect />}
          {activeTab === 'ads' && <AdsRedirect />}
          {activeTab === 'settings' && <SettingsRedirect />}
        </main>
      </div>
    </>
  )
}

function DashboardTab({ articles, schedule, reports, analytics }: { articles: Article[]; schedule: ScheduleItem[]; reports: Report[]; analytics: AnalyticsSummary | null }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-6">Dashboard</h2>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-center text-white">
            <Eye size={24} className="mx-auto mb-2 opacity-80" />
            <p className="text-3xl font-black">{analytics.live_viewers}</p>
            <p className="text-sm opacity-80">Live Viewers</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-center text-white">
            <Activity size={24} className="mx-auto mb-2 opacity-80" />
            <p className="text-3xl font-black">{analytics.today_views}</p>
            <p className="text-sm opacity-80">Views Today</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-center text-white">
            <TrendingUp size={24} className="mx-auto mb-2 opacity-80" />
            <p className="text-3xl font-black">{analytics.total_views}</p>
            <p className="text-sm opacity-80">Total Views</p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
            <UsersIcon size={24} className="mx-auto mb-2 text-gold" />
            <p className="text-3xl font-black text-gold">{articles.filter(a => a.featured).length}</p>
            <p className="text-[var(--text-muted)] text-sm">Featured</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
          <p className="text-4xl font-black text-blue-600">{articles.length}</p>
          <p className="text-[var(--text-muted)] text-sm">Articles</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
          <p className="text-4xl font-black text-gold">{schedule.length}</p>
          <p className="text-[var(--text-muted)] text-sm">Shows</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
          <p className="text-4xl font-black text-red-600">{reports.length}</p>
          <p className="text-[var(--text-muted)] text-sm">Reports</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
          <p className="text-4xl font-black text-success">{articles.filter(a => a.is_main_news).length}</p>
          <p className="text-[var(--text-muted)] text-sm">Main News</p>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium no-underline hover:bg-blue-700 transition-all">Refresh Data</Link>
          <Link href="/news" className="px-4 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-sm font-medium no-underline hover:bg-[var(--card-hover)] transition-all">View Site</Link>
        </div>
      </div>
    </div>
  )
}

function ArticlesTab({ articles, onRefresh, lastUpdated }: { articles: Article[]; onRefresh: () => Promise<void>; lastUpdated: Date | null }) {
  const [editing, setEditing] = useState<Article | null>(null)
  const [form, setForm] = useState<Partial<Article>>({})
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{type: 'success'|'error', msg: string} | null>(null)

  const showFeedback = (type: 'success'|'error', msg: string) => {
    setFeedback({ type, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const openNew = () => {
    const today = new Date().toISOString().split('T')[0]
    const defaults = { id: 0, title: '', excerpt: '', category: 'National News', author: '', date: today, read_time: '5 min read', featured: false, is_main_news: false, content: '', image_url: null } as Article
    setEditing(defaults)
    setForm({ ...defaults })
    setPreviewUrl(null)
  }

  const openEdit = (a: Article) => {
    setEditing(a)
    setForm(a)
    setPreviewUrl(a.image_url || null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setForm(prev => ({ ...prev, image_url: data.url }))
        setPreviewUrl(data.url)
      }
    } catch (err) {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    setSaving(true)
    const url = '/api/articles'
    const method = editing && editing.id > 0 ? 'PUT' : 'POST'
    let body = editing && editing.id > 0 ? { ...form, id: editing.id } : { ...form }
    // Auto-set date if not provided
    if (!body.date) {
      body.date = new Date().toISOString().split('T')[0]
    }

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()

      if (!res.ok) {
        alert(`Error: ${data.error || 'Failed to save article'}`)
        setSaving(false)
        return
      }

      setEditing(null)
      setSaving(false)
      onRefresh()
    } catch (err: any) {
      alert(`Error: ${err.message || 'Failed to save article'}`)
      setSaving(false)
    }
  }

  const del = async (id: number) => {
    if (!confirm('Delete this article?')) return
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        alert(`Error: ${data.error || 'Failed to delete'}`)
        return
      }
      onRefresh()
    } catch (err: any) {
      alert(`Error: ${err.message || 'Failed to delete'}`)
    }
  }

  return (
    <div>
      {feedback && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${feedback.type === 'success' ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-red-600/20 text-red-400 border border-red-600/30'}`}>
          {feedback.msg}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold">Articles</h2>
          {lastUpdated && <p className="text-xs text-[var(--text-muted)] mt-1">Last refreshed: {lastUpdated.toLocaleTimeString()}</p>}
        </div>
        <button onClick={openNew} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium cursor-pointer hover:bg-blue-700 transition-all">+ New Article</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{editing.id > 0 ? 'Edit Article' : 'New Article'}</h3>
              <button onClick={() => setEditing(null)} className="text-[var(--text)] text-xl cursor-pointer">✕</button>
            </div>
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block mb-1.5 font-medium text-sm">Article Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm cursor-pointer hover:bg-[var(--card-hover)] transition-all">
                    <ImageIcon size={16} />
                    {uploading ? 'Uploading...' : 'Choose Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-[var(--border)]" />
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 font-medium text-sm">Title</label>
                <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Excerpt</label>
                <textarea className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" rows={2} value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-medium text-sm">Category</label>
                  <select className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" value={form.category || 'National News'} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {['National News','County News','World News','Politics','Sports','Health','Medical','Celebrity','Swahili','Community','Opinion'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 font-medium text-sm">Author</label>
                  <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" value={form.author || ''} onChange={e => setForm({ ...form, author: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Read Time</label>
                <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" value={form.read_time || ''} onChange={e => setForm({ ...form, read_time: e.target.value })} placeholder="e.g., 5 min read" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Content (HTML supported)</label>
                <textarea className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600 font-mono" rows={8} value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="<p>Your article content here...</p>" />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-auto" checked={form.featured || false} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <span className="text-sm">Feature on homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-auto" checked={form.is_main_news || false} onChange={e => setForm({ ...form, is_main_news: e.target.checked })} />
                  <span className="text-sm flex items-center gap-1"><Star size={14} className="text-yellow-500" /> Set as MAIN News (hero)</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? 'Saving...' : 'Save Article'}
                </button>
                <button onClick={() => setEditing(null)} disabled={saving} className="flex-1 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold cursor-pointer hover:bg-[var(--card-hover)] transition-all disabled:opacity-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Image</th><th>Title</th><th>Category</th><th>Status</th><th>Author</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {articles.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-[var(--text-muted)]">No articles yet. Click "+ New Article" to create one.</td></tr>
            )}
            {articles.map(a => (
              <tr key={a.id} className={a.is_main_news ? 'bg-yellow-500/5' : ''}>
                <td>{a.id}</td>
                <td>
                  {a.image_url ? (
                    <img src={a.image_url} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-[var(--bg)] rounded-lg flex items-center justify-center">
                      <ImageIcon size={16} className="text-[var(--text-muted)]" />
                    </div>
                  )}
                </td>
                <td>
                  <strong className={a.is_main_news ? 'text-yellow-500' : ''}>{a.title}</strong>
                  {a.is_main_news && <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">MAIN</span>}
                  {a.featured && <span className="ml-2 text-xs bg-blue-600/20 text-blue-600 px-2 py-0.5 rounded-full">FEATURED</span>}
                </td>
                <td><span className="badge bg-blue-600/15 text-blue-600">{a.category}</span></td>
                <td>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => toggleMain(a)}
                      disabled={togglingId === a.id}
                      className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${a.is_main_news ? 'bg-yellow-500 text-black font-bold' : 'bg-[var(--bg)] border border-[var(--border)] hover:bg-yellow-500/20'}`}
                      title={a.is_main_news ? 'Currently MAIN news — click to unset' : 'Set as MAIN news'}
                    >
                      {togglingId === a.id ? '⏳ Updating...' : a.is_main_news ? '★ MAIN' : '☆ Set Main'}
                    </button>
                    <button
                      onClick={() => toggleFeatured(a)}
                      disabled={togglingId === a.id}
                      className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${a.featured ? 'bg-blue-600 text-white font-bold' : 'bg-[var(--bg)] border border-[var(--border)] hover:bg-blue-600/20'}`}
                      title={a.featured ? 'Currently featured — click to unfeature' : 'Feature on homepage'}
                    >
                      {togglingId === a.id ? '⏳ Updating...' : a.featured ? '✓ Featured' : '☐ Feature'}
                    </button>
                  </div>
                </td>
                <td>{a.author}</td>
                <td className="text-sm text-[var(--text-muted)]">{a.date || a.created_at?.split('T')[0] || '—'}</td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(a)} className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm cursor-pointer hover:bg-[var(--card-hover)] transition-all">Edit</button>
                    <button onClick={() => del(a.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm cursor-pointer hover:bg-red-700 transition-all">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  async function toggleMain(a: Article) {
    console.log('[toggleMain] Starting for article', a.id, 'current:', a.is_main_news)
    setTogglingId(a.id)
    const newValue = !a.is_main_news
    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id, is_main_news: newValue })
      })
      console.log('[toggleMain] Response status:', res.status)
      const data = await res.json()
      console.log('[toggleMain] Response data:', data)
      if (!res.ok) {
        showFeedback('error', data.error || 'Failed to update')
        setTogglingId(null)
        return
      }
      showFeedback('success', newValue ? '✓ Set as MAIN news' : '✓ Removed from main news')
      await onRefresh()
      setTogglingId(null)
    } catch (err: any) {
      console.error('[toggleMain] Error:', err)
      showFeedback('error', err.message || 'Failed to update')
      setTogglingId(null)
    }
  }

  async function toggleFeatured(a: Article) {
    console.log('[toggleFeatured] Starting for article', a.id, 'current:', a.featured)
    setTogglingId(a.id)
    const newValue = !a.featured
    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id, featured: newValue })
      })
      console.log('[toggleFeatured] Response status:', res.status)
      const data = await res.json()
      console.log('[toggleFeatured] Response data:', data)
      if (!res.ok) {
        showFeedback('error', data.error || 'Failed to update')
        setTogglingId(null)
        return
      }
      showFeedback('success', newValue ? '✓ Featured on homepage' : '✓ Removed from featured')
      await onRefresh()
      setTogglingId(null)
    } catch (err: any) {
      console.error('[toggleFeatured] Error:', err)
      showFeedback('error', err.message || 'Failed to update')
      setTogglingId(null)
    }
  }
}

function ScheduleTab({ schedule, onRefresh }: { schedule: ScheduleItem[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<ScheduleItem | null>(null)
  const [form, setForm] = useState<Partial<ScheduleItem>>({})

  const openEdit = (s: ScheduleItem) => { setEditing(s); setForm(s) }
  const openNew = () => { setEditing({ id: 0, day: 'Monday', time: '', show: '', host: '', description: '' } as ScheduleItem); setForm({}) }

  const save = async () => {
    const method = editing && editing.id > 0 ? 'PUT' : 'POST'
    const body = editing && editing.id > 0 ? { ...form, id: editing.id } : form
    await fetch('/api/schedule', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setEditing(null)
    onRefresh()
  }

  const del = async (id: number) => {
    if (!confirm('Delete this show?')) return
    await fetch(`/api/schedule?id=${id}`, { method: 'DELETE' })
    onRefresh()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold">Programme Schedule</h2>
        <button onClick={openNew} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium cursor-pointer hover:bg-blue-700 transition-all">+ Add Show</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-[500px] p-6">
            <h3 className="text-lg font-bold mb-4">{editing.id > 0 ? 'Edit Show' : 'New Show'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 font-medium text-sm">Day</label>
                <select className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]" value={form.day || 'Monday'} onChange={e => setForm({ ...form, day: e.target.value })}>
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Time</label>
                <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]" value={form.time || ''} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="06:00 - 10:00" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Show Name</label>
                <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]" value={form.show || ''} onChange={e => setForm({ ...form, show: e.target.value })} />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Host</label>
                <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]" value={form.host || ''} onChange={e => setForm({ ...form, host: e.target.value })} />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Description</label>
                <textarea className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]" rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button onClick={save} className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700 transition-all">Save</button>
                <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold cursor-pointer hover:bg-[var(--card-hover)] transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Day</th><th>Time</th><th>Show</th><th>Host</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {schedule.map(s => (
              <tr key={s.id}>
                <td>{s.day}</td>
                <td>{s.time}</td>
                <td><strong>{s.show}</strong></td>
                <td>{s.host}</td>
                <td>{s.description}</td>
                <td>
                  <button onClick={() => openEdit(s)} className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm cursor-pointer hover:bg-[var(--card-hover)] transition-all">Edit</button>
                  <button onClick={() => del(s.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm cursor-pointer hover:bg-red-700 transition-all ml-2">Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReportsTab({ reports, onRefresh }: { reports: Report[]; onRefresh: () => void }) {
  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/reports', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    onRefresh()
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-6">Public Reports</h2>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>From</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {reports.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--text-muted)]">No reports submitted yet</td></tr>}
            {reports.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name || 'Anonymous'}</td>
                <td><strong>{r.subject}</strong></td>
                <td><span className={`badge ${r.status === 'New' ? 'bg-red-600/15 text-red-600' : r.status === 'Reviewed' ? 'bg-blue-600/15 text-blue-600' : 'bg-success/15 text-success'}`}>{r.status}</span></td>
                <td>{new Date(r.date).toLocaleDateString('en-KE')}</td>
                <td>
                  <button onClick={() => alert(`From: ${r.name || 'Anonymous'} (${r.email || 'No email'})\nPhone: ${r.phone || 'N/A'}\n\nSubject: ${r.subject}\n\nMessage:\n${r.message}`)} className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm cursor-pointer hover:bg-[var(--card-hover)] transition-all">View</button>
                  <button onClick={() => updateStatus(r.id, 'Resolved')} className="px-3 py-1.5 rounded-lg bg-success text-white text-sm cursor-pointer hover:bg-emerald-600 transition-all ml-2">Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UsersRedirect() {
  return (
    <div className="text-center py-12">
      <p className="text-[var(--text-muted)] mb-4">User management has its own dedicated page.</p>
      <Link href="/admin/users" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold no-underline hover:bg-blue-700 transition-all">Go to Users Page</Link>
    </div>
  )
}

function BriefRedirect() {
  return (
    <div className="text-center py-12">
      <p className="text-[var(--text-muted)] mb-4">Brief management has its own dedicated page.</p>
      <Link href="/admin/brief" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold no-underline hover:bg-blue-700 transition-all">Go to Brief Page</Link>
    </div>
  )
}

function AdsRedirect() {
  return (
    <div className="text-center py-12">
      <p className="text-[var(--text-muted)] mb-4">Advertisement management has its own dedicated page.</p>
      <Link href="/admin/ads" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold no-underline hover:bg-blue-700 transition-all">Go to Ads Page</Link>
    </div>
  )
}

function SettingsRedirect() {
  return (
    <div className="text-center py-12">
      <p className="text-[var(--text-muted)] mb-4">Settings management has its own dedicated page.</p>
      <Link href="/admin/settings" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold no-underline hover:bg-blue-700 transition-all">Go to Settings Page</Link>
    </div>
  )
}
