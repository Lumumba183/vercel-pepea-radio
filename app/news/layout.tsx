import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Articles — Pepea Radio | Sauti Ya Afrika',
  description: 'Read the latest news from Pepea Radio. Breaking stories from across Kenya and the world — politics, sports, health, and community news.',
  keywords: ['Kenya news', 'Pepea Radio news', 'breaking news Kenya', 'African news', 'politics Kenya'],
  alternates: {
    canonical: 'https://pepea-radio.vercel.app/news',
  },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
