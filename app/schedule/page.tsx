import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlayerBar from '@/components/PlayerBar'
import { supabase } from '@/lib/supabase'
import { ScheduleItem } from '@/types'
import { Clock } from 'lucide-react'

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default async function SchedulePage() {
  const { data: schedule } = await supabase.from('schedule').select('*').order('id', { ascending: true })
  const items: ScheduleItem[] = schedule || []

  const byDay = dayOrder.map(day => ({
    day,
    shows: items.filter(s => s.day === day),
  })).filter(g => g.shows.length > 0)

  return (
    <>
      <Header />
      <main className="mt-[70px] max-w-[1000px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--text-muted)] bg-clip-text text-transparent">Programme Schedule</h1>
        <p className="text-[var(--text-muted)] mb-8">Your guide to what&apos;s on Pepea Radio</p>

        {byDay.map(({ day, shows }) => (
          <div key={day} className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gold">{day}</h2>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left p-4 text-[var(--text-muted)] text-xs font-semibold uppercase">Time</th>
                    <th className="text-left p-4 text-[var(--text-muted)] text-xs font-semibold uppercase">Show</th>
                    <th className="text-left p-4 text-[var(--text-muted)] text-xs font-semibold uppercase">Host</th>
                    <th className="text-left p-4 text-[var(--text-muted)] text-xs font-semibold uppercase">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.map((s, i) => (
                    <tr key={i} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[rgba(37,99,235,0.05)]">
                      <td className="p-4 text-[var(--text)]"><span className="inline-flex items-center gap-1 text-[var(--text-muted)]"><Clock size={14} /> {s.time}</span></td>
                      <td className="p-4 text-[var(--text)] font-bold">{s.show}</td>
                      <td className="p-4 text-[var(--text-muted)]">{s.host}</td>
                      <td className="p-4 text-[var(--text-muted)]">{s.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </main>
      <Footer />
      <PlayerBar />
    </>
  )
}
