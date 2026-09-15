import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Pepea Radio',
  description: 'The terms and conditions governing your use of the Pepea Radio website, live stream, and related services.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'Welcome to Pepea Radio. These Terms of Service ("Terms") govern your access to and use of our website, live radio stream, Pepea TV, and related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, please do not use the Service.',
  },
  {
    title: '2. Use of the Service',
    body: 'You may use the Service for lawful, personal, non-commercial purposes only. You agree not to: use the Service in any way that violates applicable laws or regulations, including the laws of Kenya; interfere with or disrupt the Service, its servers, or networks; attempt to gain unauthorised access to any part of the Service or its related systems; scrape, crawl, or otherwise harvest content or data from the Service by automated means; or impersonate any person or entity.',
  },
  {
    title: '3. Intellectual Property',
    body: 'All content on the Service — including audio broadcasts, video streams, articles, news stories, images, logos, graphics, and software — is the property of Pepea Radio or its content suppliers and is protected by copyright, trademark, and other intellectual property laws. You may access and view content for personal use only. You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content without our prior written permission.',
  },
  {
    title: '4. User Submissions',
    body: 'By submitting content to us — including news tips, story reports, audio, images, or messages ("Submissions") — you grant Pepea Radio a worldwide, non-exclusive, royalty-free, perpetual, and irrevocable licence to use, reproduce, modify, publish, and distribute your Submissions in any media. You represent that you own or control all rights to your Submissions and that they do not violate any third-party rights or applicable law. We reserve the right to edit or decline to publish any Submission.',
  },
  {
    title: '5. Advertising and Third-Party Content',
    body: 'The Service displays advertisements, including through Google AdSense and direct advertisers. We are not responsible for the content of third-party advertisements or the products and services they promote. Your dealings with any advertiser found on the Service are strictly between you and the advertiser.',
  },
  {
    title: '6. Live Stream Disclaimer',
    body: 'Our radio and TV streams are provided on an "as is" and "as available" basis. While we strive for uninterrupted 24/7 broadcasting, we do not guarantee that the streams will be error-free, uninterrupted, or available at all times. Scheduled programmes may change without notice.',
  },
  {
    title: '7. Disclaimer of Warranties',
    body: 'The Service is provided "as is" and "as available", with all faults and defects, without warranty of any kind. To the maximum extent permitted by law, Pepea Radio disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the content on the Service is accurate, complete, or current.',
  },
  {
    title: '8. Limitation of Liability',
    body: 'To the fullest extent permitted by law, Pepea Radio, its owners, staff, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising from your use of, or inability to use, the Service. Our total liability for any claim arising from these Terms or the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim, or one hundred US dollars (US$100), whichever is greater.',
  },
  {
    title: '9. Indemnification',
    body: 'You agree to indemnify, defend, and hold harmless Pepea Radio and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses — including reasonable legal fees — arising out of your use of the Service or your violation of these Terms.',
  },
  {
    title: '10. Termination',
    body: 'We may suspend or terminate your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service ceases immediately.',
  },
  {
    title: '11. Governing Law',
    body: 'These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any dispute arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Kenya.',
  },
  {
    title: '12. Changes to These Terms',
    body: 'We reserve the right to modify these Terms at any time. Changes take effect when posted on this page with an updated "Last updated" date. Your continued use of the Service after changes are posted constitutes acceptance of the revised Terms.',
  },
  {
    title: '13. Contact Us',
    body: 'Questions about these Terms may be directed to: info@pepearadioke.com | +254 726 846 053 | WhatsApp: +254 726 639 789.',
  },
]

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[800px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Terms of Service</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: September 15, 2026</p>
        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold text-[var(--text)] mb-2">{s.title}</h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
