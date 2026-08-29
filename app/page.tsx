import Link from 'next/link'
export default function Home(){
  return <div className="min-h-screen flex flex-col items-center justify-center p-6">
    <h1 className="text-5xl font-black text-[#FFD700]">KRONOS 360</h1>
    <p className="text-gray-400 mt-4">+1,000 FOLIOS VERIFICADOS - KERNEL OFFLINE 72</p>
    <div className="mt-8 flex gap-4"><Link href="/login" className="bg-[#FFD700] text-black px-6 py-3 rounded font-bold">ENTRAR</Link><Link href="/verify/KRN-2026-0042" className="border border-[#00FFFF] text-[#00FFFF] px-6 py-3 rounded">VER DEMO ORIGINAL</Link></div>
  </div>
}
