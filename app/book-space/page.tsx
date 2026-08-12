'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Megaphone, Send, CheckCircle, User, Mail, Phone, Building, MessageSquare, MapPin } from 'lucide-react'

function BookSpaceForm() {
  const searchParams = useSearchParams()
  const selectedPosition = searchParams.get('position') || ''

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    ad_space: selectedPosition,
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const positions = [
    { 
      value: 'sidebar', 
      label: 'Sidebar Banner', 
      price: 'KES 10,000/week', 
      size: '300 × 600 pixels', 
      orientation: 'Portrait (vertical)',
      uploadSpecs: 'Width: 840 px • Height: 600 px • Aspect ratio: 4:3 (landscape/wide rectangle)'
    },
    { 
      value: 'bottom-left', 
      label: 'Bottom Banner (Left)', 
      price: 'KES 8,000/week', 
      size: '800 × 200 pixels', 
      orientation: 'Landscape (horizontal)',
      uploadSpecs: 'Width: 1000 px • Height: 400 px • Aspect ratio: 5:2 (wide banner)'
    },
    { 
      value: 'bottom-right', 
      label: 'Bottom Banner (Right)', 
      price: 'KES 8,000/week', 
      size: '800 × 200 pixels', 
      orientation: 'Landscape (horizontal)',
      uploadSpecs: 'Width: 1000 px • Height: 400 px • Aspect ratio: 5:2 (wide banner)'
    }
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/advertisements/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-[600px] mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-extrabold mb-4">Inquiry Sent!</h2>
        <p className="text-[var(--text-muted)] text-lg mb-8">
          Thank you for your interest in advertising with Pepea Radio. Our team will contact you within 24 hours to discuss your campaign.
        </p>
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] mb-8 text-left">
          <h3 className="font-bold mb-4">What happens next?</h3>
          <ol className="space-y-3 text-[var(--text-muted)]">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0 font-bold">1</span>
              Our sales team will call you to discuss your advertising goals
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0 font-bold">2</span>
              We'll send you a media kit with audience demographics and rates
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0 font-bold">3</span>
              Once confirmed, your ad goes live within 24 hours of payment
            </li>
          </ol>
        </div>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-blue-600 text-white no-underline hover:bg-blue-500 transition-all">
          Back to Home
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-[700px] mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
          <Megaphone size={32} className="text-blue-500" />
        </div>
        <h1 className="text-3xl font-extrabold mb-3">Advertise With Pepea Radio</h1>
        <p className="text-[var(--text-muted)]">
          Reach thousands of engaged listeners across Kenya and the diaspora. Fill out the form below and our team will get back to you within 24 hours.
        </p>
      </div>

      {/* Rate Card */}
      <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-600/30 mb-8">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-blue-500" />
          Available Ad Spaces
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {positions.map(pos => (
            <div key={pos.value} className={`bg-[var(--card)] rounded-lg p-4 border ${form.ad_space === pos.value ? 'border-blue-600' : 'border-[var(--border)]'}`}>
              <p className="font-semibold text-sm">{pos.label}</p>
              <p className="text-blue-500 font-bold">{pos.price}</p>
              <p className="text-[var(--text-muted)] text-xs mt-1">{pos.size} • {pos.orientation}</p>
              <div className="mt-2 p-2 bg-blue-600/10 border border-blue-600/20 rounded-md">
                <p className="text-blue-400 text-[10px] font-semibold">📐 UPLOAD SPECS</p>
                <p className="text-[var(--text-muted)] text-[10px] mt-0.5">{pos.uploadSpecs}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
          <p className="text-yellow-400 text-sm font-semibold">📐 Ad Image Requirements</p>
          <p className="text-[var(--text-muted)] text-xs mt-1">
            Please provide your ad in the exact pixel dimensions listed in the "UPLOAD SPECS" box above for your chosen position. 
            Accepted formats: JPG, PNG. Max file size: 2MB. If you need help designing your ad, mention it in your message.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-4 mb-6 text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name *</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email *</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none transition-colors"
                placeholder="john@company.com"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number *</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none transition-colors"
                placeholder="+254 700 000 000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Company (Optional)</label>
            <div className="relative">
              <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none transition-colors"
                placeholder="Your Company Ltd"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Ad Space *</label>
          <select
            required
            value={form.ad_space}
            onChange={e => setForm({ ...form, ad_space: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none transition-colors"
          >
            <option value="">Select an ad space...</option>
            {positions.map(pos => (
              <option key={pos.value} value={pos.value}>{pos.label} ({pos.size}) — {pos.price}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Message *</label>
          <div className="relative">
            <MessageSquare size={18} className="absolute left-3 top-3 text-[var(--text-muted)]" />
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] focus:border-blue-600 focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your advertising goals, target audience, and preferred campaign duration..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center gap-2 hover:from-blue-500 hover:to-blue-700 transition-all disabled:opacity-50"
        >
          {submitting ? 'Sending...' : <><Send size={20} /> Send Inquiry</>}
        </button>

        <p className="text-center text-[var(--text-muted)] text-sm">
          By submitting this form, you agree to be contacted by our sales team regarding advertising opportunities.
        </p>
      </form>
    </div>
  )
}

export default function BookSpacePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-[80px] pb-16 px-6">
        <Suspense fallback={
          <div className="max-w-[700px] mx-auto py-16 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }>
          <BookSpaceForm />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
