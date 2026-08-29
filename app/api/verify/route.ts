import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
export async function GET(req: NextRequest, {params}:{params:{folio:string}}){
  if(!rateLimit(req)) return NextResponse.json({error:'Too many'},{status:429})
  const folio = req.nextUrl.searchParams.get('folio') || 'KRN-2026-0042'
  const isOriginal = !folio.includes('0043')
  return NextResponse.json({ folio, status: isOriginal ? 'ORIGINAL VERIFICADO' : 'CLON INVALIDADO', tx: '0x8ca8...f3a2', timestamp: new Date().toISOString() })
}
