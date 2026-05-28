import type { GitRefRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const merge = async ({ cwd, exec, gitPath, ref }: GitRefRequest): Promise<void> => {
  try {
    await exec({
      args: ['merge', ref],
      cwd,
      gitPath,
      name: 'merge',
    })
  } catch (error) {
    throw new GitError(error, 'merge')
  }
}
