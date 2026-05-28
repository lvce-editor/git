import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const getAddedFiles = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    await exec({
      args: ['diff', '--name-only', '--cached'],
      cwd,
      gitPath,
      name: 'getAddedFiles',
    })
  } catch (error) {
    throw new GitError(error, 'getAddedFiles')
  }
}
