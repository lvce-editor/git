const windowsPathRegex = /^\/[A-Za-z]:\//

export const toFileSystemPath = (path: string): string => {
  if (!path.startsWith('file://')) {
    return path
  }
  const fileSystemPath = decodeURIComponent(path.slice('file://'.length))
  return windowsPathRegex.test(fileSystemPath) ? fileSystemPath.slice(1) : fileSystemPath
}
