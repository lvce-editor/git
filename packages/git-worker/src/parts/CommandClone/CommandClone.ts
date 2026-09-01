import * as Git from '../Git/Git.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import { toFileSystemPath } from '../ToFileSystemPath/ToFileSystemPath.ts'

const getRepositoryName = (repositoryUrl: string): string => {
  let normalizedUrl = repositoryUrl
  while (normalizedUrl.endsWith('/') || normalizedUrl.endsWith('\\')) {
    normalizedUrl = normalizedUrl.slice(0, -1)
  }
  const lastSeparatorIndex = Math.max(normalizedUrl.lastIndexOf('/'), normalizedUrl.lastIndexOf('\\'), normalizedUrl.lastIndexOf(':'))
  const lastSegment = normalizedUrl.slice(lastSeparatorIndex + 1)
  const repositoryName = lastSegment.endsWith('.git') ? lastSegment.slice(0, -4) : lastSegment
  if (!repositoryName) {
    throw new Error(`Unable to determine repository name from ${repositoryUrl}`)
  }
  return repositoryName
}

const joinPath = (parent: string, child: string): string => {
  if (parent.endsWith('/') || parent.endsWith('\\')) {
    return `${parent}${child}`
  }
  return `${parent}/${child}`
}

const getCloneLocation = async (): Promise<string> => {
  const configuredLocation = await Rpc.invoke('Config.getDefaultCloneLocation')
  if (typeof configuredLocation === 'string' && configuredLocation.trim()) {
    return toFileSystemPath(configuredLocation.trim())
  }
  const userDataDir = await Rpc.invoke('Platform.getUserDataDir')
  return joinPath(toFileSystemPath(userDataDir), 'Documents')
}

const ensureDirectory = async (uri: string): Promise<void> => {
  if (!(await Rpc.invoke('FileSystem.exists', uri))) {
    await Rpc.invoke('FileSystem.mkdir', uri)
  }
}

export const commandClone = async (): Promise<string | undefined> => {
  const input = await Rpc.invoke('QuickPick.showInput', 'Repository URL')
  if (typeof input !== 'string' || !input.trim()) {
    return undefined
  }

  const repositoryUrl = input.trim()
  const cloneLocation = await getCloneLocation()
  const targetPath = joinPath(cloneLocation, getRepositoryName(repositoryUrl))
  const gitPaths = await Rpc.invoke('Config.getGitPaths')
  const gitPath = gitPaths[0]

  await ensureDirectory(cloneLocation)
  await Git.exec({
    args: ['clone', repositoryUrl, targetPath],
    cwd: cloneLocation,
    gitPath,
  })
  await Rpc.invoke('Workspace.setWorkspaceUri', targetPath)
  return targetPath
}
