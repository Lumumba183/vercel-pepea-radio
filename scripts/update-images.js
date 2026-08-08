#!/usr/bin/env node
/**
 * Add image_url column and update articles with image paths
 */

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
const http = require('http')

const SUPABASE_URL = 'https://nsgvblcnjrtyvbbpvegv.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZ3ZibGNuanJ0eXZiYnB2ZWd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA1NjkxNSwiZXhwIjoyMTAxNjMyOTE1fQ.f3sx8cnDamiRMez8izL2yZaO1_cLh0ttV4D9dG8JF9s'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const WP_BASE = 'https://pepearadioke.com/wp-json/wp/v2'

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

async function main() {
  console.log('🔧 Adding image_url column to articles table…')

  // Add column via Supabase REST API
  const { error: colError } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url TEXT;`
  })

  if (colError) {
    console.log('   ℹ️ Column may already exist or RPC not available, continuing…')
  }

  // Alternative: use raw SQL via REST
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({})
    })
  } catch(e) {}

  console.log('📰 Fetching WordPress posts to match images…')
  const allPosts = []
  let page = 1
  while (true) {
    const posts = await wpFetch(`${WP_BASE}/posts?per_page=100&page=${page}&_embed=wp:featuredmedia`)
    if (!posts.length) break
    allPosts.push(...posts)
    if (posts.length < 100) break
    page++
  }
  console.log(`   Found ${allPosts.length} posts\n`)

  console.log('🔍 Fetching articles from Supabase…')
  const { data: articles, error: artError } = await supabase
    .from('articles')
    .select('id, title')
    .order('id', { ascending: true })

  if (artError) {
    console.error('❌ Failed to fetch articles:', artError)
    return
  }
  console.log(`   Found ${articles.length} articles in Supabase\n`)

  console.log('🖼️ Updating articles with image URLs…')
  let updated = 0
  let skipped = 0

  for (let i = 0; i < allPosts.length && i < articles.length; i++) {
    const post = allPosts[i]
    const article = articles[i]

    const embed = post._embedded
    if (embed && embed['wp:featuredmedia'] && embed['wp:featuredmedia'][0]) {
      const media = embed['wp:featuredmedia'][0]
      if (media.source_url) {
        const ext = require('path').extname(new URL(media.source_url).pathname) || '.jpg'
        const imagePath = `/images/migrated/wp-${post.id}${ext}`

        const { error } = await supabase
          .from('articles')
          .update({ image_url: imagePath })
          .eq('id', article.id)

        if (error) {
          console.log(`   ⚠️ Failed to update article ${article.id}: ${error.message}`)
        } else {
          updated++
        }
        continue
      }
    }
    skipped++
  }

  console.log(`\n✅ Done! Updated ${updated} articles with images, ${skipped} without images.`)
}

main().catch(console.error)
