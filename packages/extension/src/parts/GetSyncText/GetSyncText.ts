export const getSyncText = (incoming: number, outgoing: number): string => {
  const parts: string[] = []
  if (incoming) {
    parts.push(`${incoming}↓`)
  }
  if (outgoing) {
    parts.push(`${outgoing}↑`)
  }
  return parts.join(' ')
}
