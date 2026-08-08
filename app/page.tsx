import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import BriefSlider from '@/components/BriefSlider'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types'
import { Play, Newspaper, Tv, Calendar, Megaphone, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: "Pepea Radio — Sauti Ya Afrika | Kenya's Premier Online Radio Station",
  description: "Listen to Pepea Radio live — Kenya's fastest-growing online radio station. Breaking news, sports, politics, music, and community stories. Tune in anywhere, anytime.",
  keywords: ["Pepea Radio", "Kenya radio live", "online radio streaming", "African music", "Kenya news", "live radio Kenya"],
  alternates: {
    canonical: "https://pepea-radio.vercel.app",
  },
  openGraph: {
    title: "Pepea Radio — Sauti Ya Afrika",
    description: "Kenya's fastest-growing online radio station. Live streaming, news, sports, and community stories.",
    type: "website",
    url: "https://pepea-radio.vercel.app",
  },
}

async function getArticles(): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data || []
}

export default async function HomePage() {
  const articles = await getArticles()

  return (
    <>
      <Header />

      {/* Brief Slider */}
      <div className="mt-[70px]">
        <BriefSlider />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--bg)] via-[#0f172a] to-[var(--bg-light)] relative overflow-hidden px-6 py-16 min-h-[500px] flex items-center">
        <div className="absolute inset-0 opacity-50" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-[rgba(220,38,38,0.15)] text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase border border-[rgba(220,38,38,0.3)] animate-[pulse-red_2s_infinite] mb-4">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block" />
              Live Now
            </div>
            <h2 className="text-4xl lg:text-[3.5rem] font-black leading-tight mb-4 bg-gradient-to-br from-white to-[var(--text-muted)] bg-clip-text text-transparent">
              The Voice of Kenya, Amplified
            </h2>
            <p className="text-lg text-[var(--text-muted)] mb-8 max-w-[500px] mx-auto lg:mx-0">
              Pepea Radio brings you breaking news, live events, sports coverage, and the music that moves East Africa. Tune in anywhere, anytime.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/listen" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[0.9375rem] bg-gradient-to-br from-red-600 to-red-800 text-white no-underline shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(220,38,38,0.4)] transition-all">
                <Play size={18} /> Listen Live
              </Link>
              <Link href="/news" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[0.9375rem] bg-[var(--card)] text-[var(--text)] border border-[var(--border)] no-underline hover:bg-[var(--card-hover)] hover:border-blue-600 transition-all">
                <Newspaper size={18} /> Latest News
              </Link>
              <Link href="/tv" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[0.9375rem] bg-gradient-to-br from-gold to-amber-600 text-black no-underline hover:-translate-y-0.5 transition-all">
                <Tv size={18} /> Pepea TV
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-[320px] h-[320px] rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center animate-[float_6s_ease-in-out_infinite] shadow-[0_20px_60px_rgba(37,99,235,0.3),0_20px_60px_rgba(220,38,38,0.2)]">
              <span className="text-8xl font-black text-white drop-shadow-lg">PR</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Latest News</h2>
            <p className="text-[var(--text-muted)] text-[0.9375rem]">Breaking stories from across Kenya and the world</p>
          </div>
          <Link href="/news" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--card)] text-[var(--text)] border border-[var(--border)] no-underline hover:bg-[var(--card-hover)] hover:border-blue-600 transition-all">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Pepea TV */}
      <section className="max-w-[calc(1400px-3rem)] mx-6 lg:mx-auto bg-[var(--bg-light)] rounded-xl px-6 py-16 mb-16">
        <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Pepea TV — Live Events</h2>
            <p className="text-[var(--text-muted)] text-[0.9375rem]">Watch our broadcasts on YouTube and catch event coverage live</p>
          </div>
          <Link href="/tv" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--card)] text-[var(--text)] border border-[var(--border)] no-underline hover:bg-[var(--card-hover)] hover:border-blue-600 transition-all">
            Watch All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TvCard title="Sunday Gospel Live" desc="Join us every Sunday at 8 AM for live gospel music and worship from our studio." />
          <TvCard title="Friday Jam Sessions" desc="The biggest party on radio, now with live video. Every Friday from 6 PM." />
          <TvCard title="Community Events" desc="Roadshows, church services, sports coverage and more from across Kenya." />
        </div>
      </section>

      {/* Advertise */}
      <section className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Advertise With Us</h2>
          <p className="text-[var(--text-muted)] text-[0.9375rem]">Reach thousands of engaged listeners across Kenya and the diaspora</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          <PriceCard title="Starter" price="KES 5,000" period="/week" features={['Homepage banner (728×90)', 'News page sidebar ad', 'Social media mention ×2', 'Basic analytics report']} />
          <PriceCard title="Professional" price="KES 15,000" period="/week" featured features={['All Starter features', 'Player area premium slot', 'Dedicated advert page feature', 'On-air mention ×3', 'WhatsApp blast to subscribers']} />
          <PriceCard title="Enterprise" price="KES 35,000" period="/week" features={['All Professional features', 'Exclusive homepage takeover', 'Live event sponsorship', 'Pepea TV video ad placement', 'Dedicated campaign manager']} />
        </div>
      </section>

      {/* Report Story */}
      <section className="max-w-[800px] mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Have a Story?</h2>
        <p className="text-[var(--text-muted)] text-lg mb-8">Our audience is our best source of news. Send us tips, photos, videos, or breaking news alerts. You can remain anonymous.</p>
        <Link href="/report" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg bg-gradient-to-br from-red-600 to-red-800 text-white no-underline shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 transition-all">
          <FileText size={20} /> Report a Story
        </Link>
      </section>

      <Footer />
      <PlayerBar />
    </>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.id}`} className="bg-[var(--card)] rounded-xl overflow-hidden border border-[var(--border)] transition-all hover:-translate-y-1 hover:border-blue-600 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] no-underline block">
      <div className="w-full h-[180px] bg-gradient-to-br from-[var(--bg-light)] to-[var(--card)] flex items-center justify-center relative overflow-hidden">
        <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase z-10">{article.category}</span>
        {article.image_url ? (
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-[var(--text)] leading-snug">{article.title}</h3>
        <div className="flex gap-4 text-[var(--text-muted)] text-[0.8125rem] mb-3">
          <span>{article.author}</span>
          <span>{new Date(article.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          <span>{article.read_time}</span>
        </div>
        <p className="text-[var(--text-muted)] text-[0.9375rem] leading-relaxed">{article.excerpt}</p>
      </div>
    </Link>
  )
}

function TvCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-[var(--card)] rounded-xl overflow-hidden border border-[var(--border)] transition-all hover:border-red-600">
      <div className="w-full aspect-video bg-gradient-to-br from-black to-[var(--bg-light)] flex items-center justify-center relative">
        <div className="w-16 h-16 rounded-full bg-[rgba(220,38,38,0.9)] flex items-center justify-center text-white text-2xl cursor-pointer transition-all hover:scale-110 hover:bg-red-600">
          <Play size={28} fill="white" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-[var(--text-muted)] text-[0.9375rem]">{desc}</p>
      </div>
    </div>
  )
}

function PriceCard({ title, price, period, features, featured }: { title: string; price: string; period: string; features: string[]; featured?: boolean }) {
  return (
    <div className={`bg-[var(--card)] rounded-xl p-8 border text-center transition-all hover:border-blue-600 hover:-translate-y-1 relative overflow-hidden ${featured ? 'border-gold' : 'border-[var(--border)]'}`}>
      {featured && (
        <div className="absolute top-0 right-0 bg-gold text-black text-[0.625rem] font-extrabold px-3 py-1 rounded-bl-lg">MOST POPULAR</div>
      )}
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="text-4xl font-black text-[var(--text)] my-4">{price}<span className="text-base text-[var(--text-muted)] font-normal">{period}</span></div>
      <ul className="list-none text-left my-6 space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-[var(--text-muted)] py-1">
            <span className="text-success font-bold">✓</span> {f}
          </li>
        ))}
      </ul>
      <Link href="/advertise" className={`inline-flex items-center justify-center w-full py-3 rounded-xl font-semibold no-underline transition-all ${featured ? 'bg-gradient-to-br from-red-600 to-red-800 text-white' : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--card-hover)]'}`}>
        {featured ? 'Get Started' : title === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
      </Link>
    </div>
  )
}
