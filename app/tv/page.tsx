import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import { supabase } from '@/lib/supabase'
import { headers } from 'next/headers'
import { Play, Youtube, Twitch } from 'lucide-react'

async function getSettings() {
  const { data } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()
  return data || { youtube_channel_id: '', twitch_channel: '', live_source: 'youtube' }
}

export default async function TvPage() {
  const settings = await getSettings()
  const headersList = await headers()
  const host = headersList.get('host') || 'vercel-pepea-radio.vercel.app'

  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[1400px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Pepea TV</h1>
        <p className="text-[var(--text-muted)] mb-8">Watch our live broadcasts and event coverage</p>

        {/* Live Stream Embed */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-8">
          {settings.live_source === 'youtube' && settings.youtube_channel_id ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/live_stream?channel=${settings.youtube_channel_id}&autoplay=0`}
                title="YouTube Live"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : settings.live_source === 'twitch' && settings.twitch_channel ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <iframe
                className="w-full h-full"
                src={`https://player.twitch.tv/?channel=${settings.twitch_channel}&parent=${host}`}}
                title="Twitch Live"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Play size={48} className="text-red-600 mx-auto mb-2" />
                <p className="text-[var(--text-muted)]">Live stream embed area</p>
                <p className="text-[var(--text-muted)] text-sm">Configure stream settings in admin panel</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {settings.live_source === 'youtube' ? (
                  <Youtube size={18} className="text-red-600" />
                ) : (
                  <Twitch size={18} className="text-purple-600" />
                )}
                <h3 className="font-bold text-lg">
                  {settings.live_source === 'youtube' ? 'YouTube Live' : 'Twitch Live'}
                </h3>
              </div>
              <p className="text-[var(--text-muted)] text-sm">
                {settings.live_source === 'youtube'
                  ? settings.youtube_channel_id
                    ? `Channel: ${settings.youtube_channel_id}`
                    : 'No YouTube channel configured'
                  : settings.twitch_channel
                    ? `Channel: ${settings.twitch_channel}`
                    : 'No Twitch channel configured'}
              </p>
            </div>
            {settings.youtube_channel_id && (
              <a
                href={`https://youtube.com/channel/${settings.youtube_channel_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white no-underline font-medium hover:bg-red-700 transition-all"
              >
                <Youtube size={16} /> Subscribe
              </a>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Upcoming & Past Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Sunday Gospel Live', desc: 'Join us every Sunday at 8 AM for live gospel music and worship from our studio.', live: true },
            { title: 'Friday Jam Sessions', desc: 'The biggest party on radio, now with live video. Every Friday from 6 PM.', live: false },
            { title: 'Community Events', desc: 'Roadshows, church services, sports coverage and more from across Kenya.', live: false },
          ].map((item, i) => (
            <div key={i} className="bg-[var(--card)] rounded-xl overflow-hidden border border-[var(--border)] transition-all hover:border-red-600">
              <div className="w-full aspect-video bg-gradient-to-br from-black to-[var(--bg-light)] flex items-center justify-center relative">
                {item.live && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">LIVE</span>
                )}
                <div className="w-16 h-16 rounded-full bg-[rgba(220,38,38,0.9)] flex items-center justify-center text-white text-2xl cursor-pointer transition-all hover:scale-110 hover:bg-red-600">
                  <Play size={28} fill="white" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-[var(--text-muted)] text-[0.9375rem]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}
