const toPath = (uri: string): string => {
  if (!uri.startsWith('file://')) {
    return uri
  }
  const url = new URL(uri)
  const path = decodeURIComponent(url.pathname)
  if (url.hostname) {
    return `//${url.hostname}${path}`
  }
  return /^\/[A-Za-z]:/.test(path) ? path.slice(1) : path
}

export const getRelativePath = (workspaceUri: string, documentUri: string): string | undefined => {
  const workspacePath = toPath(workspaceUri).replaceAll('\\', '/').replace(/\/$/, '')
  const documentPath = toPath(documentUri).replaceAll('\\', '/')
  if (documentPath === workspacePath) {
    return '.'
  }
  const prefix = `${workspacePath}/`
  if (!documentPath.startsWith(prefix)) {
    return undefined
  }
  return documentPath.slice(prefix.length)
}
