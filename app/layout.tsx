import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://pepea-radio.vercel.app"),
  title: {
    default: "Pepea Radio — Sauti Ya Afrika | Kenya's Premier Online Radio Station",
    template: "%s — Pepea Radio",
  },
  description: "Pepea Radio is Kenya's fastest-growing online radio station. Live streaming, breaking news, sports, politics, music, and community stories. Listen anywhere, anytime.",
  keywords: ["Pepea Radio", "Kenya radio", "online radio Kenya", "live streaming Kenya", "African radio", "Bungoma radio", "Swahili radio", "Kenya news", "East Africa radio"],
  authors: [{ name: "Pepea Radio" }],
  creator: "TransAfrica Media Ltd",
  publisher: "Pepea Radio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://pepea-radio.vercel.app",
    siteName: "Pepea Radio",
    title: "Pepea Radio — Sauti Ya Afrika",
    description: "Kenya's fastest-growing online radio station. Live streaming, news, sports, and community stories.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pepea Radio — Sauti Ya Afrika",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pepea Radio — Sauti Ya Afrika",
    description: "Kenya's fastest-growing online radio station. Live streaming, news, sports, and community stories.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://pepea-radio.vercel.app",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <meta name="theme-color" content="#0a0e1a" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "RadioStation",
                name: "Pepea Radio",
                alternateName: "Sauti Ya Afrika",
                url: "https://pepea-radio.vercel.app",
                logo: "https://pepea-radio.vercel.app/logo.png",
                description: "Kenya's fastest-growing online radio station delivering news, music, and community stories.",
                areaServed: {
                  "@type": "Country",
                  name: "Kenya",
                },
                founder: {
                  "@type": "Person",
                  name: "Peter Mukabi",
                  jobTitle: "Director & Founder",
                },
                parentOrganization: {
                  "@type": "Organization",
                  name: "TransAfrica Media Ltd",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+254-106-216-699",
                  contactType: "customer service",
                  email: "info@pepea.radio",
                  areaServed: "KE",
                  availableLanguage: ["English", "Swahili"],
                },
              }),
            }}
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
