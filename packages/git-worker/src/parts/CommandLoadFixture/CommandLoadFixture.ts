import { commandInit } from '../CommandInit/CommandInit.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import { toFileSystemPath } from '../ToFileSystemPath/ToFileSystemPath.ts'

const gitInit = async (): Promise<void> => {
  await commandInit()
}

const getWorkspaceFolder = async (): Promise<string> => {
  return Rpc.invoke('Config.getWorkspaceFolder')
}

const getGitPath = async (): Promise<string> => {
  const gitPaths = await Rpc.invoke('Config.getGitPaths')
  return gitPaths[0]
}

const resolvePath = async (path: string): Promise<string> => {
  const folder = await getWorkspaceFolder()
  if (!path) {
    return folder
  }
  return `${folder}/${path}`
}

const touch = async (fileName: string): Promise<void> => {
  const path = await resolvePath(fileName)
  await Rpc.invoke('FileSystem.writeFile', path, '')
}

const mkdir = async (pathName: string): Promise<void> => {
  const path = await resolvePath(pathName)
  await Rpc.invoke('FileSystem.mkdir', path)
}

const writeFile = async (pathName: string, content: string): Promise<void> => {
  const path = await resolvePath(pathName)
  await Rpc.invoke('FileSystem.writeFile', path, content)
}

const exec = async (cwd: string, command: string, args: readonly string[]): Promise<void> => {
  const absoluteCwd = await resolvePath(cwd)
  await Rpc.invoke('Exec.exec', command, args, {
    cwd: absoluteCwd,
  })
}

const git = async (cwd: string, args: readonly string[]): Promise<void> => {
  const gitPath = await getGitPath()
  await exec(cwd, gitPath, args)
}

const clone = async (repositoryPath: string, targetPath: string): Promise<void> => {
  const repositoryAbsolutePath = toFileSystemPath(await resolvePath(repositoryPath))
  const targetAbsolutePath = toFileSystemPath(await resolvePath(targetPath))
  const folder = toFileSystemPath(await getWorkspaceFolder())
  const gitPath = await getGitPath()
  await Rpc.invoke('Exec.exec', gitPath, ['clone', repositoryAbsolutePath, targetAbsolutePath], {
    cwd: folder,
  })
}

const setConfig = async (cwd: string, key: string, value: string): Promise<void> => {
  await git(cwd, ['config', key, value])
}

type FixtureAction =
  | Readonly<{ type: 'git-init'; cwd?: string; initialBranch?: string }>
  | Readonly<{ type: 'touch'; fileName?: string }>
  | Readonly<{ type: 'mkdir'; path: string }>
  | Readonly<{ type: 'write-file'; path: string; content: string }>
  | Readonly<{ type: 'git'; cwd: string; args: readonly string[] }>
  | Readonly<{ type: 'git-clone'; repositoryPath: string; targetPath: string }>
  | Readonly<{ type: 'git-config'; cwd: string; key: string; value: string }>

const executeAction = async (action: FixtureAction): Promise<void> => {
  switch (action.type) {
    case 'git':
      return git(action.cwd, action.args)
    case 'git-clone':
      return clone(action.repositoryPath, action.targetPath)
    case 'git-config':
      return setConfig(action.cwd, action.key, action.value)
    case 'git-init':
      if (action.cwd || action.initialBranch) {
        const args = ['init']
        if (action.initialBranch) {
          args.push('--initial-branch', action.initialBranch)
        }
        await git(action.cwd ?? '', args)
        return
      }
      return gitInit()
    case 'mkdir':
      return mkdir(action.path)
    case 'touch':
      return touch(action.fileName ?? '')
    case 'write-file':
      return writeFile(action.path, action.content)
    default:
      return
  }
}

const executeActions = async (actions: readonly FixtureAction[]): Promise<void> => {
  for (const action of actions) {
    await executeAction(action)
  }
}

export const commandLoadFixture = async (fixtureUrl: string): Promise<void> => {
  const importUrl = `${fixtureUrl}/git.js`
  const module = await import(importUrl)
  const { actions } = module
  await executeActions(actions)
}
