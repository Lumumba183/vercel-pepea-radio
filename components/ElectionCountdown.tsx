'use client'

import { useEffect, useState } from 'react'
import { Vote } from 'lucide-react'

// Kenya General Election — Tuesday, 10 August 2027 (polls open 6:00 AM EAT)
const ELECTION_TS = new Date('2027-08-10T06:00:00+03:00').getTime()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  over: boolean
}

function getTimeLeft(): TimeLeft {
  const diff = ELECTION_TS - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
    over: false,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function ElectionCountdown() {
  const [t, setT] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setT(getTimeLeft())
    const iv = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="ec-wrap">
      <style>{`
        @property --ec-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }

        .ec-wrap {
          position: relative;
          border-radius: 1rem;
          padding: 2px;
          background: conic-gradient(from var(--ec-angle),
            #000000, #dc2626 22%, #ffffff 38%, #16a34a 55%, #ffffff 72%, #dc2626 88%, #000000);
          animation: ec-spin 7s linear infinite;
          box-shadow: 0 0 0 rgba(220,38,38,0);
        }
        @keyframes ec-spin { to { --ec-angle: 360deg; } }

        .ec-inner {
          position: relative;
          border-radius: calc(1rem - 2px);
          overflow: hidden;
          background: linear-gradient(135deg, #070a13 0%, #101527 55%, #0a0e1a 100%);
          animation: ec-glow 3.2s ease-in-out infinite;
        }
        @keyframes ec-glow {
          0%, 100% { box-shadow: inset 0 0 40px rgba(220,38,38,0.06); }
          50%      { box-shadow: inset 0 0 70px rgba(220,38,38,0.14); }
        }

        /* Kenyan flag stripes across the top */
        .ec-flag { display: flex; flex-direction: column; height: 12px; }
        .ec-flag span { flex: 1; }
        .ec-flag .k-black { background: #000; }
        .ec-flag .k-white { background: #fff; }
        .ec-flag .k-red   { background: #b11c1c; }
        .ec-flag .k-green { background: #0d6b0d; }

        /* sweeping sheen */
        .ec-sheen {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.07) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.07) 55%, transparent 70%);
          background-size: 250% 100%;
          animation: ec-sheen 4.5s ease-in-out infinite;
        }
        @keyframes ec-sheen {
          0% { background-position: 120% 0; }
          60%, 100% { background-position: -120% 0; }
        }

        .ec-blink-dot {
          width: 8px; height: 8px; border-radius: 9999px; background: #fff;
          animation: ec-blink 1s steps(2, start) infinite;
          box-shadow: 0 0 10px #fff, 0 0 16px #ef4444;
        }
        @keyframes ec-blink { 50% { opacity: 0.15; } }

        .ec-blink-text { animation: ec-blink-soft 1.6s ease-in-out infinite; }
        @keyframes ec-blink-soft { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

        .ec-colon {
          font-weight: 900; color: #ef4444; line-height: 1;
          animation: ec-blink-soft 1s ease-in-out infinite;
          text-shadow: 0 0 12px rgba(239,68,68,0.8);
        }

        .ec-digit-box {
          background: rgba(0,0,0,0.55);
          border: 1px solid rgba(220,38,38,0.35);
          border-radius: 0.75rem;
          backdrop-filter: blur(2px);
        }
        .ec-digit-sec {
          border-color: rgba(239,68,68,0.7);
          box-shadow: 0 0 18px rgba(239,68,68,0.25), inset 0 0 14px rgba(239,68,68,0.12);
        }
        .ec-pop { animation: ec-pop 0.45s ease; display: block; }
        @keyframes ec-pop {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.14); color: #fca5a5; }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="ec-inner">
        {/* Kenyan flag stripes */}
        <div className="ec-flag" aria-hidden="true">
          <span className="k-black" /><span className="k-white" /><span className="k-red" /><span className="k-white" /><span className="k-green" />
        </div>
        <div className="ec-sheen" aria-hidden="true" />

        <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-10 px-6 py-6 lg:px-10 lg:py-7">
          {/* Left: label + title */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(220,38,38,0.55)]">
              <span className="ec-blink-dot" />
              <span className="ec-blink-text">Live Countdown</span>
            </div>
            <h2 className="flex items-center justify-center lg:justify-start gap-2 text-2xl lg:text-3xl font-black text-white leading-tight">
              <Vote size={26} className="text-red-500 shrink-0" />
              Kenya Decides <span className="text-red-500">2027</span>
            </h2>
            <p className="text-[var(--text-muted)] text-sm mt-1.5">
              General Election — <span className="text-white font-semibold">Tuesday, 10 August 2027</span> · Polls open 6:00 AM EAT
            </p>
          </div>

          {/* Right: the countdown digits */}
          {t === null ? (
            <div className="h-[76px] w-full lg:w-[380px] rounded-xl bg-black/30 animate-pulse" />
          ) : t.over ? (
            <div className="text-center lg:text-right">
              <p className="text-2xl font-black text-red-500 ec-blink-text">IT'S ELECTION DAY!</p>
              <p className="text-[var(--text-muted)] text-sm mt-1">Go out and vote — your voice counts.</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3" role="timer" aria-label="Countdown to the 2027 Kenya General Election">
              <DigitBox value={pad(t.days)} label="Days" />
              <span className="ec-colon text-2xl sm:text-3xl" aria-hidden="true">:</span>
              <DigitBox value={pad(t.hours)} label="Hrs" />
              <span className="ec-colon text-2xl sm:text-3xl" aria-hidden="true">:</span>
              <DigitBox value={pad(t.minutes)} label="Min" />
              <span className="ec-colon text-2xl sm:text-3xl" aria-hidden="true">:</span>
              <div className="ec-digit-box ec-digit-sec px-3 py-2 sm:px-4 sm:py-2.5 text-center min-w-[64px] sm:min-w-[76px]">
                <span key={t.seconds} className="ec-pop text-2xl sm:text-4xl font-black tabular-nums text-white leading-none">
                  {pad(t.seconds)}
                </span>
                <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-red-400 mt-1">Sec</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DigitBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="ec-digit-box px-3 py-2 sm:px-4 sm:py-2.5 text-center min-w-[64px] sm:min-w-[76px]">
      <span className="block text-2xl sm:text-4xl font-black tabular-nums text-white leading-none">{value}</span>
      <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">{label}</span>
    </div>
  )
}
