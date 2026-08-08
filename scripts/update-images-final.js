/**
 * Update articles with image paths from downloaded WordPress images
 * Run this AFTER adding image_url column to Supabase
 */

const { createClient } = require('/tmp/pepea-radio-check/node_modules/@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'https://nsgvblcnjrtyvbbpvegv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZ3ZibGNuanJ0eXZiYnB2ZWd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA1NjkxNSwiZXhwIjoyMTAxNjMyOTE1fQ.f3sx8cnDamiRMez8izL2yZaO1_cLh0ttV4D9dG8JF9s',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  // Get all articles from Supabase (ordered by id)
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title')
    .order('id', { ascending: true })
    .limit(1000)

  if (error) {
    console.error('❌ Failed to fetch articles:', error.message)
    return
  }

  console.log(`📰 Found ${articles.length} articles in Supabase`)

  // Build image map from downloaded files
  const imageDir = path.join(__dirname, '..', 'public', 'images', 'migrated')
  const files = fs.readdirSync(imageDir)
  const imageMap = {}
  files.forEach(f => {
    const match = f.match(/wp-(\d+)/)
    if (match) {
      imageMap[match[1]] = `/images/migrated/${f}`
    }
  })

  console.log(`🖼️ Found ${Object.keys(imageMap).length} images`)

  // We need to match articles to WordPress post IDs
  // The articles were inserted in WordPress order, so we need to fetch WP posts again
  // to know which post ID corresponds to which article title
  
  console.log('\n📡 Fetching WordPress posts to match IDs...')
  const https = require('https')
  
  function fetchWP(page) {
    return new Promise((resolve, reject) => {
      const url = `https://pepearadioke.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,title,featured_media`
      https.get(url, { timeout: 30000 }, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try { resolve(JSON.parse(data)) } catch { resolve([]) }
        })
      }).on('error', reject).on('timeout', () => reject(new Error('timeout')))
    })
  }

  const wpPosts = []
  for (let page = 1; page <= 3; page++) {
    const posts = await fetchWP(page)
    if (!posts.length) break
    wpPosts.push(...posts)
    console.log(`  Fetched page ${page}: ${posts.length} posts`)
  }

  // Build title -> wp_id mapping
  const titleToWpId = {}
  wpPosts.forEach(p => {
    const title = p.title?.rendered?.replace(/<[^>]+>/g, '').trim()
    if (title) titleToWpId[title] = p.id
  })

  // Update articles in batches
  let updated = 0
  let skipped = 0
  const batch = []

  for (const article of articles) {
    const wpId = titleToWpId[article.title]
    if (!wpId) {
      skipped++
      continue
    }
    
    const imagePath = imageMap[wpId]
    if (!imagePath) {
      skipped++
      continue
    }

    batch.push({
      id: article.id,
      image_url: imagePath
    })

    if (batch.length >= 50) {
      for (const item of batch) {
        const { error: updateErr } = await supabase
          .from('articles')
          .update({ image_url: item.image_url })
          .eq('id', item.id)
        
        if (updateErr) {
          console.error(`  ❌ Failed to update article ${item.id}:`, updateErr.message)
        } else {
          updated++
        }
      }
      batch.length = 0
      console.log(`  Progress: ${updated} updated...`)
    }
  }

  // Final batch
  for (const item of batch) {
    const { error: updateErr } = await supabase
      .from('articles')
      .update({ image_url: item.image_url })
      .eq('id', item.id)
    
    if (!updateErr) updated++
  }

  console.log(`\n✅ Done! Updated ${updated} articles with images.`)
  console.log(`⏭️ Skipped ${skipped} (no matching image)`)
}

main().catch(console.error)
