'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [streamUrl, setStreamUrl] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.stream_url && data.stream_url !== 'https://stream.zeno.fm/placeholder') {
          setStreamUrl(data.stream_url)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current || !streamUrl) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {
        alert('Stream unavailable. Configure in admin panel.')
      })
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[rgba(17,24,39,0.98)] backdrop-blur-[20px] border-t border-[var(--border)] z-[1001] px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center font-black text-white text-xl shrink-0">
          PR
        </div>
        <div className="min-w-0">
          <h4 className="text-[0.9375rem] font-semibold text-[var(--text)] truncate">Pepea Radio Live</h4>
          <p className="text-[0.8125rem] text-[var(--text-muted)] truncate">
            {isPlaying ? 'ON AIR NOW — Pepea Radio' : 'Click play to listen live'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-[var(--card)] border-none text-[var(--text)] flex items-center justify-center cursor-pointer transition-all hover:scale-105"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-none text-white flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-[0_4px_15px_rgba(220,38,38,0.3)]"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-red-600"
          />
        </div>
      </div>
      <audio ref={audioRef} preload="none" src={streamUrl || undefined} />
    </div>
  )
}
