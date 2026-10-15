export const toFileUri = (path: string): string => {
  const windowsPath = /^[A-Za-z]:[\\/]/.test(path) || path.startsWith('\\\\')
  const normalizedPath = windowsPath ? path.replaceAll('\\', '/') : path
  const encodedPath = encodeURI(normalizedPath).replaceAll('#', '%23').replaceAll('?', '%3F')
  if (normalizedPath.startsWith('//')) {
    return `file:${encodedPath}`
  }
  return `file://${normalizedPath.startsWith('/') ? '' : '/'}${encodedPath}`
}
