'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [streamUrl, setStreamUrl] = useState('')
  const [streamError, setStreamError] = useState('')
  const [loadingStream, setLoadingStream] = useState(false)
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
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setStreamError('')
    } else {
      if (!streamUrl) {
        setStreamError('Stream not configured. Please set up in admin panel.')
        return
      }
      
      setLoadingStream(true)
      setStreamError('')
      
      // Ensure audio element has the latest src
      audioRef.current.src = streamUrl
      
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            setLoadingStream(false)
          })
          .catch((err) => {
            setLoadingStream(false)
            setStreamError('Stream unavailable. Please try again later.')
            console.error('Audio play error:', err)
          })
      }
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
        <img 
          src="/logo-pepea-radio.jpg" 
          alt="Pepea Radio" 
          className="w-14 h-14 rounded-lg object-cover shrink-0"
        />
        <div className="min-w-0">
          <h4 className="text-[0.9375rem] font-semibold text-[var(--text)] truncate">Pepea Radio Live</h4>
          <p className="text-[0.8125rem] text-[var(--text-muted)] truncate">
            {isPlaying ? 'ON AIR NOW — Pepea Radio' : loadingStream ? 'Connecting to stream...' : streamError ? streamError : 'Click play to listen live'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-[var(--card)] border-none text-[var(--text)] flex items-center justify-center cursor-pointer transition-all hover:scale-105"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          onClick={togglePlay}
          disabled={loadingStream}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-none text-white flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-[0_4px_15px_rgba(220,38,38,0.3)] disabled:opacity-50"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {loadingStream ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} />
          )}
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-red-600"
            title={`Volume: ${volume}%`}
          />
        </div>
      </div>
      <audio 
        ref={audioRef} 
        preload="none" 
        onError={() => {
          setLoadingStream(false)
          setIsPlaying(false)
          setStreamError('Stream connection failed. Please try again.')
        }}
      />
    </div>
  )
}
