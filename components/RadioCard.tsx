'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'

export default function RadioCard() {
  return (
    <div className="rounded-xl p-6 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2440 50%, #0a1628 100%)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
      {/* Live Indicator + Title */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
        </span>
        <h3 className="text-lg font-bold text-white tracking-wide">Pepea Radio</h3>
      </div>
      
      {/* Subtitle */}
      <p className="text-amber-400 text-sm mb-5 font-medium tracking-wide">Live — Sauti Ya Afrika</p>
      
      {/* Audio Waveform Animation */}
      <div className="flex items-center justify-center gap-[3px] h-12 mb-5">
        {[40, 70, 50, 90, 60, 100, 45, 80, 55, 95, 65, 75].map((h, i) => (
          <div
            key={i}
            className="w-[4px] rounded-full"
            style={{
              background: 'linear-gradient(to top, #3b82f6, #06b6d4)',
              height: `${h}%`,
              animation: `wave 0.8s ease-in-out ${i * 0.08}s infinite alternate`,
            }}
          />
        ))}
      </div>
      
      {/* Listen Live Button */}
      <Link
        href="/listen"
        className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-white font-semibold text-sm no-underline transition-all hover:brightness-110 hover:scale-105"
        style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}
      >
        <Play size={16} fill="white" /> Listen Live
      </Link>
      
      <style jsx>{`
        @keyframes wave {
          0% { transform: scaleY(0.25); opacity: 0.6; }
          100% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
