import type { GitRefRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const checkout = async ({
  create = false,
  cwd,
  exec,
  gitPath,
  ref,
  track = false,
}: GitRefRequest & { readonly create?: boolean; readonly track?: boolean }): Promise<void> => {
  try {
    let args
    if (track) {
      args = ['checkout', '--track', ref]
    } else if (create) {
      args = ['checkout', '-b', ref]
    } else {
      args = ['checkout', ref]
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'checkout',
    })
  } catch (error) {
    throw new GitError(error, 'checkout')
  }
}
