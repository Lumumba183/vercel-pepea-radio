import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: {} as any,
  }

  // Check 1: CLERK_SECRET_KEY exists
  const hasSecretKey = !!process.env.CLERK_SECRET_KEY
  results.checks.clerk_secret_key = {
    present: hasSecretKey,
    prefix: hasSecretKey ? process.env.CLERK_SECRET_KEY?.slice(0, 10) + '...' : 'MISSING',
  }

  if (!hasSecretKey) {
    results.error = 'CLERK_SECRET_KEY is not set in environment variables'
    return NextResponse.json(results, { status: 500 })
  }

  // Check 2: Can we connect to Clerk?
  try {
    const client = await clerkClient()
    const userList = await client.users.getUserList({ limit: 1 })
    results.checks.clerk_connection = {
      ok: true,
      user_count: userList.data.length,
      total_count: userList.totalCount,
    }
  } catch (err: any) {
    results.checks.clerk_connection = {
      ok: false,
      error: err.message,
      errors: err.errors,
    }
    results.error = `Clerk connection failed: ${err.message}`
    return NextResponse.json(results, { status: 500 })
  }

  // Check 3: Can we list users?
  try {
    const client = await clerkClient()
    const allUsers = await client.users.getUserList({ limit: 10 })
    results.checks.user_list = {
      ok: true,
      count: allUsers.data.length,
      emails: allUsers.data.map((u: any) => u.emailAddresses[0]?.emailAddress).filter(Boolean),
    }
  } catch (err: any) {
    results.checks.user_list = {
      ok: false,
      error: err.message,
    }
  }

  results.status = 'All checks passed'
  return NextResponse.json(results)
}
