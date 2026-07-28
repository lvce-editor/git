const getActionLabel = (incoming: number, outgoing: number, upstream: string): string => {
  if (incoming && outgoing) {
    return `Pull ${incoming} and push ${outgoing} commits between ${upstream}`
  }
  if (incoming) {
    return `Pull ${incoming} commits from ${upstream}`
  }
  if (outgoing) {
    return `Push ${outgoing} commits to ${upstream}`
  }
  return 'Synchronize Changes'
}

export const getSyncAriaLabel = (repositoryName: string, incoming: number, outgoing: number, upstream: string, spinning: boolean): string => {
  const actionLabel = spinning ? 'Synchronizing Changes...' : getActionLabel(incoming, outgoing, upstream)
  return `${repositoryName} (Git) - ${actionLabel}`
}
