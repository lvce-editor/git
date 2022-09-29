import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string}} options
 */
export const sync = async ({ cwd, gitPath }) => {
  try {
    await Git.exec({
      args: ['pull', '--rebase'],
      cwd,
      gitPath,
      name: 'sync/pullAndRebase',
    })
    console.log('finished pull rebase')
    await Git.exec({
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
