import type { GitUnstashRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const unstash = async ({ cwd, exec, gitPath, stashReference = '' }: GitUnstashRequest): Promise<void> => {
  try {
    const args = ['stash', 'pop']
    if (stashReference) {
      args.push(stashReference)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'unstash',
    })
  } catch (error) {
    throw new GitError(error, 'unstash')
  }
}
