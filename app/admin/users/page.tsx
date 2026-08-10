'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/components/Header'
import { ArrowLeft, Shield, UserPlus, Trash2, RefreshCw, Edit3 } from 'lucide-react'

const AREAS = ['articles', 'schedule', 'reports', 'users', 'brief', 'settings', 'all']

interface UserData {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'editor' | 'user'
  allowed_areas: string[]
  created_at: string
  image_url?: string
  clerk_id?: string
}

export default function UsersPage() {
  const { user, isLoaded } = useUser()
  const [users, setUsers] = useState<UserData[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    role: 'editor' as 'admin' | 'editor' | 'user',
    allowed_areas: ['articles'] as string[],
    password: '',
  })

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { setLoading(false); return }
    loadUsers()
  }, [isLoaded, user])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data || [])
      const me = data.find((u: UserData) => u.email === user?.primaryEmailAddress?.emailAddress)
      if (me?.role === 'admin') setIsAdmin(true)
    } catch {
      // error
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        alert('Error: ' + (err.error || 'Failed to create user'))
        return
      }
      setShowForm(false)
      setForm({ email: '', full_name: '', role: 'editor', allowed_areas: ['articles'], password: '' })
      await loadUsers()
    } catch (err: any) {
      alert('Error: ' + err.message)
    }
  }

  const updateUserRole = async (userId: string, newRole: string, newAreas: string[]) => {
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole, allowed_areas: newAreas }),
      })
      await loadUsers()
    } catch (err: any) {
      alert('Error: ' + err.message)
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user? This will remove their Clerk account and cannot be undone.')) return
    try {
      await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
      await loadUsers()
    } catch (err: any) {
      alert('Error: ' + err.message)
    }
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
          <p className="text-[var(--text-muted)]">Create and manage staff accounts. Assign roles and control access areas. Users are synced from Clerk.</p>
          <div className="flex gap-2">
            <button onClick={loadUsers} className="px-4 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-sm font-medium cursor-pointer hover:bg-[var(--card-hover)] transition-all flex items-center gap-2">
              <RefreshCw size={14} /> Sync
            </button>
            <button onClick={() => { setShowForm(true); setEditingUser(null); setForm({ email: '', full_name: '', role: 'editor', allowed_areas: ['articles'], password: '' }) }} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium cursor-pointer hover:bg-blue-700 transition-all flex items-center gap-2">
              <UserPlus size={16} /> Add User
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Create New User (Clerk + Supabase)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1.5 font-medium text-sm">Email *</label>
                <input className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" />
              </div>
              <div>
                <label className="block mb-1.5 font-medium text-sm">Full Name *</label>
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
              <label className="block mb-1.5 font-medium text-sm">Password (optional — leave blank for invitation)</label>
              <input type="password" className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to send invitation email" />
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
              <tr><th>User</th><th>Email</th><th>Role</th><th>Allowed Areas</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {u.image_url ? (
                        <img src={u.image_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {(u.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <strong>{u.full_name || 'Unknown'}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={e => updateUserRole(u.id, e.target.value, u.allowed_areas)}
                      className="px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-sm cursor-pointer"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="user">User</option>
                    </select>
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
