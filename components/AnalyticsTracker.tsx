'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId(): string {
  let sessionId = localStorage.getItem('pepea_session_id')
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('pepea_session_id', sessionId)
  }
  return sessionId
}

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Small delay to not block page load
    const timer = setTimeout(() => {
      try {
        const sessionId = getSessionId()
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            page: pathname,
            user_agent: navigator.userAgent,
          }),
        }).catch(() => {
          // Silently fail — analytics should never break the site
        })
      } catch {
        // Silently fail
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
