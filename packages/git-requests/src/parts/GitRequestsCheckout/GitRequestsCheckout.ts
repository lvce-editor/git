import type { GitRefRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const checkout = async ({ cwd, exec, gitPath, ref }: GitRefRequest): Promise<void> => {
  try {
    await exec({
      args: ['checkout', ref],
      cwd,
      gitPath,
      name: 'checkout',
    })
  } catch (error) {
    throw new GitError(error, 'checkout')
  }
}
