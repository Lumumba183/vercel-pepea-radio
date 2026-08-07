import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy — Pepea Radio',
  description: 'Pepea Radio cookie policy. Learn how we use cookies and similar technologies on our website.',
  alternates: {
    canonical: 'https://pepea-radio.vercel.app/cookies',
  },
}

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[800px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Cookie Policy</h1>
        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>Pepea Radio uses cookies to enhance your browsing experience and analyze site traffic.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device that help websites remember your preferences and understand how you use the site.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">How We Use Cookies</h2>
          <p>We use cookies for authentication, analytics, and to remember your preferences. We do not use cookies to track you across other websites.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">Managing Cookies</h2>
          <p>You can control cookies through your browser settings. Disabling cookies may affect your experience on our website.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
