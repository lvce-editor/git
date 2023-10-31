const getIconRoot = () => {
  const uri = import.meta.url
  const parts = uri.split('/')
  const relevantParts = parts.slice(0, -5)
  return relevantParts.join('/')
}

export const iconRoot = getIconRoot() + '/icons/dark'
