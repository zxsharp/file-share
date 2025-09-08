import { NextRequest, NextResponse } from 'next/server'
import { cleanupExpiredFiles } from '@/services/cleanup'

export async function GET(request: NextRequest) {
  // auth token to only allow cron to trigger this end point
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("cron ran.....");
  const count = await cleanupExpiredFiles()
  return NextResponse.json({ deleted: count }) 
}