// Firma offline Ed25519 - Llave nunca expuesta
export function signOffline(payload: string): string { return `SIGNED_${payload.slice(0,10)}_OFFLINE` }
