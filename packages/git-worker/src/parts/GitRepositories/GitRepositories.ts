import * as GitFind from '../GitFind/GitFind.ts'
import * as GitRepositoryState from '../GitRepositoryState/GitRepositoryState.ts'
import * as Rpc from '../Rpc/Rpc.ts'

// TODO getCurrent shouldn't have side effect of mutating state

export const getCurrent = async () => {
  const path = await Rpc.invoke('Config.getWorkspaceFolder')
  if (!path) {
    throw new Error('no workspace folder is open')
    // throw new VError('no repository path found')
  }
  const git = await GitFind.findGit(path)
  if (!git) {
    throw new Error('git binary not found')
  }
  GitRepositoryState.setRepository({
    gitPath: git.path,
    gitVersion: git.version,
    path,
  })
  return {
    gitPath: git.path,
    gitVersion: git.version,
    path,
  }
}
