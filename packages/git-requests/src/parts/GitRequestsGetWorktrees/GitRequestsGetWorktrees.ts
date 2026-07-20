import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

const worktreePrefix = 'worktree '

export const getWorktrees = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<readonly string[]> => {
  try {
    const gitResult = await exec({
      args: ['worktree', 'list', '--porcelain', '-z'],
      cwd,
      gitPath,
      name: 'getWorktrees',
    })
    return gitResult.stdout
      .split('\0')
      .filter((line) => line.startsWith(worktreePrefix))
      .map((line) => line.slice(worktreePrefix.length))
  } catch (error) {
    throw new GitError(error, 'getWorktrees')
  }
}
