import { NextRequest, NextResponse } from "next/server"
import { sha256 } from "@/lib/hash"
import { generarFolio } from "@/lib/kodice"
import { guardianLog } from "@/lib/guardian"
export async function POST(req: NextRequest){
  const { content } = await req.json()
  const hash = await sha256(content || "test")
  const folio = generarFolio()
  await guardianLog("REGISTER", folio)
  return NextResponse.json({ folio, hash, status: "ORIGINAL VERIFICADO" })
}
