import type { GitRefRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const merge = async ({ cwd, exec, gitPath, ref }: GitRefRequest): Promise<void> => {
  try {
    await exec({
      args: ['merge', ref],
      cwd,
      name: 'merge',
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'merge')
  }
}
