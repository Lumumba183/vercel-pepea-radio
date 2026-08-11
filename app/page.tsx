import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import BriefSlider from '@/components/BriefSlider'
import AdSpace from '@/components/AdSpace'
import RadioCard from '@/components/RadioCard'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types'
import { Play, Newspaper, Tv, FileText, Clock, User } from 'lucide-react'

async function getArticles(): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  return data || []
}

export default async function HomePage() {
  const articles = await getArticles()

  const mainNews = articles.find(a => a.is_main_news) || articles[0]
  const featuredArticles = articles.filter(a => a.featured && a.id !== mainNews?.id).slice(0, 6)
  const sideArticles = articles.filter(a => a.id !== mainNews?.id).slice(0, 4)

  return (
    <>
      <Header />

      {/* Brief Slider */}
      <div className="mt-[70px]">
        <BriefSlider />
      </div>

      {/* Hero / Main News Section */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        {mainNews && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Main News - Large */}
            <div className="lg:col-span-2">
              <Link href={`/article/${mainNews.id}`} className="group block no-underline">
                <div className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {mainNews.image_url ? (
                      <img
                        src={mainNews.image_url}
                        alt={mainNews.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--bg-light)] to-[var(--card)] flex items-center justify-center">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        MAIN NEWS
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-blue-600/15 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase mb-3">
                      {mainNews.category}
                    </span>
                    <h2 className="text-2xl lg:text-3xl font-black text-[var(--text)] leading-tight mb-3 group-hover:text-blue-400 transition-colors">
                      {mainNews.title}
                    </h2>
                    <p className="text-[var(--text-muted)] text-[0.9375rem] leading-relaxed mb-4">
                      {mainNews.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-[var(--text-muted)] text-sm">
                      <span className="flex items-center gap-1"><User size={14} /> {mainNews.author}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {mainNews.read_time}</span>
                      <span>{new Date(mainNews.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Side News + Radio Card + Ad below */}
            <div className="space-y-4">
              <RadioCard />

              <h3 className="text-lg font-bold text-[var(--text-muted)] uppercase tracking-wide">More News</h3>
              {sideArticles.map(article => (
                <Link key={article.id} href={`/article/${article.id}`} className="group flex gap-4 no-underline bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 hover:border-blue-600 transition-all">
                  <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--bg-light)] to-[var(--card)]">
                    {article.image_url ? (
                      <img src={article.image_url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-blue-600 uppercase">{article.category}</span>
                    <h4 className="font-bold text-[var(--text)] text-sm leading-snug mt-1 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-[var(--text-muted)] text-xs mt-1">{article.author}</p>
                  </div>
                </Link>
              ))}
              {/* Ad Space below articles */}
              <AdSpace position="sidebar" />
            </div>
          </div>
        )}
      </section>

      {/* Featured News */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Featured Stories</h2>
            <p className="text-[var(--text-muted)] text-[0.9375rem]">Top stories from across Kenya and the world</p>
          </div>
          <Link href="/news" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--card)] text-[var(--text)] border border-[var(--border)] no-underline hover:bg-[var(--card-hover)] hover:border-blue-600 transition-all">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
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

      {/* Bottom Advertisement Banners */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Advertise With Us</h2>
          <p className="text-[var(--text-muted)] text-[0.9375rem]">Reach thousands of engaged listeners across Kenya and the diaspora</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
          <AdSpace position="bottom-left" />
          <AdSpace position="bottom-right" />
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
      <div className="w-full h-[180px] relative overflow-hidden">
        {article.image_url ? (
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--bg-light)] to-[var(--card)] flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{article.category}</span>
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

