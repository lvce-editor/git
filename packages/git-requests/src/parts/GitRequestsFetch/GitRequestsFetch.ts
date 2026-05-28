import { GitError } from '../GitError/GitError.ts'
import type { GitRequestContext } from '../Types/Types.ts'

export const fetch = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    await exec({
      args: ['fetch', '--all'],
      cwd,
      gitPath,
      name: 'fetch',
    })
  } catch (error) {
    throw new GitError(error, 'fetch')
  }
}
