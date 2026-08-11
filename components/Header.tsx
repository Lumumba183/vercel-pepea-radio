'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Menu, X, Shield } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/news', label: 'News' },
  { href: '/listen', label: 'Listen Live' },
  { href: '/tv', label: 'Pepea TV' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/advertise', label: 'Advertise' },
  { href: '/report', label: 'Report' },
  { href: '/about', label: 'About' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-[rgba(10,14,26,0.95)] backdrop-blur-[12px] border-b border-[var(--border)] transition-all">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3 no-underline text-[var(--text)]">
          <img 
            src="/logo-pepea-radio.jpg" 
            alt="Pepea Radio" 
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              PEPEA RADIO
            </h1>
            <span className="text-[0.7rem] text-[var(--text-muted)] uppercase tracking-[0.1em]">— Sauti Ya Afrika —</span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[var(--text-muted)] no-underline px-4 py-2 rounded-lg text-sm font-medium transition-all hover:text-[var(--text)] hover:bg-[var(--card)] ${
                pathname === link.href ? 'text-[var(--text)] bg-[var(--card)]' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          <SignedIn>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-gold no-underline px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[var(--card)]"
            >
              <Shield size={14} /> Admin
            </Link>
            <div className="flex items-center ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-[var(--text-muted)] no-underline px-4 py-2 rounded-lg text-sm font-medium transition-all hover:text-[var(--text)] hover:bg-[var(--card)]"
            >
              Sign In
            </Link>
          </SignedOut>
        </nav>

        <button
          className="md:hidden bg-transparent border-none text-[var(--text)] text-2xl cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden fixed top-[70px] left-0 right-0 bg-[var(--bg-light)] border-b border-[var(--border)] p-4 flex flex-col gap-2 z-[999]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-[var(--text-muted)] no-underline p-3 rounded-lg font-medium transition-all hover:text-[var(--text)] hover:bg-[var(--card)]"
            >
              {link.label}
            </Link>
          ))}
          <SignedIn>
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-gold no-underline p-3 rounded-lg font-medium flex items-center gap-2">
              <Shield size={14} /> Admin Panel
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="text-[var(--text-muted)] no-underline p-3 rounded-lg font-medium">
              Sign In
            </Link>
          </SignedOut>
        </nav>
      )}
    </header>
  )
}
