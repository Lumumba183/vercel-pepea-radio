'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Radio, ArrowRight } from 'lucide-react'

interface Advertisement {
  id: number
  title: string
  image_url: string
  link_url: string | null
  position: string
  expires_at: string
  is_active: boolean
}

export default function UpcomingEvent() {
  const [event, setEvent] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/advertisements')
      .then(r => r.json())
      .then((ads: Advertisement[]) => {
        const match = ads.find(a => a.position === 'upcoming-event' && a.is_active)
        setEvent(match || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="w-full h-[280px] bg-[var(--card)] border border-[var(--border)] rounded-xl animate-pulse" />
    )
  }

  // Show active upcoming event
  if (event) {
    const isExpired = new Date(event.expires_at) < new Date()
    if (!isExpired) {
      return (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-3">
            <Radio size={16} className="text-red-500" />
            <h3 className="text-sm font-black uppercase tracking-wide text-[var(--text-muted)]">Upcoming Event</h3>
          </div>
          <div className="relative group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
            {event.link_url ? (
              <a href={event.link_url} target="_blank" rel="noopener noreferrer" className="block">
                <EventImage event={event} />
              </a>
            ) : (
              <EventImage event={event} />
            )}
            <div className="absolute top-2 right-2">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                Live
              </span>
            </div>
          </div>
          <p className="text-[var(--text-muted)] text-xs mt-2 text-center">
            {event.title}
          </p>
        </div>
      )
    }
  }

  // Show placeholder when no active event
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Radio size={16} className="text-red-500" />
        <h3 className="text-sm font-black uppercase tracking-wide text-[var(--text-muted)]">Upcoming Event</h3>
      </div>
      <Link 
        href="/admin/ads"
        className="block relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-red-600 transition-all group"
      >
        <div className="w-full h-[280px] overflow-hidden">
          <img
            src="/upcoming-event-placeholder.jpg"
            alt="Upcoming Event — Advertise here"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors" />
      </Link>
      <p className="text-[var(--text-muted)] text-xs mt-2 text-center opacity-0">
        {' '}
      </p>
    </div>
  )
}

function EventImage({ event }: { event: Advertisement }) {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <div className="w-full h-[280px] bg-gradient-to-br from-red-600/20 to-orange-600/20 flex flex-col items-center justify-center p-4">
        <Calendar size={32} className="text-red-500 mb-2" />
        <p className="text-red-500 font-semibold text-sm text-center">{event.title}</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[280px] overflow-hidden">
      <img
        src={event.image_url}
        alt={event.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImgError(true)}
      />
    </div>
  )
}
