import type { GitTagRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const tag = async ({ cwd, exec, gitPath, tag }: GitTagRequest): Promise<void> => {
  try {
    await exec({
      args: ['tag', tag],
      cwd,
      gitPath,
      name: 'tag',
    })
  } catch (error) {
    throw new GitError(error, 'tag')
  }
}
