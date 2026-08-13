import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import AdSpace from '@/components/AdSpace'

export default function AdvertisePage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[1000px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Advertise With Us</h1>
          <p className="text-[var(--text-muted)]">Reach thousands of engaged listeners across Kenya and the diaspora</p>
        </div>

        {/* Advertisement Banner Spaces */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <AdSpace position="bottom-left" />
          <AdSpace position="bottom-right" />
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Contact Our Sales Team</h2>
          <p className="text-[var(--text-muted)] mb-4">For custom packages, event sponsorships, and media partnerships, reach out directly.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Email</p>
              <a href="mailto:info@pepearadioke.com" className="font-semibold no-underline hover:text-blue-600 transition-colors">info@pepearadioke.com</a>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Phone</p>
              <a href="tel:+254726846053" className="font-semibold no-underline hover:text-blue-600 transition-colors">+254 726 846 053</a>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">WhatsApp</p>
              <a href="https://wa.me/254726639789" target="_blank" rel="noopener noreferrer" className="font-semibold no-underline hover:text-green-600 transition-colors">+254 726 639 789</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}
