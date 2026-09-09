import * as GitFind from '../GitFind/GitFind.ts'
import * as GitStates from '../GitStates/GitStates.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import { getWorkspaceUris, type WorkspaceUris } from '../WorkspaceUris/WorkspaceUris.ts'

// TODO getCurrent shouldn't have side effect of mutating state

export const getCurrent = async (): Promise<WorkspaceUris & { gitPath: string; gitVersion: string; path: string }> => {
  const path = await Rpc.invoke('Config.getWorkspaceFolder')
  if (!path) {
    throw new Error('no workspace folder is open')
    // throw new VError('no repository path found')
  }
  const workspaceUris = getWorkspaceUris(path)
  const existingState = GitStates.get(path)
  if (existingState) {
    GitStates.ensureRepository(path, path)
    return {
      ...workspaceUris,
      gitPath: existingState.gitPath,
      gitVersion: existingState.parsedGitVersion,
      path,
    }
  }
  const git = await GitFind.findGit(workspaceUris.remoteWorkspaceUri)
  if (!git) {
    throw new Error('git binary not found')
  }
  GitStates.set(path, {
    gitPath: git.path,
    gitRepositories: [{ groups: [], uri: path }],
    parsedGitVersion: git.parsedVersion,
    rawGitVersion: git.rawVersion,
  })
  return {
    ...workspaceUris,
    gitPath: git.path,
    gitVersion: git.parsedVersion,
    path,
  }
}
