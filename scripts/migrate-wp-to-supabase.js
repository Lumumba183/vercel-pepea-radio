#!/usr/bin/env node
/**
 * Pepea Radio WordPress → Supabase Migration Script
 * Reads from WordPress REST API, inserts into Supabase
 * ZERO RISK — read-only on WordPress
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

// ── CONFIG ───────────────────────────────────────────────
const WP_BASE = 'https://pepearadioke.com/wp-json/wp/v2'
const SUPABASE_URL = 'https://nsgvblcnjrtyvbbpvegv.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZ3ZibGNuanJ0eXZiYnB2ZWd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA1NjkxNSwiZXhwIjoyMTAxNjMyOTE1fQ.f3sx8cnDamiRMez8izL2yZaO1_cLh0ttV4D9dG8JF9s'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Category mapping: WP category ID → Pepea category name
const CATEGORY_MAP = {
  1: 'News',
  72: 'National News',
  73: 'County News',
  74: 'World News',
  75: 'Politics',
  76: 'Opinion',
  77: 'Article',
  78: 'Health and Society',
  80: 'School News',
  82: 'Highlights',
  85: 'Sports',
  89: 'Celebrity',
  90: 'Health',
  91: 'Our Tribes',
  92: 'Swahili',
}

// ── HELPERS ──────────────────────────────────────────────
function decodeHtml(html) {
  if (!html) return ''
  return html
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&#038;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '') // strip tags for plain text
}

function stripTags(html) {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, '')
}

function cleanContent(html) {
  if (!html) return ''
  return html
    .replace(/class="wp-block-[^"]*"/g, '')
    .replace(/<!--\s*wp:.*?-->/g, '')
    .replace(/\n\n\n+/g, '\n\n')
    .trim()
}

function excerptFromContent(content, maxLen = 200) {
  const plain = stripTags(content).replace(/\s+/g, ' ').trim()
  if (plain.length <= maxLen) return plain
  return plain.substring(0, maxLen).replace(/\s+\S*$/, '') + '…'
}

function readTimeFromContent(content) {
  const words = stripTags(content).split(/\s+/).filter(Boolean).length
  const mins = Math.ceil(words / 200)
  return `${Math.max(1, mins)} min read`
}

function wpFetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    const req = client.get(url, { timeout: 30000 }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)) }
      })
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    const file = fs.createWriteStream(destPath)
    const req = client.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve(true) })
    })
    req.on('error', (e) => { fs.unlink(destPath, () => {}); reject(e) })
    file.on('error', (e) => { fs.unlink(destPath, () => {}); reject(e) })
  })
}

// ── MAIN ─────────────────────────────────────────────────
async function migrate() {
  console.log('🔥 Starting Pepea Radio Migration…\n')

  // 1. Fetch categories first
  console.log('📂 Fetching WordPress categories…')
  const wpCategories = await wpFetch(`${WP_BASE}/categories?per_page=100`)
  const catMap = {}
  wpCategories.forEach(c => { catMap[c.id] = c.name })
  console.log(`   Found ${wpCategories.length} categories\n`)

  // 2. Fetch all posts (paginated)
  console.log('📰 Fetching all WordPress posts…')
  const allPosts = []
  let page = 1
  const perPage = 100

  while (true) {
    const posts = await wpFetch(`${WP_BASE}/posts?per_page=${perPage}&page=${page}&_embed=author,wp:featuredmedia`)
    if (!posts.length) break
    allPosts.push(...posts)
    console.log(`   Page ${page}: ${posts.length} posts fetched`)
    if (posts.length < perPage) break
    page++
  }
  console.log(`   ✅ Total posts: ${allPosts.length}\n`)

  // 3. Prepare articles for Supabase
  console.log('🔄 Transforming posts for Supabase…')
  const articles = []
  const imageDir = path.join(__dirname, 'public', 'images', 'migrated')
  if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true })

  let imageSuccess = 0
  let imageFail = 0

  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i]
    const title = decodeHtml(post.title?.rendered || 'Untitled')
    const content = cleanContent(post.content?.rendered || '')
    const excerpt = excerptFromContent(content)
    const author = 'Pepea Radio'
    const date = post.date?.split('T')[0] || new Date().toISOString().split('T')[0]
    const read_time = readTimeFromContent(content)
    const featured = i < 10 // First 10 posts are featured

    // Map categories
    let category = 'News'
    if (post.categories && post.categories.length > 0) {
      // Pick the first category that maps, preferring more specific ones
      const mapped = post.categories.map(id => CATEGORY_MAP[id]).filter(Boolean)
      if (mapped.length) category = mapped[0]
    }

    // Handle featured image
    let imageUrl = null
    let localImagePath = null
    const embed = post._embedded
    if (embed && embed['wp:featuredmedia'] && embed['wp:featuredmedia'][0]) {
      const media = embed['wp:featuredmedia'][0]
      if (media.source_url) {
        imageUrl = media.source_url
        const ext = path.extname(new URL(imageUrl).pathname) || '.jpg'
        const filename = `wp-${post.id}${ext}`
        localImagePath = `/images/migrated/${filename}`
        const destPath = path.join(imageDir, filename)

        if (!fs.existsSync(destPath)) {
          try {
            await downloadImage(imageUrl, destPath)
            imageSuccess++
          } catch (e) {
            imageFail++
            localImagePath = null
          }
        } else {
          imageSuccess++
        }
      }
    }

    articles.push({
      title,
      excerpt,
      category,
      author,
      date,
      read_time,
      featured,
      content,
      image_url: localImagePath,
    })

    if ((i + 1) % 50 === 0) {
      console.log(`   Processed ${i + 1}/${allPosts.length}…`)
    }
  }

  console.log(`   ✅ Transformed ${articles.length} articles`)
  console.log(`   🖼️ Images: ${imageSuccess} downloaded, ${imageFail} failed\n`)

  // 4. Insert into Supabase
  console.log('💾 Inserting into Supabase…')

  // Clear existing articles first (optional — comment out if you want to keep)
  console.log('   (Skipping clear — appending to existing data)')

  const batchSize = 50
  let inserted = 0
  let failed = 0

  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize)
    const { data, error } = await supabase
      .from('articles')
      .insert(batch.map(a => ({
        title: a.title,
        excerpt: a.excerpt,
        category: a.category,
        author: a.author,
        date: a.date,
        read_time: a.read_time,
        featured: a.featured,
        content: a.content,
      })))

    if (error) {
      console.error(`   ❌ Batch ${i / batchSize + 1} failed:`, error.message)
      failed += batch.length
    } else {
      inserted += batch.length
      console.log(`   ✅ Batch ${i / batchSize + 1}: ${batch.length} articles inserted`)
    }
  }

  console.log(`\n🎉 MIGRATION COMPLETE!`)
  console.log(`   Articles inserted: ${inserted}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Images downloaded: ${imageSuccess}`)
  console.log(`\n🔥 Next: Commit images, push to GitHub, deploy to Vercel!`)
}

migrate().catch(err => {
  console.error('💥 Migration failed:', err)
  process.exit(1)
})
