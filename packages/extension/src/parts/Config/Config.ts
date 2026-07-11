import {
  confirm,
  exists as fileSystemExists,
  getPreference,
  getWorkspaceFolder as getWorkspaceFolderFromApi,
  handleWorkspaceRefresh as handleWorkspaceRefreshFromApi,
  mkdir as makeDirectory,
  openUri as openUriFromApi,
  readDirWithFileTypes,
  readFile as readFileFromApi,
  remove as removeFromApi,
  stat as statFromApi,
  writeFile,
} from '@lvce-editor/api'

export const getWorkspaceFolder = () => {
  return getWorkspaceFolderFromApi()
}

const toFileSystemPath = (value: string): string => {
  if (!value.startsWith('file://')) {
    return value
  }
  const url = new URL(value)
  const path = decodeURIComponent(url.pathname)
  if (url.hostname) {
    return `//${url.hostname}${path}`
  }
  return /^\/[A-Za-z]:/.test(path) ? path.slice(1) : path
}

export const getGitPaths = async () => {
  const configuredGitPath = await getPreference('git.path')
  if (typeof configuredGitPath === 'string' && configuredGitPath) {
    return [toFileSystemPath(configuredGitPath)]
  }
  return ['git']
}

export const confirmDiscard = async () => {
  return getPreference('git.confirmDiscard')
}

export const showErrorMessage = async () => {
  return getPreference('git.showErrorMessage')
}

export const exists = async (uri) => {
  try {
    return await fileSystemExists(uri)
  } catch {
    return false
  }
}

export const mkdir = async (uri) => {
  return makeDirectory(uri)
}

export const remove = async (uri) => {
  await removeFromApi(uri)
}

export const write = async (uri, content) => {
  return writeFile(uri, content)
}
export const readFile = async (uri) => {
  return readFileFromApi(uri)
}

export const readDir = async (uri) => {
  return readDirWithFileTypes(uri)
}

export const stat = async (uri) => {
  return statFromApi(uri)
}

export const confirmPrompt = async (message) => {
  return confirm(message)
}

export const handleWorkspaceRefresh = async () => {
  await handleWorkspaceRefreshFromApi()
}

export const openUri = async (uri) => {
  await openUriFromApi(uri)
}
