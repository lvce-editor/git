import type { GitNameRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const branch = async ({ cwd, exec, gitPath, name }: GitNameRequest): Promise<void> => {
  try {
    await exec({
      args: ['branch', name],
      cwd,
      gitPath,
      name: 'branch',
    })
  } catch (error) {
    throw new GitError(error, 'branch')
  }
}
