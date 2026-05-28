import { GitError } from '../GitError/GitError.ts'
import type { GitMessageRequest } from '../Types/Types.ts'

export const commit = async ({ cwd, exec, gitPath, message }: GitMessageRequest): Promise<void> => {
  try {
    await exec({
      args: ['commit', '-m', message],
      cwd,
      gitPath,
      name: 'commit',
    })
  } catch (error) {
    throw new GitError(error, 'commit')
  }
}
