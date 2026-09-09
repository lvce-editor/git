import { toFileSystemPath } from '../ToFileSystemPath/ToFileSystemPath.ts'

export interface WorkspaceUris {
  readonly remoteWorkspaceUri: string
  readonly workspaceUri: string
}

const parseRemoteUri = (uri: string): URL => {
  const url = new URL(uri)
  if (url.protocol !== 'remote-ssh:' || !url.hostname || url.password || url.search || url.hash) {
    throw new Error(`Invalid remote workspace URI: ${uri}`)
  }
  if (decodeURIComponent(url.pathname).includes('\0')) {
    throw new Error('Remote workspace path must not contain a null byte')
  }
  return url
}

export const toRemoteUri = (uri: string, workspaceUri = uri): string => {
  if (!uri.startsWith('remote-ssh://')) {
    return uri
  }
  const url = parseRemoteUri(uri)
  const workspace = parseRemoteUri(workspaceUri)
  if (url.host !== workspace.host || url.username !== workspace.username) {
    throw new Error('Git resource belongs to a different remote workspace host')
  }
  return `file://${url.pathname}`
}

// Explorer resource strings may contain unescaped filename characters. Keep
// workspace validation strict, but encode the path of these known file inputs.
export const toResourceUri = (uri: string, workspaceUri: string): string => {
  const remote = uri.startsWith('remote-ssh://')
  if (!remote && !uri.startsWith('file://')) {
    return uri
  }
  const pathIndex = uri.indexOf('/', uri.indexOf('://') + 3)
  if (pathIndex === -1) {
    return toRemoteUri(uri, workspaceUri)
  }
  const root = toRemoteUri(`${uri.slice(0, pathIndex)}/`, workspaceUri)
  const path = uri
    .slice(pathIndex + 1)
    .split('/')
    .map((segment) => {
      const escaped = segment.replaceAll(/%(?![\dA-Fa-f]{2})/g, '%25')
      return encodeURIComponent(decodeURIComponent(escaped))
    })
    .join('/')
  return `${root}${path}`
}

export const getWorkspaceUris = (workspaceUri: string): WorkspaceUris => ({
  remoteWorkspaceUri: toRemoteUri(workspaceUri),
  workspaceUri,
})

export const toGitPath = (uri: string, workspaceUri: string): string => {
  return toFileSystemPath(toRemoteUri(uri, workspaceUri))
}

export const toRelativePath = (uri: string, workspaceUri: string): string => {
  if (!uri.startsWith('remote-ssh://') && !uri.startsWith('file://')) {
    return uri
  }
  const normalize = (path: string): string => (workspaceUri.startsWith('remote-ssh://') ? path : path.replaceAll('\\', '/'))
  const path = normalize(toGitPath(toResourceUri(uri, workspaceUri), workspaceUri))
  const root = normalize(toGitPath(workspaceUri, workspaceUri)).replace(/\/$/, '')
  if (path === root) {
    return '.'
  }
  if (!path.startsWith(`${root}/`)) {
    throw new Error('Git resource is outside the repository')
  }
  return path.slice(root.length + 1)
}

export const toWorkspaceUri = (path: string, workspaceUri: string): string => {
  if (!workspaceUri.startsWith('remote-ssh://')) {
    return path
  }
  const workspace = parseRemoteUri(workspaceUri)
  const nativePath = toFileSystemPath(path)
  const absolutePath = nativePath.startsWith('/') ? nativePath : `${decodeURIComponent(workspace.pathname).replace(/\/$/, '')}/${nativePath}`
  workspace.pathname = absolutePath.split('/').map(encodeURIComponent).join('/')
  return workspace.href
}
