import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

// This endpoint tests different Clerk createUser parameter combinations
// to find which one works
export async function GET() {
  const results: any[] = []
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = `Test@${Math.random().toString(36).slice(2, 10)}!X9`

  const client = await clerkClient()

  // Test 1: Minimal - just email + password
  try {
    const user = await client.users.createUser({
      emailAddress: [testEmail],
      password: testPassword,
    })
    results.push({ test: 'minimal_email_password', success: true, userId: user.id })
    // Clean up
    await client.users.deleteUser(user.id)
  } catch (err: any) {
    results.push({ test: 'minimal_email_password', success: false, error: err.message, errors: err.errors })
  }

  // Test 2: With firstName only
  try {
    const user = await client.users.createUser({
      emailAddress: [`test2-${Date.now()}@example.com`],
      password: testPassword,
      firstName: 'Test',
    })
    results.push({ test: 'with_firstName', success: true, userId: user.id })
    await client.users.deleteUser(user.id)
  } catch (err: any) {
    results.push({ test: 'with_firstName', success: false, error: err.message, errors: err.errors })
  }

  // Test 3: With firstName + lastName
  try {
    const user = await client.users.createUser({
      emailAddress: [`test3-${Date.now()}@example.com`],
      password: testPassword,
      firstName: 'Test',
      lastName: 'User',
    })
    results.push({ test: 'with_firstName_lastName', success: true, userId: user.id })
    await client.users.deleteUser(user.id)
  } catch (err: any) {
    results.push({ test: 'with_firstName_lastName', success: false, error: err.message, errors: err.errors })
  }

  // Test 4: Using emailAddresses (plural) instead of emailAddress
  try {
    const user = await client.users.createUser({
      emailAddresses: [`test4-${Date.now()}@example.com`],
      password: testPassword,
      firstName: 'Test',
    } as any)
    results.push({ test: 'emailAddresses_plural', success: true, userId: user.id })
    await client.users.deleteUser(user.id)
  } catch (err: any) {
    results.push({ test: 'emailAddresses_plural', success: false, error: err.message, errors: err.errors })
  }

  return NextResponse.json({
    message: 'Clerk createUser test results',
    timestamp: new Date().toISOString(),
    clerkSecretPresent: !!process.env.CLERK_SECRET_KEY,
    results,
  })
}
