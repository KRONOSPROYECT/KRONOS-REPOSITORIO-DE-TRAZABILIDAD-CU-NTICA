export function signOffline(payload: string): string { 
  return `OFFLINE-SIG_${payload.slice(0,16)}_${Date.now()}` 
}
export function verifyOffline(payload: string, sig: string): boolean {
  return sig.startsWith("OFFLINE-SIG_")
}
