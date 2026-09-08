const toPath = (uri: string): string => {
  if (uri.startsWith('remote-ssh://')) {
    return decodeURIComponent(new URL(uri).pathname)
  }
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
  if (
    (workspaceUri.startsWith('remote-ssh://') || documentUri.startsWith('remote-ssh://')) &&
    (!workspaceUri.startsWith('remote-ssh://') ||
      !documentUri.startsWith('remote-ssh://') ||
      new URL(workspaceUri).host !== new URL(documentUri).host ||
      new URL(workspaceUri).username !== new URL(documentUri).username)
  ) {
    return undefined
  }
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
