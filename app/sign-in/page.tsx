import { Metadata } from 'next'
import { SignIn } from '@clerk/nextjs'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Sign In — Pepea Radio | Staff Portal',
  description: 'Sign in to the Pepea Radio admin portal. Staff and contributors only.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignInPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] min-h-[calc(100vh-70px)] flex items-center justify-center px-6 py-12 bg-[radial-gradient(circle_at_center,var(--bg-light)_0%,var(--bg)_70%)]">
        <SignIn routing="hash" />
      </main>
    </>
  )
}
