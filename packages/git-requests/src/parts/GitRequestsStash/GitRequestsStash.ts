import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any, message?: string }} options
 */
export const stash = async ({ cwd, exec, gitPath, message = '' }) => {
  try {
    const args = ['stash', 'push']
    if (message) {
      args.push('--message', message)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'stash',
    })
  } catch (error) {
    throw new GitError(error, 'stash')
  }
}
