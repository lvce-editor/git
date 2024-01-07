const getIconRoot = () => {
  // @ts-ignore
  const originLength = location.origin.length
  const uri = import.meta.url.slice(originLength)
  const parts = uri.split('/')
  const relevantParts = parts.slice(0, -5)
  return relevantParts.join('/') + '/extension'
}

export const iconRoot = getIconRoot() + '/icons/dark'
