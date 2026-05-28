import type { GitInitRequest } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const init = async ({ bare = false, cwd, exec, gitPath, initialBranch = '' }: GitInitRequest): Promise<void> => {
  try {
    const args = ['init']
    if (bare) {
      args.push('--bare')
    }
    if (initialBranch) {
      args.push('--initial-branch', initialBranch)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'init',
    })
  } catch (error) {
    throw new GitError(error, 'init')
  }
}
