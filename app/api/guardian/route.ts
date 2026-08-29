import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest){
  try{
    const { entity_type, entity_id, action, metadata } = await req.json()
    // Verifica sesión superadmin
    const authHeader = req.headers.get('cookie')
    const supabaseAuth = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { headers: { Cookie: authHeader || '' } } } as any)
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if(!user) return NextResponse.json({error:'No auth'}, {status:401})

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data: profile } = await supabaseAdmin.from('profiles').select('role,status').eq('id', user.id).single()
    if(profile?.role!=='superadmin' || profile?.status!=='active') return NextResponse.json({error:'Forbidden'}, {status:403})

    // Cadena hash
    const { data: last } = await supabaseAdmin.from('audit_events').select('event_hash').order('id',{ascending:false}).limit(1).single()
    const previous_hash = last?.event_hash || null
    const raw = `${user.id}${entity_type}${entity_id}${action}${JSON.stringify(metadata)}${previous_hash}${new Date().toISOString()}`
    const event_hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)).then(b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''))

    const { error } = await supabaseAdmin.from('audit_events').insert({ actor_id: user.id, entity_type, entity_id, action, metadata, previous_hash, event_hash })
    if(error) return NextResponse.json({error:error.message},{status:500})
    return NextResponse.json({ok:true, event_hash})
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500}) }
}
