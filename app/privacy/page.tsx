import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[800px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Privacy Policy</h1>
        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>Pepea Radio respects your privacy. This policy explains how we collect, use, and protect your personal information.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">Information We Collect</h2>
          <p>We may collect your name, email address, phone number, and any content you submit through our report forms or contact pages.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">How We Use Your Information</h2>
          <p>We use your information to respond to your inquiries, improve our services, and send you relevant updates about Pepea Radio.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">Data Security</h2>
          <p>We implement appropriate security measures to protect your personal data from unauthorized access, alteration, or destruction.</p>
          <h2 className="text-xl font-bold text-[var(--text)]">Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact us at info@pepea.radio.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
