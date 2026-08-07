import { NextResponse } from 'next/server'

export async function GET() {
  // Return the admin email so client can check against it
  // This is safe because it's just checking if current user matches
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
  return NextResponse.json({ adminEmail })
}
