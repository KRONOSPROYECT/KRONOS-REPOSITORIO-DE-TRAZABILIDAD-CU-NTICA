"use client"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'superadmin' | 'usuario' | 'demo'
  status: 'active' | 'suspended' | 'revoked'
  demo_expires_at: string | null
  created_at: string
}

export default function AdminUsersPage(){
  const [users, setUsers] = useState<Profile[]>([])
  const [filter, setFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  async function load(){
    setLoading(true)
    let query = supabase.from('profiles').select('*').order('created_at', {ascending: false})
    if(roleFilter!=='all') query = query.eq('role', roleFilter)
    if(statusFilter!=='all') query = query.eq('status', statusFilter)
    const { data } = await query
    if(data){
      let filtered = data
      if(filter) filtered = filtered.filter(u=>u.email.toLowerCase().includes(filter.toLowerCase()))
      setUsers(filtered as any)
    }
    setLoading(false)
  }

  useEffect(()=>{ load() }, [roleFilter, statusFilter])

  async function updateUser(userId: string, prev: Profile, patch: Partial<Profile>){
    // 1. Actualiza perfil
    const { error } = await supabase.from('profiles').update({...patch, updated_at: new Date().toISOString()}).eq('id', userId)
    if(error){ alert(error.message); return }

    // 2. Crea evento Guardian encadenado vía API segura (service_role)
    const res = await fetch('/api/guardian', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        entity_type: 'user',
        entity_id: userId,
        action: 'ACCESS_POLICY_UPDATED',
        metadata: {
          previous_role: prev.role,
          new_role: patch.role || prev.role,
          previous_status: prev.status,
          new_status: patch.status || prev.status,
          demo_expires_at: patch.demo_expires_at || prev.demo_expires_at,
          changed_by: 'superadmin'
        }
      })
    })
    if(!res.ok){ console.error('Guardian error') }
    load()
  }

  if(loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#FFD700]">CARGANDO USUARIOS...</div>

  return (
    <div className="min-h-screen bg-[#050505] p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-[#FFD700] mb-2">PANEL SUPERADMIN - USUARIOS</h1>
        <p className="text-gray-500 text-sm mb-6">SafeCreative 2607086319439 | Auditoría encadenada activa</p>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6 bg-[#111] p-4 rounded-xl border border-white/5">
          <input placeholder="Buscar por email..." value={filter} onChange={e=>setFilter(e.target.value)} className="bg-black border border-[#FFD700]/20 p-2 rounded text-sm w-64" />
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="bg-black border border-white/10 p-2 rounded text-sm"><option value="all">Todos los roles</option><option value="superadmin">superadmin</option><option value="usuario">usuario</option><option value="demo">demo</option></select>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-black border border-white/10 p-2 rounded text-sm"><option value="all">Todos los estados</option><option value="active">active</option><option value="suspended">suspended</option><option value="revoked">revoked</option></select>
          <button onClick={load} className="bg-[#FFD700] text-black px-4 py-2 rounded text-sm font-bold">Buscar</button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-[#111] border border-white/5 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-black/50 text-gray-400"><tr><th className="p-3 text-left">Email</th><th className="p-3">Rol</th><th className="p-3">Estado</th><th className="p-3">Demo expira</th><th className="p-3">Alta</th><th className="p-3">Acciones</th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="p-3"><div className="font-mono text-white">{u.email}</div><div className="text-[10px] text-gray-500">{u.id.slice(0,8)}...</div></td>
                  <td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${u.role==='superadmin'?'bg-[#FFD700] text-black':u.role==='demo'?'bg-[#00FFFF]/20 text-[#00FFFF]':'bg-white/10'}`}>{u.role}</span></td>
                  <td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${u.status==='active'?'bg-green-500/20 text-green-400':u.status==='suspended'?'bg-yellow-500/20 text-yellow-400':'bg-red-500/20 text-red-400'}`}>{u.status}</span></td>
                  <td className="p-3 text-center text-xs">{u.demo_expires_at? new Date(u.demo_expires_at).toLocaleDateString() : '-'}</td>
                  <td className="p-3 text-center text-[11px] text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-3 flex flex-wrap gap-1 justify-center">
                    {u.status!=='active' && <button onClick={()=>updateUser(u.id, u, {status:'active'})} className="bg-green-500 text-black px-2 py-1 rounded text-[10px] font-bold">ACTIVAR</button>}
                    {u.status==='active' && <button onClick={()=>updateUser(u.id, u, {status:'suspended'})} className="bg-yellow-500 text-black px-2 py-1 rounded text-[10px] font-bold">SUSPENDER</button>}
                    <button onClick={()=>updateUser(u.id, u, {status:'revoked'})} className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold">REVOCAR</button>
                    {u.role!=='demo' && <button onClick={()=>updateUser(u.id, u, {role:'demo', demo_expires_at: new Date(Date.now()+7*24*3600*1000).toISOString()})} className="bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/30 px-2 py-1 rounded text-[10px]">A DEMO 7D</button>}
                    {u.role!=='usuario' && <button onClick={()=>updateUser(u.id, u, {role:'usuario', demo_expires_at: null})} className="bg-white/10 px-2 py-1 rounded text-[10px]">A USUARIO</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
