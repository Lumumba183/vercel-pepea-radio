'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/components/Header'
import { AppUser } from '@/types'
import { ArrowLeft, Shield, UserPlus, Trash2 } from 'lucide-react'

const AREAS = ['articles', 'schedule', 'reports', 'users', 'brief', 'settings', 'all']

export default function UsersPage() {
  const { user, isLoaded } = useUser()
  const [users, setUsers] = useState<AppUser[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', full_name: '', role: 'editor' as 'admin' | 'editor' | 'user', allowed_areas: ['articles'] })

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { setLoading(false); return }

    // Check admin via server-side API (reads ADMIN_EMAIL env var)
    fetch('/api/check-admin')
      .then(r => r.json())
      .then(({ adminEmail }) => {
        const userEmail = user.primaryEmailAddress?.emailAddress || ''
        if (userEmail.toLowerCase() === (adminEmail || '').toLowerCase()) {
          setIsAdmin(true)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))

    fetch('/api/users')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setUsers(data) })
      .catch(() => {})
  }, [isLoaded, user])

  const createUser = async () => {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ email: '', full_name: '', role: 'editor', allowed_areas: ['articles'] })
    const res = await fetch('/api/users')
    setUsers(await res.json())
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
    const res = await fetch('/api/users')
    setUsers(await res.json())
  }

  const toggleArea = (area: string) => {
    setForm(prev => ({
      ...prev,
      allowed_areas: prev.allowed_areas.includes(area)
        ? prev.allowed_areas.filter(a => a !== area)
        : [...prev.allowed_areas, area],
    }))
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
          <p className="text-[var(--text-muted)] mb-6">Admins only.</p>
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
          <h1 className="text-3xl font-extrabold">User Management</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-[var(--text-muted)]">Create and manage staff accounts. Assign roles and control access areas.</p>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium cursor-pointer hover:bg-blue-700 transition-all flex items-center gap-2">
            <UserPlus size={16} /> Add User
          </button>
        </div>

        {showForm && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Create New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1.5 font-medium text-sm">Email</label>
                <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Full Name</label>
                <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Role</label>
                <select className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-sm">Allowed Areas</label>
              <div className="flex flex-wrap gap-2">
                {AREAS.map(area => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                      form.allowed_areas.includes(area)
                        ? 'bg-blue-600 text-white'
                        : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={createUser} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700 transition-all">Create User</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold cursor-pointer hover:bg-[var(--card-hover)] transition-all">Cancel</button>
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Allowed Areas</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id.slice(0, 8)}...</td>
                  <td><strong>{u.full_name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'bg-red-600/15 text-red-600' : u.role === 'editor' ? 'bg-blue-600/15 text-blue-600' : 'bg-[var(--text-muted)]/15 text-[var(--text-muted)]'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {(u.allowed_areas || []).map(a => (
                        <span key={a} className="px-2 py-0.5 rounded bg-[var(--bg)] text-xs text-[var(--text-muted)]">{a}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button onClick={() => deleteUser(u.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm cursor-pointer hover:bg-red-700 transition-all flex items-center gap-1">
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
