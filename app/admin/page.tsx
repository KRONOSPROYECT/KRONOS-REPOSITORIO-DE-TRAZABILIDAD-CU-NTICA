import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
export default async function AdminPage(){
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name){return cookieStore.get(name)?.value} } } as any)
  const { data: { user } } = await supabase.auth.getUser()
  if(user?.user_metadata?.role !== "superadmin") return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500">ACCESO DENEGADO - Solo superadmin</div>
  return <div className="min-h-screen bg-[#050505] p-8"><h1 className="text-3xl text-[#FFD700] font-black">PANEL SUPERADMIN</h1><p className="text-gray-400 mt-2">Aquí bloqueas morosos - licenseManager.ts</p><div className="mt-6 p-4 bg-[#111] border border-[#FFD700]/20 rounded">Usuario: {user?.email} | Rol: superadmin</div></div>
}
