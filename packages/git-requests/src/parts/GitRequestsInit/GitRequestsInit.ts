import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string, gitPath: string, exec:any, bare?: boolean, initialBranch?: string }} options
 */
export const init = async ({ bare = false, cwd, exec, gitPath, initialBranch = '' }) => {
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
