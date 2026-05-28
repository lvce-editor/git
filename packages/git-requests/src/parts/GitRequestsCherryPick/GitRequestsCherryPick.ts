import type { GitRefRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const cherryPick = async ({ cwd, exec, gitPath, ref }: GitRefRequest): Promise<void> => {
  try {
    await exec({
      args: ['cherry-pick', ref],
      cwd,
      gitPath,
      name: 'cherry-pick',
    })
  } catch (error) {
    throw new GitError(error, 'cherry-pick')
  }
}
