import type { GitTagRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const deleteRemoteTag = async ({ cwd, exec, gitPath, tag }: GitTagRequest): Promise<void> => {
  try {
    await exec({
      args: ['push', 'origin', `:refs/tags/${tag}`],
      cwd,
      gitPath,
      name: 'deleteRemoteTag',
    })
  } catch (error) {
    throw new GitError(error, 'deleteRemoteTag')
  }
}
