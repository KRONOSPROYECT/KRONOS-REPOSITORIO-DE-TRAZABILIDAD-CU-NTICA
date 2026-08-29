export type Kodice = { folio: string, hash: string, timestamp: string, tx?: string }
export function generarFolio(): string { return `KRN-${new Date().getFullYear()}-${Math.floor(1000+Math.random()*9000)}` }
