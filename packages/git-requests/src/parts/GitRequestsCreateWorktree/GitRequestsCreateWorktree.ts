import type { GitWorktreeRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const createWorktree = async ({ cwd, exec, gitPath, ref, worktreePath }: GitWorktreeRequest): Promise<void> => {
  try {
    await exec({
      args: ref ? ['worktree', 'add', worktreePath, ref] : ['worktree', 'add', worktreePath],
      cwd,
      gitPath,
      name: 'createWorktree',
    })
  } catch (error) {
    throw new GitError(error, 'createWorktree')
  }
}
