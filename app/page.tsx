import Link from "next/link"
export default function Home(){
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505]">
      <h1 className="text-6xl font-black text-[#FFD700] tracking-tighter">KRONOS 360</h1>
      <p className="text-[#00FFFF] mt-2 tracking-widest text-sm">KERNEL OFFLINE 72 - BUNKER MK-III</p>
      <p className="text-gray-500 mt-4 text-center max-w-md">+1,000 Folios verificados. Sistema de trazabilidad cuántica offline con verificación Polygon.</p>
      <div className="mt-10 flex gap-4">
        <Link href="/login" className="bg-[#FFD700] text-black px-8 py-3 rounded-full font-black">ENTRAR AL KERNEL</Link>
        <Link href="/verify/KRN-2026-0042" className="border border-[#00FFFF] text-[#00FFFF] px-8 py-3 rounded-full">DEMO ORIGINAL</Link>
      </div>
    </div>
  )
}
