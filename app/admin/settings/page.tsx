'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/components/Header'
import { ArrowLeft, Radio, Youtube, Save, Twitch } from 'lucide-react'

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [streamUrl, setStreamUrl] = useState('')
  const [youtubeId, setYoutubeId] = useState('')
  const [twitchChannel, setTwitchChannel] = useState('')
  const [liveSource, setLiveSource] = useState<'youtube' | 'twitch'>('youtube')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { setLoading(false); return }
    Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/settings').then(r => r.json()),
    ]).then(([users, settings]) => {
      const me = users.find((u: any) => u.email === user.primaryEmailAddress?.emailAddress)
      if (me?.role === 'admin') setIsAdmin(true)
      setStreamUrl(settings?.stream_url || '')
      setYoutubeId(settings?.youtube_channel_id || '')
      setTwitchChannel(settings?.twitch_channel || '')
      setLiveSource(settings?.live_source || 'youtube')
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [isLoaded, user])

  const save = async () => {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stream_url: streamUrl,
        youtube_channel_id: youtubeId,
        twitch_channel: twitchChannel,
        live_source: liveSource,
      }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!isLoaded || loading) {
    return (
      <>
        <Header />
        <main className="mt-[70px] flex items-center justify-center min-h-[50vh]"><p className="text-[var(--text-muted)]">Loading...</p></main>
      </>
    )
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="mt-[70px] flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <Link href="/admin" className="px-6 py-3 rounded-xl bg-[var(--card)] text-[var(--text)] border border-[var(--border)] no-underline hover:bg-[var(--card-hover)] transition-all">Back to Admin</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[800px] mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-all"><ArrowLeft size={20} /></Link>
          <h1 className="text-3xl font-extrabold">Site Settings</h1>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 space-y-6">
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <Radio size={16} className="text-red-600" /> Stream URL
            </label>
            <p className="text-sm text-[var(--text-muted)] mb-2">The radio stream URL (e.g., Zeno.fm link). This powers the live player across the site.</p>
            <input
              type="url"
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
              value={streamUrl}
              onChange={e => setStreamUrl(e.target.value)}
              placeholder="https://stream.zeno.fm/xxxx"
            />
          </div>

          {/* Live Source Toggle */}
          <div>
            <label className="block mb-2 font-medium">Live Video Source</label>
            <p className="text-sm text-[var(--text-muted)] mb-3">Choose which platform to display on the TV page.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setLiveSource('youtube')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all cursor-pointer ${
                  liveSource === 'youtube'
                    ? 'bg-red-600/15 border-red-600 text-red-600'
                    : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Youtube size={18} /> YouTube Live
              </button>
              <button
                onClick={() => setLiveSource('twitch')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all cursor-pointer ${
                  liveSource === 'twitch'
                    ? 'bg-purple-600/15 border-purple-600 text-purple-600'
                    : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Twitch size={18} /> Twitch Live
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <Youtube size={16} className="text-red-600" /> YouTube Channel ID
            </label>
            <p className="text-sm text-[var(--text-muted)] mb-2">Your YouTube channel ID for embedding live streams and videos.</p>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
              value={youtubeId}
              onChange={e => setYoutubeId(e.target.value)}
              placeholder="UCxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <Twitch size={16} className="text-purple-600" /> Twitch Channel
            </label>
            <p className="text-sm text-[var(--text-muted)] mb-2">Your Twitch channel name (e.g., yourchannel)</p>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
              value={twitchChannel}
              onChange={e => setTwitchChannel(e.target.value)}
              placeholder="yourchannel"
            />
          </div>

          <button
            onClick={save}
            className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-br from-blue-600 to-blue-800 text-white cursor-pointer hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save Settings
          </button>

          {saved && (
            <div className="text-center text-success font-medium bg-success/10 py-2 rounded-lg">
              Settings saved successfully!
            </div>
          )}
        </div>
      </main>
    </>
  )
}
