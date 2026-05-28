import type { GitRemoteRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const addRemote = async ({ cwd, exec, gitPath, name, url }: GitRemoteRequest): Promise<void> => {
  try {
    await exec({
      args: ['remote', 'add', name, url],
      cwd,
      gitPath,
      name: 'addRemote',
    })
  } catch (error) {
    throw new GitError(error, 'addRemote')
  }
}
