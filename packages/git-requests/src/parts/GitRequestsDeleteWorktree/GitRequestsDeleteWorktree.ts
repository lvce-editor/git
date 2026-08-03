import type { GitWorktreeRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'
import { toFileSystemPath } from '../ToFileSystemPath/ToFileSystemPath.ts'

const isMissingWorktreeError = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && 'stderr' in error && String(error.stderr).includes('is not a working tree')
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
    if (isMissingWorktreeError(error)) {
      return
    }
    throw new GitError(error, 'deleteWorktree')
  }
}
