import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const sync = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    await exec({
      args: ['pull', '--rebase'],
      cwd,
      gitPath,
      name: 'sync/pullAndRebase',
    })
    await exec({
      args: ['push'],
      cwd,
      gitPath,
      name: 'sync/push',
    })
  } catch (error) {
    throw new GitError(error, 'sync')
  }
}
