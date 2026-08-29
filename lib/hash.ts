export async function sha256(data: string): Promise<string> {
  const msg = new TextEncoder().encode(data)
  const hash = await crypto.subtle.digest('SHA-256', msg)
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('')
}
