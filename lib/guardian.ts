export async function guardianLog(event: string, folio: string) {
  console.log(`[GUARDIAN] ${event} - ${folio} - ${new Date().toISOString()}`)
}
