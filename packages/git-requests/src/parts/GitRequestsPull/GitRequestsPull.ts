import { GitError } from '../GitError/GitError.ts'
import type { GitRequestContext } from '../Types/Types.ts'

export const pull = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    await exec({
      args: ['pull'],
      cwd,
      gitPath,
      name: 'pull',
    })
  } catch (error) {
    throw new GitError(error, 'pull')
  }
}
