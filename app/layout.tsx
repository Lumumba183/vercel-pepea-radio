import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import AnalyticsTracker from '@/components/AnalyticsTracker'

export const metadata: Metadata = {
  title: 'Pepea Radio — Sauti Ya Afrika',
  description: "Pepea Radio - Kenya's premier radio station. Live streaming, news, sports, politics, and community stories.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <AnalyticsTracker />
        </body>
      </html>
    </ClerkProvider>
  )
}
