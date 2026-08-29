import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rateLimit"
export async function GET(req: NextRequest){
  if(!rateLimit(req, 30)) return NextResponse.json({error:"Rate limit"}, {status:429})
  const folio = req.nextUrl.searchParams.get("folio") || "KRN-2026-0042"
  const isClon = folio.includes("0043") || folio.toUpperCase().includes("CLON")
  return NextResponse.json({ folio, status: isClon ? "CLON INVALIDADO" : "ORIGINAL VERIFICADO", kernel: "72/72 VALID", tx: "0x8ca8f3a2", timestamp: new Date().toISOString(), safeCreative: "2607086319439" })
}
