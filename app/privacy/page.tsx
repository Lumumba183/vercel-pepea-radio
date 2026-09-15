import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Pepea Radio',
  description: 'How Pepea Radio collects, uses, and protects your personal information when you use our website, radio, and TV services.',
}

const sections = [
  {
    title: '1. Introduction',
    body: 'Pepea Radio ("we", "us", or "our") operates the website pepea-radio.vercel.app and related services (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, listen to our radio stream, watch Pepea TV, submit a story, or contact us. By using the Service, you consent to the practices described in this policy.',
  },
  {
    title: '2. Information We Collect',
    body: 'We may collect information you provide directly to us, including: your name, email address, and phone number when you contact us, book a show, or report a story; the content of messages and submissions you send to us; and information you provide when advertising with us. We also automatically collect certain technical information when you visit, such as your IP address, browser type, device type, pages visited, time spent on pages, and referring URLs.',
  },
  {
    title: '3. How We Use Your Information',
    body: 'We use the information we collect to: operate, maintain, and improve the Service; respond to your inquiries, bookings, and story submissions; send you updates, newsletters, or promotional content (you may opt out at any time); analyze traffic and user behaviour to improve our content and programming; detect and prevent fraud, abuse, or security incidents; and comply with legal obligations under Kenyan law.',
  },
  {
    title: '4. Cookies and Tracking Technologies',
    body: 'We use cookies and similar technologies to keep the Service secure, remember your preferences, and understand how visitors use our site. For detailed information, please read our Cookie Policy at /cookies. You can control cookies through your browser settings.',
  },
  {
    title: '5. Google AdSense and Advertising',
    body: 'We use Google AdSense to display advertisements on the Service. Google, as a third-party vendor, uses cookies — including the DART cookie — to serve ads based on your visits to this site and other sites on the Internet. You may opt out of the use of the DART cookie by visiting the Google Ads Settings page. Third-party vendors use cookies to serve ads based on your prior visits to this or other websites. You may opt out of personalised advertising by visiting www.aboutads.info/choices. We do not control, and are not responsible for, the content of ads served by third-party networks.',
  },
  {
    title: '6. Data Sharing and Disclosure',
    body: 'We do not sell your personal information. We may share information with: service providers who perform services on our behalf (e.g., hosting, analytics, advertising partners such as Google); law enforcement or regulatory authorities where required by law, including under the Kenya Data Protection Act, 2019; and successors in the event of a merger, acquisition, or sale of assets.',
  },
  {
    title: '7. Data Security',
    body: 'We implement appropriate technical and organisational measures — including encryption in transit, access controls, and secure hosting — to protect your personal data against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '8. Data Retention',
    body: 'We retain personal information only for as long as necessary to fulfil the purposes described in this policy, unless a longer retention period is required or permitted by law. When we no longer need your data, we securely delete or anonymise it.',
  },
  {
    title: '9. Your Rights',
    body: 'Under the Kenya Data Protection Act, 2019 (and, where applicable, the EU General Data Protection Regulation), you have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data; object to or restrict certain processing; and withdraw consent at any time. To exercise any of these rights, contact us at info@pepearadioke.com.',
  },
  {
    title: '10. Children\u2019s Privacy',
    body: 'The Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If you believe we have collected data from a child under 13, please contact us and we will delete it promptly.',
  },
  {
    title: '11. Links to Third-Party Sites',
    body: 'The Service may contain links to third-party websites (including social media platforms and our technology partner NexaFlow Digital). We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.',
  },
  {
    title: '12. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the updated policy.',
  },
  {
    title: '13. Contact Us',
    body: 'If you have questions or concerns about this Privacy Policy or our data practices, contact us at: info@pepearadioke.com | +254 726 846 053 | WhatsApp: +254 726 639 789.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[800px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Privacy Policy</h1>
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
