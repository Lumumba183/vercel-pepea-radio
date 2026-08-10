import { SignUp } from '@clerk/nextjs'
import Header from '@/components/Header'

export default function SignUpPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] min-h-[calc(100vh-70px)] flex items-center justify-center px-6 py-12 bg-[radial-gradient(circle_at_center,var(--bg-light)_0%,var(--bg)_70%)]">
        <SignUp routing="hash" />
      </main>
    </>
  )
}
