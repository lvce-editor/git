const remotePrefix = '/remote/'

export const getGitClientPath = (extensionUrl: string = import.meta.url): string => {
  const gitClientUrl = new URL('../node/src/gitClient.js', extensionUrl)
  const gitClientPath = decodeURIComponent(gitClientUrl.pathname)
  return gitClientPath.startsWith(remotePrefix) ? gitClientPath.slice('/remote'.length) : gitClientPath
}
