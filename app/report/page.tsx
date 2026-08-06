'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import { Send } from 'lucide-react'

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSubmitted(true)
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[700px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Report a Story</h1>
        <p className="text-[var(--text-muted)] mb-8">Have a tip, photo, video, or breaking news? Send it to our newsroom. You can remain anonymous.</p>

        {submitted ? (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto mb-4">
              <Send size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-[var(--text-muted)]">Your report has been submitted to our newsroom. Our team will review it shortly.</p>
            <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700 transition-all">Submit Another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 space-y-5">
            <div>
              <label className="block mb-2 font-medium text-[0.9375rem]">Your Name (optional)</label>
              <input type="text" className="w-full px-4 py-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Anonymous" />
            </div>
            <div>
              <label className="block mb-2 font-medium text-[0.9375rem]">Email (optional)</label>
              <input type="email" className="w-full px-4 py-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
            </div>
            <div>
              <label className="block mb-2 font-medium text-[0.9375rem]">Phone (optional)</label>
              <input type="tel" className="w-full px-4 py-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+254 7XX XXX XXX" />
            </div>
            <div>
              <label className="block mb-2 font-medium text-[0.9375rem]">Subject *</label>
              <input type="text" required className="w-full px-4 py-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" />
            </div>
            <div>
              <label className="block mb-2 font-medium text-[0.9375rem]">Your Story *</label>
              <textarea required rows={6} className="w-full px-4 py-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)] resize-y" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us everything you know..." />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-br from-red-600 to-red-800 text-white cursor-pointer hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_rgba(220,38,38,0.3)]">
              Submit Report
            </button>
          </form>
        )}
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}
