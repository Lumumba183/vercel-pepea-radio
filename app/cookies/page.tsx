import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — Pepea Radio',
  description: 'How Pepea Radio uses cookies and similar technologies, including cookies used by Google AdSense for advertising.',
}

const sections = [
  {
    title: '1. What Are Cookies?',
    body: 'Cookies are small text files that are stored on your device (computer, tablet, or phone) when you visit a website. They help the website remember your preferences, keep you signed in, and understand how you interact with the site. Similar technologies include pixels, tags, and local storage.',
  },
  {
    title: '2. How We Use Cookies',
    body: 'Pepea Radio uses cookies for the following purposes: Essential cookies — required for the Service to function, such as security, sign-in sessions, and load balancing. These cannot be disabled. Analytics cookies — help us understand how visitors use the site (pages visited, time spent) so we can improve our content and programming. Preference cookies — remember your settings and choices to improve your experience.',
  },
  {
    title: '3. Advertising Cookies (Google AdSense)',
    body: 'We use Google AdSense to display advertisements. Google and its partners use cookies — including the DoubleClick DART cookie — to serve ads based on your visits to this site and other sites on the Internet. Google\u2019s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet. You may opt out of personalised advertising at www.aboutads.info/choices or via the Google Ads Settings at adssettings.google.com. Alternatively, you can opt out of some third-party vendors\u2019 use of cookies for personalised advertising by visiting www.aboutads.info.',
  },
  {
    title: '4. Third-Party Cookies',
    body: 'Some cookies are placed by third parties that provide services on our behalf, including: Google (advertising and analytics); social media platforms whose content is embedded on our pages; and our hosting and technology partners. These third parties may use cookies in accordance with their own privacy policies. We encourage you to review the Google Privacy & Terms page at policies.google.com for more information.',
  },
  {
    title: '5. Managing Cookies',
    body: 'Most web browsers allow you to control cookies through their settings. You can: view the cookies stored on your device; delete all or specific cookies; block all cookies; or block third-party cookies. Please note that if you disable or delete cookies, some parts of the Service — including sign-in and live stream features — may not function properly. You can find instructions for managing cookies in your browser\u2019s help section.',
  },
  {
    title: '6. Do Not Track',
    body: 'Some browsers include a "Do Not Track" (DNT) feature. There is currently no common standard for responding to DNT signals, and we do not currently respond to DNT signals. However, you can use the opt-out mechanisms described above to control personalised advertising.',
  },
  {
    title: '7. Changes to This Cookie Policy',
    body: 'We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for legal and operational reasons. Any changes will be posted on this page with an updated "Last updated" date.',
  },
  {
    title: '8. Contact Us',
    body: 'If you have questions about our use of cookies, contact us at: info@pepearadioke.com | +254 726 846 053 | WhatsApp: +254 726 639 789.',
  },
]

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[800px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Cookie Policy</h1>
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
