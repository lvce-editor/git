import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any }} options
 */
export const sync = async ({ cwd, exec, gitPath }) => {
  try {
    await exec({
      args: ['pull', '--rebase'],
      cwd,
      gitPath,
      name: 'sync/pullAndRebase',
    })
    await exec({
      args: ['push'],
      cwd,
      gitPath,
      name: 'sync/push',
    })
  } catch (error) {
    throw new GitError(error, 'sync')
  }
}
