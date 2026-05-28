import type { GitStashRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const stash = async ({ cwd, exec, gitPath, message = '' }: GitStashRequest): Promise<void> => {
  try {
    const args = ['stash', 'push']
    if (message) {
      args.push('--message', message)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'stash',
    })
  } catch (error) {
    throw new GitError(error, 'stash')
  }
}
