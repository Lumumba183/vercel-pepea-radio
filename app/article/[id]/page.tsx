import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types'
import { ArrowLeft, Clock, User, Image as ImageIcon } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) notFound()

  const { data: related } = await supabase
    .from('articles')
    .select('*')
    .eq('category', article.category)
    .neq('id', id)
    .limit(3)

  return (
    <>
      <Header />
      <main className="mt-[70px]">
        {/* Hero Image */}
        {article.image_url && (
          <div className="relative w-full h-[300px] lg:h-[400px] overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
          </div>
        )}

        <div className={`bg-gradient-to-b from-[var(--bg-light)] to-[var(--bg)] border-b border-[var(--border)] px-6 py-12 ${!article.image_url ? 'mt-0' : '-mt-32 relative z-10'}`}>
          <div className="max-w-[900px] mx-auto">
            <Link href="/news" className="inline-flex items-center gap-2 text-[var(--text-muted)] no-underline mb-4 hover:text-blue-600 transition-all">
              <ArrowLeft size={16} /> Back to News
            </Link>
            <span className="inline-block bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-4">{article.category}</span>
            <h1 className="text-3xl lg:text-[2.5rem] font-extrabold leading-tight mb-4">{article.title}</h1>
            <div className="flex items-center gap-6 text-[var(--text-muted)] text-[0.9375rem]">
              <span className="flex items-center gap-1"><User size={14} /> {article.author}</span>
              <span>{article.date ? new Date(article.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) : article.created_at ? new Date(article.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {article.read_time}</span>
            </div>
          </div>
        </div>

        <article className="max-w-[900px] mx-auto px-6 py-8 text-lg leading-relaxed text-[var(--text)] article-body" dangerouslySetInnerHTML={{ __html: article.content }} />

        {related && related.length > 0 && (
          <div className="max-w-[900px] mx-auto px-6 pb-16">
            <h3 className="text-xl font-bold mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((a: Article) => (
                <Link key={a.id} href={`/article/${a.id}`} className="bg-[var(--card)] rounded-xl overflow-hidden border border-[var(--border)] no-underline hover:border-blue-600 transition-all block">
                  <div className="w-full h-[100px] relative overflow-hidden">
                    {a.image_url ? (
                      <img src={a.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--bg-light)] to-[var(--card)] flex items-center justify-center">
                        <ImageIcon size={20} className="text-[var(--text-muted)]" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="text-xs font-bold text-red-600 uppercase">{a.category}</span>
                    <h4 className="font-bold text-[var(--text)] mt-1 text-sm">{a.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}
