import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'
import * as GitArgs from '../GitArgs/GitArgs.js'

/**
 *
 * @param {{cwd:string, gitPath: string}} options
 */
export const init = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: GitArgs.init(),
      cwd,
      gitPath,
      name: 'init',
    })
  } catch (error) {
    throw new GitError(error, 'init')
  }
}
