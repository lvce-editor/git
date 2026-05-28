import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const pullAndRebase = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    await exec({
      args: ['pull', '--rebase'],
      cwd,
      gitPath,
      name: 'pullAndRebase',
    })
  } catch (error) {
    throw new GitError(error, 'pullAndRebase')
  }
}
