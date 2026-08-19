'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  path: string
  compact?: boolean
}

// Brand icons (inline SVG so no extra deps)
function WhatsAppIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function FacebookIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function XIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

function TelegramIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

export default function ShareButtons({ title, path, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  // Built at click time so it always matches the real domain the visitor is on
  const getUrl = () => `${window.location.origin}${path}`

  const openShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=640,height=560')
  }

  const shareWhatsApp = () =>
    openShare(`https://wa.me/?text=${encodeURIComponent(`${title} — Pepea Radio\n${getUrl()}`)}`)

  const shareFacebook = () =>
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`)

  const shareX = () =>
    openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`)

  const shareTelegram = () =>
    openShare(`https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`)

  const copyLink = async () => {
    const url = getUrl()
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const box = compact ? 'w-9 h-9' : 'w-10 h-10'
  const icon = compact ? 16 : 18
  const base =
    `${box} rounded-full flex items-center justify-center text-white transition-all ` +
    'hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.45)] cursor-pointer border-0'

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
        {compact ? 'Share' : 'Share this story'}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={shareWhatsApp}
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
          className={`${base} bg-[#25D366] hover:bg-[#1ebe5b]`}
        >
          <WhatsAppIcon size={icon} />
        </button>
        <button
          type="button"
          onClick={shareFacebook}
          aria-label="Share on Facebook"
          title="Share on Facebook"
          className={`${base} bg-[#1877F2] hover:bg-[#0f66d6]`}
        >
          <FacebookIcon size={icon} />
        </button>
        <button
          type="button"
          onClick={shareX}
          aria-label="Share on X (Twitter)"
          title="Share on X (Twitter)"
          className={`${base} bg-black border border-[var(--border)] hover:bg-[#222]`}
        >
          <XIcon size={compact ? 14 : 15} />
        </button>
        <button
          type="button"
          onClick={shareTelegram}
          aria-label="Share on Telegram"
          title="Share on Telegram"
          className={`${base} bg-[#229ED9] hover:bg-[#1b8cc2]`}
        >
          <TelegramIcon size={icon} />
        </button>
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy article link"
          title={copied ? 'Link copied!' : 'Copy link'}
          className={`${base} ${
            copied
              ? 'bg-[var(--success)] hover:bg-[var(--success)]'
              : 'bg-[var(--card-hover)] border border-[var(--border)] hover:border-blue-500'
          }`}
        >
          {copied ? <Check size={icon} /> : <Link2 size={icon} />}
        </button>
        {copied && (
          <span className="text-xs font-semibold text-[var(--success)]">Link copied!</span>
        )}
      </div>
    </div>
  )
}
