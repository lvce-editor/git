import type { GitTagRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const deleteTag = async ({ cwd, exec, gitPath, tag }: GitTagRequest): Promise<void> => {
  try {
    await exec({
      args: ['tag', '-d', tag],
      cwd,
      gitPath,
      name: 'deleteTag',
    })
  } catch (error) {
    throw new GitError(error, 'deleteTag')
  }
}
