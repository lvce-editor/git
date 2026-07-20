interface Ref {
  readonly name: string
  readonly remote: string
  readonly symbolicRef?: string
}

const getRemoteDefaultRef = (refs: readonly Ref[]): string => {
  const remoteHead = refs.find((ref) => ref.name === 'origin/HEAD') ?? refs.find((ref) => ref.name.endsWith('/HEAD'))
  return remoteHead?.symbolicRef || ''
}

const getLocalBranchName = (remoteRef: string): string => {
  const slashIndex = remoteRef.indexOf('/')
  return slashIndex === -1 ? remoteRef : remoteRef.slice(slashIndex + 1)
}

const findPreferredIndex = (refs: readonly Ref[]): number => {
  const remoteDefaultRef = getRemoteDefaultRef(refs)
  if (remoteDefaultRef) {
    const localDefaultBranch = getLocalBranchName(remoteDefaultRef)
    const localDefaultIndex = refs.findIndex((ref) => !ref.remote && ref.name === localDefaultBranch)
    if (localDefaultIndex !== -1) {
      return localDefaultIndex
    }
    const remoteDefaultIndex = refs.findIndex((ref) => ref.name === remoteDefaultRef)
    if (remoteDefaultIndex !== -1) {
      return remoteDefaultIndex
    }
  }

  const mainIndex = refs.findIndex((ref) => !ref.remote && ref.name === 'main')
  if (mainIndex !== -1) {
    return mainIndex
  }

  const remoteMainIndex = refs.findIndex((ref) => ref.remote && ref.name === `${ref.remote}/main`)
  if (remoteMainIndex !== -1) {
    return remoteMainIndex
  }

  const masterIndex = refs.findIndex((ref) => !ref.remote && ref.name === 'master')
  if (masterIndex !== -1) {
    return masterIndex
  }

  return refs.findIndex((ref) => ref.remote && ref.name === `${ref.remote}/master`)
}

export const prioritizeDefaultBranch = <T extends Ref>(refs: readonly T[]): readonly T[] => {
  const preferredIndex = findPreferredIndex(refs)
  if (preferredIndex <= 0) {
    return refs
  }
  return [refs[preferredIndex], ...refs.slice(0, preferredIndex), ...refs.slice(preferredIndex + 1)]
}
