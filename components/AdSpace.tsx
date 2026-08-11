'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Megaphone, Calendar, X, Eye } from 'lucide-react'

interface Advertisement {
  id: number
  title: string
  image_url: string
  link_url: string | null
  position: string
  expires_at: string
  is_active: boolean
}

interface AdSpaceProps {
  position: 'sidebar' | 'bottom-left' | 'bottom-right'
  className?: string
}

export default function AdSpace({ position, className = '' }: AdSpaceProps) {
  const [ad, setAd] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/advertisements')
      .then(r => r.json())
      .then((ads: Advertisement[]) => {
        const match = ads.find(a => a.position === position && a.is_active)
        setAd(match || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [position])

  const positionLabels: Record<string, string> = {
    'sidebar': 'Sidebar Banner',
    'bottom-left': 'Bottom Banner Left',
    'bottom-right': 'Bottom Banner Right'
  }

  const positionSizes: Record<string, { width: string; height: string; aspect: string }> = {
    'sidebar': { width: 'w-full', height: 'h-[300px]', aspect: 'aspect-[3/4]' },
    'bottom-left': { width: 'w-full', height: 'h-[200px]', aspect: 'aspect-[21/9]' },
    'bottom-right': { width: 'w-full', height: 'h-[200px]', aspect: 'aspect-[21/9]' }
  }

  const size = positionSizes[position]

  if (loading) {
    return (
      <div className={`${size.width} ${size.height} bg-[var(--card)] border border-[var(--border)] rounded-xl animate-pulse ${className}`} />
    )
  }

  // Show active ad
  if (ad) {
    const isExpired = new Date(ad.expires_at) < new Date()
    if (isExpired) return <BookThisSpace position={position} size={size} className={className} />

    return (
      <div className={`${size.width} ${className}`}>
        <div className="relative group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          {ad.link_url ? (
            <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block">
              <AdImage ad={ad} size={size} />
            </a>
          ) : (
            <AdImage ad={ad} size={size} />
          )}
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Ad
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Show "Book This Space" placeholder
  return <BookThisSpace position={position} size={size} className={className} />
}

function AdImage({ ad, size }: { ad: Advertisement; size: any }) {
  return (
    <div className={`${size.width} ${size.height} overflow-hidden`}>
      <img
        src={ad.image_url}
        alt={ad.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  )
}

function BookThisSpace({ position, size, className }: { position: string; size: any; className?: string }) {
  const positionLabels: Record<string, string> = {
    'sidebar': 'Sidebar Banner',
    'bottom-left': 'Bottom Banner (Left)',
    'bottom-right': 'Bottom Banner (Right)'
  }

  const positionSpecs: Record<string, { size: string; pixels: string }> = {
    'sidebar': { size: '300 × 600 px', pixels: 'Portrait / Vertical' },
    'bottom-left': { size: '800 × 200 px', pixels: 'Landscape / Horizontal' },
    'bottom-right': { size: '800 × 200 px', pixels: 'Landscape / Horizontal' }
  }

  const spec = positionSpecs[position]

  return (
    <div className={`${size.width} ${className}`}>
      <Link 
        href={`/book-space?position=${position}`}
        className="block relative overflow-hidden rounded-xl border-2 border-dashed border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--bg-light)] hover:border-blue-600 hover:bg-[var(--card-hover)] transition-all group"
      >
        <div className={`${size.width} ${size.height} flex flex-col items-center justify-center p-4 text-center`}>
          <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-3 group-hover:bg-blue-600/30 transition-colors">
            <Megaphone size={24} className="text-blue-500" />
          </div>
          <h4 className="font-bold text-[var(--text)] text-sm mb-1">Book This Space</h4>
          <p className="text-[var(--text-muted)] text-xs mb-1">{positionLabels[position]}</p>
          <p className="text-blue-500 text-[10px] font-semibold mb-3">{spec.size} • {spec.pixels}</p>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold group-hover:bg-blue-500 transition-colors">
            <Eye size={12} />
            Advertise Here
          </span>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </div>
  )
}
