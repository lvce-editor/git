import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as Rpc from '../Rpc/Rpc.ts'

type WorktreePick = {
  readonly description: string
  readonly label: string
  readonly worktreePath: string
}

const getBaseName = (path: string): string => {
  let normalizedPath = path.replaceAll('\\', '/')
  while (normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1)
  }
  const index = normalizedPath.lastIndexOf('/')
  return normalizedPath.slice(index + 1)
}

const getWorktreePicks = (worktrees: readonly string[], currentWorktree: string): readonly WorktreePick[] => {
  return worktrees
    .filter((worktreePath) => worktreePath !== currentWorktree)
    .map((worktreePath) => ({
      description: worktreePath,
      label: getBaseName(worktreePath),
      worktreePath,
    }))
}

export const commandDeleteWorktreeSelect = async (): Promise<string | undefined> => {
  const repository = await Repositories.getCurrent()
  const { gitPath, path } = repository
  const worktrees = await GitRepositoriesRequests.execute({
    args: {
      cwd: path,
      exec: Git.exec,
      gitPath,
    },
    fn: GitRequests.getWorktrees,
    id: 'getWorktrees',
  })
  const picks = getWorktreePicks(worktrees, path)
  const selectedPick = await Rpc.invoke('QuickPick.show', picks)
  if (!selectedPick) {
    return
  }
  const { worktreePath } = selectedPick
  await GitRepositoriesRequests.execute({
    args: {
      cwd: path,
      exec: Git.exec,
      gitPath,
      worktreePath,
    },
    fn: GitRequests.deleteWorktree,
    id: 'deleteWorktree',
  })
  return worktreePath
}
