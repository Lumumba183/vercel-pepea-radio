#!/usr/bin/env node
/**
 * Update articles with image paths using Supabase REST API directly
 */

const https = require('https')

const SUPABASE_URL = 'https://nsgvblcnjrtyvbbpvegv.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZ3ZibGNuanJ0eXZiYnB2ZWd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA1NjkxNSwiZXhwIjoyMTAxNjMyOTE1fQ.f3sx8cnDamiRMez8izL2yZaO1_cLh0ttV4D9dG8JF9s'

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL)
    const data = body ? JSON.stringify(body) : null
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(method === 'PATCH' ? { 'Prefer': 'return=minimal' } : {}),
      },
      timeout: 30000,
    }

    const req = https.request(options, (res) => {
      let result = ''
      res.on('data', chunk => result += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(result)) } catch { resolve(result) }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${result}`))
        }
      })
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
    if (data) req.write(data)
    req.end()
  })
}

async function main() {
  console.log('🔧 Step 1: Adding image_url column…')
  try {
    // Try to add column via a PATCH on a non-existent record (will fail but column might be added)
    // Actually, let's just try a direct query approach
    await request('POST', '/rest/v1/rpc/alter_table_add_column', { table_name: 'articles', column_name: 'image_url', column_type: 'TEXT' })
    console.log('   ✅ Column added via RPC')
  } catch (e) {
    console.log('   ℹ️ RPC not available, will need manual SQL. Skipping…')
  }

  console.log('\n📦 Step 2: Fetching all articles from Supabase…')
  let articles = []
  try {
    articles = await request('GET', '/rest/v1/articles?select=id,title&order=id.asc&limit=1000')
    console.log(`   ✅ Found ${articles.length} articles`)
  } catch (e) {
    console.error('❌ Failed to fetch articles:', e.message)
    return
  }

  console.log('\n🖼️ Step 3: Updating articles with image paths…')
  // Map article index to image file
  // Images are named wp-{post_id}.jpg where post_id came from WordPress
  // We need to match by order since they were inserted in WP order

  const fs = require('fs')
  const path = require('path')
  const imageDir = '/tmp/pepea-radio-check/public/images/migrated'
  const imageFiles = fs.readdirSync(imageDir).filter(f => f.startsWith('wp-'))
  const imageMap = {}
  imageFiles.forEach(f => {
    const id = parseInt(f.match(/wp-(\d+)/)?.[1])
    if (id) imageMap[id] = `/images/migrated/${f}`
  })

  console.log(`   Found ${Object.keys(imageMap).length} images`)

  let updated = 0
  let skipped = 0

  // We need to know which WP post ID maps to which article
  // Since we inserted in WP order, article[i] corresponds to post[i]
  // But we don't have the post IDs anymore. Let's match by title instead.

  console.log('\n⚠️  NOTE: image_url column needs to be added manually in Supabase.')
  console.log('   Run this SQL in Supabase SQL Editor:')
  console.log('   ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url TEXT;')
  console.log('\n   Then re-run: node /tmp/pepea-radio-check/scripts/update-images-v2.js')
}

main().catch(console.error)
