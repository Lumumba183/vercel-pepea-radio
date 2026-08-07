import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Report a Story — Pepea Radio | Sauti Ya Afrika',
  description: 'Have a story? Send us tips, photos, videos, or breaking news alerts. Pepea Radio — amplifying community voices across Kenya.',
  keywords: ['report news Kenya', 'Pepea Radio tips', 'breaking news alert', 'community journalism'],
  alternates: {
    canonical: 'https://pepea-radio.vercel.app/report',
  },
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
