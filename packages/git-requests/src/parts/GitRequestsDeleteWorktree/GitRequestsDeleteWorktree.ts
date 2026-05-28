import type { GitWorktreeRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

const toFileSystemPath = (path: string): string => {
  if (path.startsWith('file://')) {
    return path.slice('file://'.length)
  }
  return path
}

export const deleteWorktree = async ({ cwd, exec, gitPath, worktreePath }: GitWorktreeRequest): Promise<void> => {
  try {
    const absoluteWorktreePath = toFileSystemPath(worktreePath)
    await exec({
      args: ['worktree', 'remove', absoluteWorktreePath],
      cwd,
      gitPath,
      name: 'deleteWorktree',
    })
  } catch (error) {
    throw new GitError(error, 'deleteWorktree')
  }
}
