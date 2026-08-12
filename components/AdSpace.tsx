'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Megaphone } from 'lucide-react'

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
    if (isExpired) return <PlaceholderAd position={position} size={size} className={className} />

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

  // Show placeholder ad image when no active ad
  return <PlaceholderAd position={position} size={size} className={className} />
}

function AdImage({ ad, size }: { ad: Advertisement; size: any }) {
  const [imgError, setImgError] = useState(false)
  
  if (imgError) {
    return (
      <div className={`${size.width} ${size.height} bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex flex-col items-center justify-center p-4`}>
        <Megaphone size={32} className="text-blue-500 mb-2" />
        <p className="text-blue-500 font-semibold text-sm text-center">{ad.title}</p>
        <p className="text-[var(--text-muted)] text-xs text-center mt-1">Click to visit</p>
      </div>
    )
  }

  return (
    <div className={`${size.width} ${size.height} overflow-hidden`}>
      <img
        src={ad.image_url}
        alt={ad.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImgError(true)}
      />
    </div>
  )
}

function PlaceholderAd({ position, size, className }: { position: string; size: any; className?: string }) {
  // Map positions to placeholder images
  const placeholderImages: Record<string, string> = {
    'sidebar': '/ad-placeholder-sidebar.jpg',       // 300×600 vertical
    'bottom-left': '/ad-placeholder-bottom.jpg',    // 800×200 horizontal
    'bottom-right': '/ad-placeholder-bottom.jpg'    // 800×200 horizontal
  }

  const positionSpecs: Record<string, { size: string; pixels: string; price: string }> = {
    'sidebar': { size: '300 × 600 px', pixels: 'Portrait / Vertical', price: 'KES 10,000/week' },
    'bottom-left': { size: '800 × 200 px', pixels: 'Landscape / Horizontal', price: 'KES 8,000/week' },
    'bottom-right': { size: '800 × 200 px', pixels: 'Landscape / Horizontal', price: 'KES 8,000/week' }
  }

  const imageSrc = placeholderImages[position]
  const spec = positionSpecs[position]

  return (
    <div className={`${size.width} ${className}`}>
      <Link 
        href={`/book-space?position=${position}`}
        className="block relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-blue-600 transition-all group"
        title={`Advertise here — ${spec.price}`}
      >
        <div className={`${size.width} ${size.height} overflow-hidden`}>
          <img
            src={imageSrc}
            alt={`Advertise here — ${spec.size} • ${spec.pixels}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
      </Link>
    </div>
  )
}
