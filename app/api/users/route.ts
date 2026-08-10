import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const client = await clerkClient()
    const clerkUsersResponse = await client.users.getUserList({ limit: 500 })
    const clerkUsers = clerkUsersResponse.data

    const { data: appUsers, error } = await supabaseAdmin.from('app_users').select('*')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const mergedUsers = clerkUsers.map((cu: any) => {
      const appUser = appUsers?.find((au: any) => au.email === cu.emailAddresses[0]?.emailAddress)
      return {
        id: cu.id,
        email: cu.emailAddresses[0]?.emailAddress || '',
        full_name: `${cu.firstName || ''} ${cu.lastName || ''}`.trim() || appUser?.full_name || 'Unknown',
        role: appUser?.role || 'user',
        allowed_areas: appUser?.allowed_areas || [],
        created_at: cu.createdAt,
        image_url: cu.imageUrl,
        clerk_id: cu.id,
      }
    })

    const clerkEmails = new Set(clerkUsers.map((cu: any) => cu.emailAddresses[0]?.emailAddress))
    const orphanedUsers = appUsers?.filter((au: any) => !clerkEmails.has(au.email)) || []

    return NextResponse.json([...mergedUsers, ...orphanedUsers])
  } catch (err: any) {
    console.error('GET users error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const debugLog: any[] = []
  
  try {
    const body = await req.json()
    const { email, full_name, role, allowed_areas } = body

    debugLog.push({ step: 'received', email, full_name, role })

    // Validate
    if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    if (!email.includes('@')) return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    if (!full_name?.trim()) return NextResponse.json({ error: 'Full name is required' }, { status: 400 })

    // Check if email already exists
    const client = await clerkClient()
    try {
      const existingUsers = await client.users.getUserList({ emailAddress: [email] })
      if (existingUsers.data.length > 0) {
        return NextResponse.json(
          { error: `Email "${email}" already exists in Clerk.` },
          { status: 409 }
        )
      }
    } catch (checkErr: any) {
      debugLog.push({ step: 'email_check_error', error: checkErr.message })
    }

    const nameParts = full_name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Generate username from email (required by Clerk instance settings)
    const username = email.split('@')[0] + Math.floor(Math.random() * 999)
    
    // Generate password
    const tempPassword = `Pepea@${Math.random().toString(36).slice(2, 8)}${Math.floor(Math.random() * 9999)}!X7`
    debugLog.push({ step: 'password_generated', passwordLength: tempPassword.length })

    // Build Clerk payload - MUST include username, firstName, lastName
    const clerkPayload: any = {
      emailAddress: [email],
      username: username,
      password: tempPassword,
      firstName: firstName || 'User',
      lastName: lastName || 'Pepea',
    }

    debugLog.push({ step: 'clerk_payload', payload: { ...clerkPayload, password: '***hidden***' } })

    // Create user in Clerk
    let clerkUser
    try {
      clerkUser = await client.users.createUser(clerkPayload)
      debugLog.push({ step: 'clerk_success', userId: clerkUser.id })
    } catch (clerkErr: any) {
      debugLog.push({ 
        step: 'clerk_error', 
        error: clerkErr.message,
        errors: clerkErr.errors,
        status: clerkErr.status,
        clerkTraceId: clerkErr.clerkTraceId,
      })
      
      return NextResponse.json({
        error: `Clerk Error: ${clerkErr.message}`,
        debug: debugLog,
      }, { status: 422 })
    }

    // Add to app_users table
    const { data: appUser, error } = await supabaseAdmin
      .from('app_users')
      .insert({
        id: clerkUser.id,
        email,
        full_name,
        role: role || 'editor',
        allowed_areas: allowed_areas || [],
      })
      .select()
      .single()

    if (error) {
      debugLog.push({ step: 'supabase_error', error: error.message })
      try { await client.users.deleteUser(clerkUser.id) } catch (e) {}
      return NextResponse.json({ error: `Database Error: ${error.message}`, debug: debugLog }, { status: 500 })
    }

    debugLog.push({ step: 'complete' })

    return NextResponse.json({
      ...appUser,
      clerk_id: clerkUser.id,
      temp_password: tempPassword,
      debug: debugLog,
    }, { status: 201 })
  } catch (err: any) {
    debugLog.push({ step: 'unexpected_error', error: err.message, stack: err.stack })
    console.error('Create user error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create user', debug: debugLog }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, role, allowed_areas, full_name } = body

    const updateData: any = {}
    if (role) updateData.role = role
    if (allowed_areas) updateData.allowed_areas = allowed_areas
    if (full_name) updateData.full_name = full_name

    const { data, error } = await supabaseAdmin
      .from('app_users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const client = await clerkClient()
    try { await client.users.deleteUser(id) } catch (e: any) {
      console.log('Clerk delete error:', e.message)
    }

    const { error } = await supabaseAdmin.from('app_users').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete user' }, { status: 500 })
  }
}
