import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import { supabase } from '@/lib/supabase'
import { Play } from 'lucide-react'

export const metadata: Metadata = {
  title: "Listen Live — Pepea Radio | Sauti Ya Afrika",
  description: "Listen to Pepea Radio live online. Kenya's fastest-growing online radio station streaming 24/7. Music, news, sports, and community stories.",
  keywords: ["Pepea Radio live", "listen live Kenya", "online radio streaming", "Kenya radio live"],
  alternates: {
    canonical: "https://pepea-radio.vercel.app/listen",
  },
}

export default async function ListenPage() {
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single()
  const streamUrl = settings?.stream_url || 'https://stream.zeno.fm/placeholder'

  return (
    <>
      <Header />
      <main className="mt-[70px] min-h-[calc(100vh-70px)] flex flex-col items-center justify-center text-center px-6 py-12 bg-[radial-gradient(circle_at_center,var(--bg-light)_0%,var(--bg)_70%)]">
        <div className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center mb-8 relative animate-[pulse-glow_3s_ease-in-out_infinite]">
          <span className="text-6xl font-black text-white">PR</span>
        </div>
        <h2 className="text-4xl font-extrabold mb-2">Listen Live</h2>
        <p className="text-[var(--text-muted)] text-lg mb-8">Pepea Radio — Sauti Ya Afrika, streaming 24/7</p>

        <audio controls className="w-full max-w-md mb-8 accent-red-600" src={streamUrl}>
          Your browser does not support the audio element.
        </audio>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 max-w-md w-full">
          <h3 className="font-bold mb-3">Now Playing</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-white font-black">PR</div>
            <div className="text-left">
              <p className="font-semibold">Pepea Radio Live Stream</p>
              <p className="text-[var(--text-muted)] text-sm">Kenya&apos;s Voice — 24/7 Broadcasting</p>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1 bg-[rgba(16,185,129,0.15)] text-success px-2 py-1 rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 bg-success rounded-full inline-block animate-pulse" /> LIVE
              </span>
            </div>
          </div>
        </div>

        <p className="text-[var(--text-muted)] text-sm mt-6">If the player doesn&apos;t work, the stream URL may need to be configured in the admin panel.</p>
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}
