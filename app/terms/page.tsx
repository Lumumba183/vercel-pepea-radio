import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[800px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Terms of Service</h1>
        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>By accessing and using Pepea Radio&apos;s website and services, you agree to comply with these terms.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">Use of Content</h2>
          <p>All content on this website is owned by Pepea Radio or licensed to us. You may not reproduce, distribute, or create derivative works without our permission.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">User Submissions</h2>
          <p>By submitting content to us (e.g., news tips), you grant us a non-exclusive license to use, modify, and publish that content.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">Limitation of Liability</h2>
          <p>Pepea Radio is not liable for any damages arising from your use of our website or services.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
