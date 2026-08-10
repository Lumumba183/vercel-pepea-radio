import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const client = await clerkClient()
    // Get users from Clerk
    const clerkUsersResponse = await client.users.getUserList({ limit: 500 })
    const clerkUsers = clerkUsersResponse.data

    // Get role data from app_users table
    const { data: appUsers, error } = await supabaseAdmin
      .from('app_users')
      .select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Merge Clerk users with app roles
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

    // Also include app_users that might not be in Clerk (edge case)
    const clerkEmails = new Set(clerkUsers.map((cu: any) => cu.emailAddresses[0]?.emailAddress))
    const orphanedUsers = appUsers?.filter((au: any) => !clerkEmails.has(au.email)) || []

    return NextResponse.json([...mergedUsers, ...orphanedUsers])
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, full_name, role, allowed_areas, password } = body

    // Split full name
    const nameParts = full_name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const client = await clerkClient()
    // Create user in Clerk
    const clerkUser = await client.users.createUser({
      emailAddress: [email],
      firstName,
      lastName,
      password: password || undefined,
      skipPasswordChecks: !password,
    })

    // Add to app_users table for role management
    const { data: appUser, error } = await supabaseAdmin
      .from('app_users')
      .insert({
        id: clerkUser.id,
        email,
        full_name,
        role,
        allowed_areas: allowed_areas || [],
      })
      .select()
      .single()

    if (error) {
      // Rollback: delete Clerk user if Supabase insert fails
      await client.users.deleteUser(clerkUser.id)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ...appUser, clerk_id: clerkUser.id }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, role, allowed_areas, full_name } = body

    // Update app_users table
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
    // Delete from Clerk first
    try {
      await client.users.deleteUser(id)
    } catch (clerkErr: any) {
      // User might not exist in Clerk, continue with Supabase deletion
      console.log('Clerk delete error (may not exist):', clerkErr.message)
    }

    // Delete from app_users
    const { error } = await supabaseAdmin.from('app_users').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete user' }, { status: 500 })
  }
}
