import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const pullAndRebase = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['pull', '--rebase'],
      cwd,
      gitPath,
      name: 'pullAndRebase',
    })
  } catch (error) {
    throw new GitError(error, 'pullAndRebase')
  }
}
