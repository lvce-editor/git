import { GitError } from '../GitError/GitError.ts'
import type { GitRequestContext } from '../Types/Types.ts'

export const addAll = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    await exec({
      args: ['add', '.'],
      cwd,
      gitPath,
      name: 'addAll',
    })
  } catch (error) {
    throw new GitError(error, 'addAll')
  }
}
