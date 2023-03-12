const getRoot = () => {
  const uri = import.meta.url
  const parts = uri.split('/')
  const relevantParts = parts.slice(0, -5)
  return relevantParts.join('/')
}

const uri = getRoot() + '/extension/icons/dark'

export const Modified = `${uri}/status-modified.svg`
export const Added = `${uri}/status-added.svg`
export const Deleted = `${uri}/status-deleted.svg`
export const Renamed = `${uri}/status-renamed.svg`
export const Copied = `${uri}/status-copied.svg`
export const Untracked = `${uri}/status-untracked.svg`
export const Ignored = `${uri}/status-ignored.svg`
export const Conflict = `${uri}/status-conflict.svg`
