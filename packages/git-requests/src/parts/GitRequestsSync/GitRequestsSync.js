import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any }} options
 */
export const sync = async ({ cwd, gitPath, exec }) => {
  try {
    await exec({
      args: ['pull', '--rebase'],
      cwd,
      gitPath,
      name: 'sync/pullAndRebase',
    })
    console.log('finished pull rebase')
    await exec({
      args: ['push'],
      cwd,
      gitPath,
      name: 'sync/push',
    })
  } catch (error) {
    console.log('error git sync')
    throw new GitError(error, 'sync')
  }
}
