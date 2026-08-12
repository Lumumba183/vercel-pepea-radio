'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { Megaphone, Plus, Trash2, Edit2, X, Calendar, Eye, EyeOff, ArrowLeft } from 'lucide-react'

interface Advertisement {
  id: number
  title: string
  image_url: string
  link_url: string | null
  position: string
  expires_at: string
  is_active: boolean
  created_at: string
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [inquiries, setInquiries] = useState<any[]>([])

  const [form, setForm] = useState({
    title: '',
    image_url: '',
    link_url: '',
    position: 'sidebar',
    expires_at: '',
    is_active: true
  })

  useEffect(() => {
    fetchAds()
    fetchInquiries()
  }, [])

  async function fetchAds() {
    try {
      const res = await fetch('/api/advertisements')
      const data = await res.json()
      setAds(data || [])
    } catch (err) {
      console.error('Failed to fetch ads:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchInquiries() {
    try {
      const res = await fetch('/api/advertisements/inquiry')
      const data = await res.json()
      setInquiries(data || [])
    } catch (err) {
      console.error('Failed to fetch inquiries:', err)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const url = '/api/advertisements'
    const method = editingAd ? 'PUT' : 'POST'
    const body = editingAd ? { ...form, id: editingAd.id } : form

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const data = await res.json()
        alert('Error: ' + (data.error || 'Failed to save'))
        return
      }

      setShowForm(false)
      setEditingAd(null)
      setForm({ title: '', image_url: '', link_url: '', position: 'sidebar', expires_at: '', is_active: true })
      fetchAds()
    } catch (err: any) {
      alert('Failed to save: ' + err.message)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this advertisement?')) return

    try {
      const res = await fetch(`/api/advertisements?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      fetchAds()
    } catch (err) {
      alert('Failed to delete')
    }
  }

  function handleEdit(ad: Advertisement) {
    setEditingAd(ad)
    setForm({
      title: ad.title,
      image_url: ad.image_url,
      link_url: ad.link_url || '',
      position: ad.position,
      expires_at: ad.expires_at.slice(0, 16),
      is_active: ad.is_active
    })
    setShowForm(true)
  }

  const positions = [
    { value: 'sidebar', label: 'Sidebar Banner', size: '300 × 600 px' },
    { value: 'bottom-left', label: 'Bottom Banner Left', size: '800 × 200 px' },
    { value: 'bottom-right', label: 'Bottom Banner Right', size: '800 × 200 px' },
    { value: 'upcoming-event', label: 'Radio Upcoming Event', size: 'Sidebar event slot' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg)]">
        <div className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border)]">
          <a href="/admin" className="text-[var(--text-muted)] no-underline hover:text-[var(--text)]">
            <ArrowLeft size={20} />
          </a>
          <h2 className="text-2xl font-black">Ads Management</h2>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <Megaphone size={32} className="text-blue-500" />
            Advertisements
          </h1>
          <p className="text-[var(--text-muted)] mt-1">Manage ads on your website</p>
        </div>
        <button
          onClick={() => {
            setEditingAd(null)
            setForm({ title: '', image_url: '', link_url: '', position: 'sidebar', expires_at: '', is_active: true })
            setShowForm(true)
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all"
        >
          <Plus size={18} /> Add Advertisement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Ads" value={ads.length} icon={<Megaphone size={20} />} />
        <StatCard label="Active" value={ads.filter(a => a.is_active && new Date(a.expires_at) > new Date()).length} icon={<Eye size={20} />} color="green" />
        <StatCard label="Expired" value={ads.filter(a => new Date(a.expires_at) < new Date()).length} icon={<Calendar size={20} />} color="red" />
        <StatCard label="Inquiries" value={inquiries.length} icon={<Megaphone size={20} />} color="blue" />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{editingAd ? 'Edit Ad' : 'New Ad'}</h2>
            <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-[var(--bg-light)] transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-light)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none"
                placeholder="e.g. Safaricom 5G"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Image URL *</label>
              <input
                type="url"
                required
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-light)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none"
                placeholder="https://example.com/ad-image.jpg"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">Paste a direct link to an image (JPG, PNG, GIF)</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Link URL (Optional)</label>
              <input
                type="url"
                value={form.link_url}
                onChange={e => setForm({ ...form, link_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-light)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none"
                placeholder="https://client-website.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Position *</label>
              <select
                required
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-light)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none"
              >
                {positions.map(pos => (
                  <option key={pos.value} value={pos.value}>{pos.label} ({pos.size})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Expiry Date *</label>
              <input
                type="datetime-local"
                required
                value={form.expires_at}
                onChange={e => setForm({ ...form, expires_at: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-light)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--border)]"
                />
                <span className="font-semibold">Active</span>
              </label>
            </div>

            <div className="md:col-span-2 p-4 bg-red-600/10 border border-red-600/30 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.position === 'upcoming-event'}
                  onChange={e => setForm({ ...form, position: e.target.checked ? 'upcoming-event' : 'sidebar' })}
                  className="w-5 h-5 rounded border-[var(--border)]"
                />
                <div>
                  <span className="font-semibold text-red-400">Radio Upcoming Event</span>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Check this box if this is a radio station upcoming event (interview, show, etc.). 
                    It will appear in the &quot;Upcoming Event&quot; sidebar section instead of regular ad slots.
                  </p>
                </div>
              </label>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-8 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all"
              >
                {editingAd ? 'Update Ad' : 'Create Ad'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ads Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold">All Advertisements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-light)]">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Ad</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Position</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Expires</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Status</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {ads.map(ad => {
                const isExpired = new Date(ad.expires_at) < new Date()
                return (
                  <tr key={ad.id} className="hover:bg-[var(--bg-light)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={ad.image_url} alt={ad.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-sm">{ad.title}</p>
                          {ad.link_url && <p className="text-xs text-blue-500">{ad.link_url}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {positions.find(p => p.value === ad.position)?.label || ad.position}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={isExpired ? 'text-red-500' : 'text-green-500'}>
                        {new Date(ad.expires_at).toLocaleDateString('en-KE')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${ad.is_active && !isExpired ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}>
                        {ad.is_active && !isExpired ? <Eye size={12} /> : <EyeOff size={12} />}
                        {ad.is_active && !isExpired ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(ad)} className="p-2 rounded-lg hover:bg-[var(--bg-light)] text-blue-500">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(ad.id)} className="p-2 rounded-lg hover:bg-red-600/10 text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {ads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    No ads yet. Click "Add Advertisement" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold">Advertising Inquiries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-light)]">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Contact</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Space</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Message</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {inquiries.map((inq: any) => (
                <tr key={inq.id} className="hover:bg-[var(--bg-light)] transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold">{inq.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <p>{inq.email}</p>
                    <p className="text-[var(--text-muted)]">{inq.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full bg-blue-600/20 text-blue-500 text-xs font-semibold">
                      {inq.ad_space || 'Not specified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm max-w-[300px]">
                    <p className="line-clamp-2">{inq.message}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                    {new Date(inq.created_at).toLocaleDateString('en-KE')}
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    No inquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
      </main>
    </>
  )
}

function StatCard({ label, value, icon, color = 'blue' }: { label: string; value: number; icon: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-600/20 text-blue-500',
    green: 'bg-green-600/20 text-green-500',
    red: 'bg-red-600/20 text-red-500'
  }

  return (
    <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[var(--text-muted)] text-sm">{label}</span>
        <span className={`p-2 rounded-lg ${colors[color]}`}>{icon}</span>
      </div>
      <p className="text-3xl font-extrabold">{value}</p>
    </div>
  )
}
