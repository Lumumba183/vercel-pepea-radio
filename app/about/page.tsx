import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import { Radio, MapPin, Phone, Mail } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[900px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">About Pepea Radio</h1>
        <p className="text-[var(--text-muted)] mb-8">Sauti Ya Afrika — Kenya&apos;s Voice</p>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-white font-black text-2xl">PR</div>
            <div>
              <h2 className="text-2xl font-bold">Our Story</h2>
              <p className="text-[var(--text-muted)]">Broadcasting since 2018</p>
            </div>
          </div>
          <p className="text-[var(--text-muted)] leading-relaxed mb-4">
            Pepea Radio was founded with a simple mission: to give voice to the voiceless and tell the stories that matter to Kenyans. 
            From our humble beginnings as a community station, we have grown into one of Kenya&apos;s most trusted sources of news, 
            music, and cultural programming.
          </p>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Our name — <strong className="text-[var(--text)]">Pepea</strong> — means &quot;to spread&quot; or &quot;to soar&quot; in Swahili. 
            That is exactly what we do: spread information, spread joy, and help our community soar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <Radio className="text-red-600 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">24/7 Broadcasting</h3>
            <p className="text-[var(--text-muted)] text-sm">Round-the-clock programming covering news, sports, politics, health, and entertainment.</p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <MapPin className="text-blue-600 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">Community First</h3>
            <p className="text-[var(--text-muted)] text-sm">Deeply rooted in local communities across Kenya. We tell your stories.</p>
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="text-success" size={20} />
              <div>
                <p className="text-sm text-[var(--text-muted)]">Studio Line</p>
                <p className="font-semibold">+254 106 216 699</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-[var(--text-muted)]">Email</p>
                <p className="font-semibold">info@pepea.radio</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}
