import { GitError } from '../GitError/GitError.ts'
import type { GitRequestContext } from '../Types/Types.ts'

export const stageAll = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    const args = ['add', '.']
    await exec({
      args,
      cwd,
      gitPath,
      name: 'stageAll',
    })
  } catch (error) {
    throw new GitError(error, 'stageAll')
  }
}
