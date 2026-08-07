'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-light)] border-t border-[var(--border)] pt-12 pb-6 px-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 className="text-base font-bold mb-4 text-[var(--text)]">Pepea Radio</h4>
          <p className="text-[var(--text-muted)] text-[0.9375rem]">
            Sauti Ya Afrika — Kenya&apos;s premier radio station delivering news, music, and community stories since 2018.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] no-underline transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] no-underline transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600">
              <Twitter size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] no-underline transition-all hover:bg-pink-600 hover:text-white hover:border-pink-600">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] no-underline transition-all hover:bg-red-600 hover:text-white hover:border-red-600">
              <Youtube size={16} />
            </a>
            <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] no-underline transition-all hover:bg-green-600 hover:text-white hover:border-green-600">
              <MessageCircle size={16} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-base font-bold mb-4 text-[var(--text)]">Quick Links</h4>
          <Link href="/" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Home</Link>
          <Link href="/news" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">News & Articles</Link>
          <Link href="/listen" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Listen Live</Link>
          <Link href="/tv" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Pepea TV</Link>
          <Link href="/schedule" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Programme Schedule</Link>
        </div>
        <div>
          <h4 className="text-base font-bold mb-4 text-[var(--text)]">Engage</h4>
          <Link href="/advertise" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Advertise With Us</Link>
          <Link href="/report" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Report a Story</Link>
          <Link href="/about" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">About & Contact</Link>
          <Link href="/admin" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Staff Login</Link>
        </div>
        <div>
          <h4 className="text-base font-bold mb-4 text-[var(--text)]">Legal</h4>
          <Link href="/privacy" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Privacy Policy</Link>
          <Link href="/terms" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Terms of Service</Link>
          <Link href="/cookies" className="block text-[var(--text-muted)] no-underline py-1 text-[0.9375rem] transition-all hover:text-blue-600">Cookie Policy</Link>
          <p className="mt-4 text-[var(--text-muted)] text-sm">© 2026 Pepea Radio. All rights reserved.</p>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[var(--text-muted)] text-sm">Powered by NexaFlow Digital | +254 106 216 699 | info@pepea.radio</p>
        <div className="inline-flex items-center gap-1.5 bg-[rgba(220,38,38,0.15)] text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase border border-[rgba(220,38,38,0.3)] animate-[pulse-red_2s_infinite]">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block" />
          On Air 24/7
        </div>
      </div>
    </footer>
  )
}
