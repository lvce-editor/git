import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const cleanAll = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    await exec({
      args: ['restore', '--', '.'],
      cwd,
      gitPath,
      name: 'cleanAll',
    })
    await exec({
      args: ['clean', '-fd'],
      cwd,
      gitPath,
      name: 'cleanAll',
    })
  } catch (error) {
    throw new GitError(error, 'cleanAll')
  }
}
