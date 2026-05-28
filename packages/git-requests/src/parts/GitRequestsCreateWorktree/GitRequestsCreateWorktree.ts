import type { GitWorktreeRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

const toFileSystemPath = (path: string): string => {
  if (path.startsWith('file://')) {
    return path.slice('file://'.length)
  }
  return path
}

export const createWorktree = async ({ cwd, exec, gitPath, ref, worktreePath }: GitWorktreeRequest): Promise<void> => {
  try {
    const absoluteWorktreePath = toFileSystemPath(worktreePath)
    await exec({
      args: ref ? ['worktree', 'add', absoluteWorktreePath, ref] : ['worktree', 'add', absoluteWorktreePath],
      cwd,
      gitPath,
      name: 'createWorktree',
    })
  } catch (error) {
    throw new GitError(error, 'createWorktree')
  }
}
