import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Advertise With Us — Pepea Radio | Sauti Ya Afrika',
  description: 'Advertise with Pepea Radio and reach thousands of engaged listeners across Kenya and the diaspora. Starter, Professional, and Enterprise packages available.',
  keywords: ['radio advertising Kenya', 'Pepea Radio ads', 'advertise Kenya radio', 'digital marketing Kenya'],
  alternates: {
    canonical: 'https://pepea-radio.vercel.app/advertise',
  },
}

export default function AdvertisePage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[1000px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Advertise With Us</h1>
          <p className="text-[var(--text-muted)]">Reach thousands of engaged listeners across Kenya and the diaspora</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Starter', price: 'KES 5,000', period: '/week', features: ['Homepage banner (728×90)', 'News page sidebar ad', 'Social media mention ×2', 'Basic analytics report'] },
            { title: 'Professional', price: 'KES 15,000', period: '/week', featured: true, features: ['All Starter features', 'Player area premium slot', 'Dedicated advert page feature', 'On-air mention ×3', 'WhatsApp blast to subscribers'] },
            { title: 'Enterprise', price: 'KES 35,000', period: '/week', features: ['All Professional features', 'Exclusive homepage takeover', 'Live event sponsorship', 'Pepea TV video ad placement', 'Dedicated campaign manager'] },
          ].map((pkg) => (
            <div key={pkg.title} className={`bg-[var(--card)] rounded-xl p-8 border text-center transition-all hover:border-blue-600 hover:-translate-y-1 relative overflow-hidden ${pkg.featured ? 'border-gold' : 'border-[var(--border)]'}`}>
              {pkg.featured && <div className="absolute top-0 right-0 bg-gold text-black text-[0.625rem] font-extrabold px-3 py-1 rounded-bl-lg">MOST POPULAR</div>}
              <h3 className="text-xl font-bold">{pkg.title}</h3>
              <div className="text-4xl font-black text-[var(--text)] my-4">{pkg.price}<span className="text-base text-[var(--text-muted)] font-normal">{pkg.period}</span></div>
              <ul className="list-none text-left my-6 space-y-2">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[var(--text-muted)] py-1"><span className="text-success font-bold"><Check size={14} /></span> {f}</li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold cursor-pointer transition-all ${pkg.featured ? 'bg-gradient-to-br from-red-600 to-red-800 text-white' : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--card-hover)]'}`}>
                {pkg.title === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Contact Our Sales Team</h2>
          <p className="text-[var(--text-muted)] mb-4">For custom packages, event sponsorships, and media partnerships, reach out directly.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Email</p>
              <p className="font-semibold">ads@pepea.radio</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Phone</p>
              <p className="font-semibold">+254 106 216 699</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}
