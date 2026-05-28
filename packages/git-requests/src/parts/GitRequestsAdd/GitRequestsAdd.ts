import type { GitFileRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const add = async ({ cwd, exec, file, gitPath }: GitFileRequest): Promise<void> => {
  try {
    await exec({
      args: ['add', file],
      cwd,
      gitPath,
      name: 'add',
    })
  } catch (error) {
    throw new GitError(error, 'add')
  }
}
