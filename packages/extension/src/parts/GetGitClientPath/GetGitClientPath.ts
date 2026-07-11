const remotePrefix = '/remote/'
const runtimeExtensionPath = '/packages/extension/dist/'

export const getGitClientPath = (extensionUrl: string = import.meta.url): string => {
  const relativePath = extensionUrl.includes(runtimeExtensionPath) ? '../../node/src/gitClient.js' : '../node/src/gitClient.js'
  const gitClientUrl = new URL(relativePath, extensionUrl)
  const pathname = decodeURIComponent(gitClientUrl.pathname)
  const gitClientPath = /^\/[A-Za-z]:\//.test(pathname) ? pathname.slice(1) : pathname
  return gitClientPath.startsWith(remotePrefix) ? gitClientPath.slice('/remote'.length) : gitClientPath
}
