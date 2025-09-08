import { NextResponse } from 'next/server'
import { cleanupExpiredFiles } from '@/services/cleanup'

export async function GET() {
  console.log("cron ran.....");
  const count = await cleanupExpiredFiles()
  return NextResponse.json({ deleted: count }) 
}