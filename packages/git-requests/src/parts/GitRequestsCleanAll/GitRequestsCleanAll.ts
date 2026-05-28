import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const cleanAll = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    const args = ['restore', '--', '.']
    await exec({
      args,
      cwd,
      gitPath,
      name: 'cleanAll',
    })
  } catch (error) {
    throw new GitError(error, 'cleanAll')
  }
}
