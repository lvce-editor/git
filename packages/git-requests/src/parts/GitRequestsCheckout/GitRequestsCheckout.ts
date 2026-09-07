import type { GitRefRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const checkout = async ({ create = false, cwd, exec, gitPath, ref }: GitRefRequest & { readonly create?: boolean }): Promise<void> => {
  try {
    await exec({
      args: create ? ['checkout', '-b', ref] : ['checkout', ref],
      cwd,
      gitPath,
      name: 'checkout',
    })
  } catch (error) {
    throw new GitError(error, 'checkout')
  }
}
