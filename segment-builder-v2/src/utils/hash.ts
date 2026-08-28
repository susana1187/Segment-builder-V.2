export function hashSeed(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

export function estimateCpm(id: string, source?: string): number | undefined {
  if (source !== 'Marketplace Data') return undefined
  const seed = hashSeed(id)
  return 1 + (seed % 20) / 10
}
