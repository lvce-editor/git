import { GitError } from '../GitError/GitError.ts'
import type { GitFileRequest } from '../Types/Types.ts'

export const stage = async ({ cwd, exec, file, gitPath }: GitFileRequest): Promise<void> => {
  try {
    const args = ['add', file]
    await exec({
      args,
      cwd,
      gitPath,
      name: 'stage',
    })
  } catch (error) {
    throw new GitError(error, 'stage')
  }
}
