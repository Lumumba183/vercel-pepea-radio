import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import { Radio, MapPin, Phone, Mail, Target, Eye, Heart, Award, Users, Globe, Music, Mic2, BookOpen } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — Pepea Radio | Sauti Ya Afrika',
  description: 'Learn about Pepea Radio, Kenya\\'s fastest-growing online radio station. Founded by Peter Mukabi, broadcasting since 2023 with news, music, and community stories.',
  keywords: ['Pepea Radio', 'Kenya radio station', 'Peter Mukabi', 'TransAfrica Media', 'online radio Kenya', 'Bungoma radio'],
  openGraph: {
    title: 'About Pepea Radio — Sauti Ya Afrika',
    description: 'Kenya\\'s premier radio station delivering news, music, and community stories.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mt-[70px]">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-20 bg-gradient-to-br from-[var(--bg)] via-[#0f172a] to-[var(--bg-light)]">
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
          <div className="max-w-[1100px] mx-auto text-center relative z-10">
            <h1 className="text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-white via-blue-200 to-red-400 bg-clip-text text-transparent">
              About Pepea Radio
            </h1>
            <p className="text-xl text-[var(--text-muted)] max-w-[700px] mx-auto">
              Sauti Ya Afrika — Kenya&apos;s Voice. Empowering communities through information, education, and entertainment since 2023.
            </p>
          </div>
        </section>

        {/* Company Profile */}
        <section className="max-w-[1100px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center">
                  <Radio className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black">Our Story</h2>
                  <p className="text-[var(--text-muted)]">Broadcasting since 2023</p>
                </div>
              </div>

              <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
                <p>
                  <strong className="text-[var(--text)]">Pepea Radio</strong> is a dynamic and fast-growing Kenyan radio station based in Bungoma County, Kenya. The station is owned and operated by <strong className="text-[var(--text)]">TransAfrica Media Ltd</strong>, a media company committed to delivering quality broadcasting services, promoting African culture, and empowering communities through information, education, and entertainment.
                </p>
                <p>
                  The company is under the leadership of its directors, <strong className="text-[var(--text)]">Mr. Peter Mukabi</strong> and <strong className="text-[var(--text)]">Mrs. Costa Jebichii</strong>, whose vision has driven the station&apos;s rapid growth since its establishment in late 2023.
                </p>
                <p>
                  Although still a young media house, Pepea Radio has quickly built a strong reputation as one of <strong className="text-[var(--text)]">Kenya&apos;s fastest-growing online radio stations</strong>, attracting listeners from across the country and the Kenyan diaspora through its innovative programming and digital broadcasting platforms.
                </p>
              </div>

              {/* Leadership */}
              <div className="mt-8 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users size={20} className="text-red-600" />
                  Leadership
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">PM</div>
                    <div>
                      <p className="font-semibold">Mr. Peter Mukabi</p>
                      <p className="text-sm text-[var(--text-muted)]">Director & Founder</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-sm">CJ</div>
                    <div>
                      <p className="font-semibold">Mrs. Costa Jebichii</p>
                      <p className="text-sm text-[var(--text-muted)]">Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Info */}
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Globe size={20} className="text-blue-600" />
                  Broadcasting & Audience
                </h3>
                <ul className="space-y-3 text-[var(--text-muted)]">
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold mt-1">✓</span>
                    <span>Broadcasts primarily in <strong className="text-[var(--text)]">Swahili and English</strong>, reaching a broad and diverse audience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold mt-1">✓</span>
                    <span>Serves listeners from different age groups, backgrounds, and communities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold mt-1">✓</span>
                    <span>Accessible to listeners worldwide through online streaming and digital platforms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold mt-1">✓</span>
                    <span>Programming that reflects Kenyan culture while embracing modern trends</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Music size={20} className="text-red-600" />
                  Programming
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Rhumba', 'Zilizopendwa', 'Reggae', 'Gospel', 'African Music', 'Secular Hits', 'Talk Shows', 'Sports'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mic2 size={20} className="text-blue-600" />
                  Talk Show Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Health', 'Education', 'Business', 'Leadership', 'Youth Empowerment', 'Agriculture', 'Sports', 'Current Affairs'].map((topic) => (
                    <span key={topic} className="px-3 py-1 bg-[var(--bg-light)] border border-[var(--border)] rounded-full text-xs text-[var(--text-muted)]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-[var(--bg-light)] px-6 py-16">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Vision */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-4">
                  <Eye className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Vision</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  To become Africa&apos;s leading digital radio station, inspiring, informing, and entertaining communities through innovative broadcasting while promoting African culture, unity, and sustainable development.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4">
                  <Target className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Mission</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  To deliver quality, credible, and engaging radio programming that educates, informs, entertains, and empowers audiences by embracing innovation, supporting local talent, promoting cultural diversity, and providing a trusted platform for community dialogue and development.
                </p>
              </div>

              {/* Why Pepea */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                  <Heart className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Why Pepea Radio?</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  We distinguish ourselves through commitment to quality broadcasting, diverse programming, strong community engagement, and innovative digital strategy. Since our launch in late 2023, we continue to grow rapidly as an emerging voice in Kenya&apos;s media industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="max-w-[1100px] mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">Core Values</h2>
            <p className="text-[var(--text-muted)]">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { label: 'Integrity', icon: <Award size={20} /> },
              { label: 'Professionalism', icon: <BookOpen size={20} /> },
              { label: 'Innovation', icon: <Globe size={20} /> },
              { label: 'Diversity', icon: <Users size={20} /> },
              { label: 'Excellence', icon: <Award size={20} /> },
              { label: 'Accountability', icon: <Target size={20} /> },
              { label: 'Creativity', icon: <Music size={20} /> },
              { label: 'Teamwork', icon: <Users size={20} /> },
              { label: 'Respect', icon: <Heart size={20} /> },
              { label: 'Community Service', icon: <Radio size={20} /> },
            ].map((value) => (
              <div key={value.label} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-center hover:border-blue-600 transition-all">
                <div className="text-blue-600 mb-2 flex justify-center">{value.icon}</div>
                <p className="font-semibold text-sm">{value.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Peter Mukabi Profile */}
        <section className="bg-gradient-to-br from-[var(--bg)] via-[#0f172a] to-[var(--bg-light)] px-6 py-16">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black mb-2">Peter Mukabi</h2>
              <p className="text-xl text-[var(--text-muted)]">Veteran Journalist, Broadcaster & Media Strategist</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bio Card */}
              <div className="lg:col-span-1">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-white font-black text-4xl mb-4">
                    PM
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Peter Mukabi</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-4">Director & Founder, Pepea Radio</p>

                  <div className="space-y-2 text-left text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <MapPin size={14} className="text-red-600" />
                      <span>Nairobi, Kenya</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <CalendarIcon size={14} className="text-blue-600" />
                      <span>Born: 23 September 1986</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Award size={14} className="text-gold" />
                      <span>19+ Years in Media</span>
                    </div>
                  </div>
                </div>

                {/* Key Roles */}
                <div className="mt-4 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                  <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-[var(--text-muted)]">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Journalism', 'Broadcasting', 'Audio Production', 'Scriptwriting', 'Videography', 'Motivational Speaking', 'Media Consulting', 'Digital Storytelling'].map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-[var(--bg-light)] border border-[var(--border)] rounded text-xs text-[var(--text-muted)]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Story */}
              <div className="lg:col-span-2 space-y-6 text-[var(--text-muted)] leading-relaxed">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-[var(--text)]">Early Life & Education</h3>
                  <p>
                    Peter Mukabi developed a passion for communication and storytelling from an early age. He began his education at <strong className="text-[var(--text)]">Endebess Primary School</strong> before completing his Kenya Certificate of Primary Education (KCPE) at <strong className="text-[var(--text)]">Eldoret Livingstone Academy</strong> in the year 2000. He later joined <strong className="text-[var(--text)]">Manor House High School</strong> in 2001, where he nurtured his communication skills and developed an interest in journalism and public affairs.
                  </p>
                  <p className="mt-3">
                    Driven by his passion for media, Mukabi pursued professional training at the <strong className="text-[var(--text)]">East Africa School of Journalism and Broadcasting</strong>, where he earned a <strong className="text-[var(--text)]">Diploma in Journalism and Broadcasting</strong>. His education equipped him with practical and theoretical knowledge in news reporting, broadcasting, media ethics, scriptwriting, production, and communication.
                  </p>
                </div>

                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-[var(--text)]">Career Journey</h3>
                  <p>
                    Throughout his career, Peter Mukabi has worked with several respected media organizations across East Africa. He served as a correspondent for <strong className="text-[var(--text)]">Magic FM Kenya</strong> and <strong className="text-[var(--text)]">Channel Ten Media Tanzania</strong>, a broadcaster owned by Tanzania&apos;s ruling party, CCM (Chama Cha Mapinduzi). These opportunities enabled him to gain extensive experience in news gathering, political reporting, feature writing, investigative journalism, and regional affairs.
                  </p>
                  <p className="mt-3">
                    Mukabi also contributed to <strong className="text-[var(--text)]">VOA Swahili (Voice of America)</strong>, where he became known for insightful reporting and analysis on political, economic, and social issues affecting Kenya, East Africa, and the African continent. His reports have helped audiences better understand public policy, governance, development, and the everyday issues that affect citizens.
                  </p>
                </div>

                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-[var(--text)]">Expertise & Skills</h3>
                  <p>
                    Beyond reporting, Peter Mukabi possesses extensive technical expertise in <strong className="text-[var(--text)]">audio production, radio programming, scriptwriting, content development, videography, digital storytelling, and multimedia production</strong>. His ability to combine journalism with creative production has enabled him to produce engaging content across radio, television, and digital platforms.
                  </p>
                  <p className="mt-3">
                    His understanding of broadcasting extends beyond news presentation to <strong className="text-[var(--text)]">station management, audience engagement, branding, programming strategy, and content development</strong>. These skills have made him a respected figure among media professionals and a valuable resource for emerging broadcasters.
                  </p>
                </div>

                <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-[var(--text)]">Mentorship & Motivational Speaking</h3>
                  <p>
                    Peter Mukabi is equally passionate about mentoring the next generation of journalists and communication professionals. As a <strong className="text-[var(--text)]">career motivational speaker</strong>, he is regularly invited to schools, colleges, universities, and professional forums to speak about journalism, leadership, communication, entrepreneurship, and personal development. Through these engagements, he encourages young people to pursue excellence, uphold ethical standards, embrace innovation, and use media as a force for positive change.
                  </p>
                  <p className="mt-3">
                    His presentations combine practical industry experience with inspirational life lessons, making him a sought-after speaker for youth empowerment programmes, leadership seminars, and media conferences.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-900/30 to-blue-900/30 border border-red-600/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-[var(--text)]">Legacy & Impact</h3>
                  <p>
                    Throughout his career, Mukabi has remained committed to using journalism as a tool for development. He believes that responsible media should amplify the voices of ordinary citizens, promote accountability, encourage peaceful dialogue, and contribute to national development. His work reflects a dedication to truth, fairness, and the public interest.
                  </p>
                  <p className="mt-3">
                    Recent research has recognized Peter Mukabi as <strong className="text-[var(--text)]">one of Kenya&apos;s most influential radio hosts</strong>, reflecting the impact he has made through his broadcasting career and his connection with audiences. His influence continues to grow through his work in journalism, broadcasting, media entrepreneurship, mentorship, and communication consultancy.
                  </p>
                  <p className="mt-3">
                    Today, Peter Mukabi continues to contribute to the growth of the media industry. With more than 19 years of experience, he remains dedicated to shaping the future of African media while inspiring the next generation of journalists and communication professionals to uphold excellence, integrity, and innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community & Digital */}
        <section className="max-w-[1100px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
              <Globe size={32} className="text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Digital Presence</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Pepea Radio has embraced modern technology by focusing on online broadcasting and digital engagement. Through social media platforms, mobile streaming, and internet radio services, the station connects with audiences locally and internationally, making quality African content available anytime and anywhere.
              </p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
              <Heart size={32} className="text-red-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Community Engagement</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We believe in giving back to society by supporting community initiatives, promoting local talent, partnering with organizations in public awareness campaigns, and providing a voice for grassroots communities. We actively promote culture, unity, peace, and socio-economic development through our programming.
              </p>
            </div>
          </div>
        </section>

        {/* Objectives */}
        <section className="bg-[var(--bg-light)] px-6 py-16">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-2">Our Objectives</h2>
              <p className="text-[var(--text-muted)]">What we strive to achieve every day</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Provide informative, educational, and entertaining radio programming',
                'Promote African culture, music, and heritage',
                'Empower communities through access to reliable information',
                'Support local artists, entrepreneurs, and innovators',
                'Provide affordable and effective advertising solutions',
                'Leverage digital technology in expanding audience reach',
                'Promote peace, national cohesion, and social development',
              ].map((obj, i) => (
                <div key={i} className="flex items-start gap-3 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-[var(--text-muted)]">{obj}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-[800px] mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Get In Touch</h2>
          <p className="text-[var(--text-muted)] mb-8">We would love to hear from you. Reach out for partnerships, advertising, or just to say hello!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[500px] mx-auto">
            <div className="flex items-center justify-center gap-3 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
              <Phone className="text-success" size={20} />
              <span className="font-semibold">+254 106 216 699</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
              <Mail className="text-blue-600" size={20} />
              <span className="font-semibold">info@pepea.radio</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}

function CalendarIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
