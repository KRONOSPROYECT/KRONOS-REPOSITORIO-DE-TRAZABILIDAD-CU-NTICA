const map = new Map()
export function rateLimit(req: any, limit=20) {
  const ip = req.ip || 'anon'
  const now = Date.now()
  const entry = map.get(ip) || { count: 0, time: now }
  if (now - entry.time > 60000) { entry.count=0; entry.time=now }
  entry.count++; map.set(ip, entry)
  return entry.count <= limit
}
