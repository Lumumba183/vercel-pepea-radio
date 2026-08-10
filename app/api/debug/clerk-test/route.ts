import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET() {
  const results: any[] = []
  const testPassword = `Test@${Math.random().toString(36).slice(2, 10)}!X9`

  const client = await clerkClient()

  // Test 1: With all required fields (username, firstName, lastName)
  const email1 = `test-${Date.now()}@example.com`
  const username1 = `user${Date.now()}`
  try {
    const user = await client.users.createUser({
      emailAddress: [email1],
      username: username1,
      password: testPassword,
      firstName: 'Test',
      lastName: 'User',
    })
    results.push({ test: 'all_required_fields', success: true, userId: user.id, email: email1 })
    await client.users.deleteUser(user.id)
  } catch (err: any) {
    results.push({ test: 'all_required_fields', success: false, error: err.message, errors: err.errors })
  }

  // Test 2: With username but empty lastName (should fail)
  const email2 = `test2-${Date.now()}@example.com`
  try {
    const user = await client.users.createUser({
      emailAddress: [email2],
      username: `user2${Date.now()}`,
      password: testPassword,
      firstName: 'Test',
    } as any)
    results.push({ test: 'missing_lastName', success: true, userId: user.id })
    await client.users.deleteUser(user.id)
  } catch (err: any) {
    results.push({ test: 'missing_lastName', success: false, error: err.message, errors: err.errors })
  }

  return NextResponse.json({
    message: 'Clerk createUser test results',
    timestamp: new Date().toISOString(),
    clerkSecretPresent: !!process.env.CLERK_SECRET_KEY,
    results,
  })
}
