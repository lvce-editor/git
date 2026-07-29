import type { GitNameRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const branch = async ({ cwd, exec, gitPath, name, startPoint }: GitNameRequest): Promise<void> => {
  if (typeof name !== 'string') {
    throw new TypeError('branch name must be a string')
  }
  try {
    const args = ['branch', name]
    if (startPoint) {
      args.push(startPoint)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'branch',
    })
  } catch (error) {
    throw new GitError(error, 'branch')
  }
}
