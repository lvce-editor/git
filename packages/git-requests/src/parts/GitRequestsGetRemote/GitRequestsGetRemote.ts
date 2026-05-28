import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const getRemote = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    await exec({
      args: ['config', '--get', 'remote.origin.url'],
      cwd,
      gitPath,
      name: 'init',
    })
  } catch (error) {
    throw new GitError(error, 'remote')
  }
}
