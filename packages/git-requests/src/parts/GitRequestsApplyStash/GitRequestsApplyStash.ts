import type { GitApplyStashRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const applyStash = async ({ cwd, exec, gitPath, stashReference = '' }: GitApplyStashRequest): Promise<void> => {
  try {
    const args = ['stash', 'apply']
    if (stashReference) {
      args.push(stashReference)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'applyStash',
    })
  } catch (error) {
    throw new GitError(error, 'applyStash')
  }
}
