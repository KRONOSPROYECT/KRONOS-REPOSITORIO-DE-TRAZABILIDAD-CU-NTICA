import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
export default async function Dashboard(){
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name){return cookieStore.get(name)?.value} } } as any)
  const { data: { user } } = await supabase.auth.getUser()
  return <div className="min-h-screen bg-[#050505] p-8"><h1 className="text-3xl text-[#FFD700] font-bold">Dashboard - Bienvenido {user?.email}</h1><p className="text-gray-400 mt-2">Aquí va tu listado de folios desde Supabase</p></div>
}
