import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath: string}} options
 */
export const init = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['init'],
      cwd,
      gitPath,
      name: 'init',
    })
  } catch (error) {
    throw new GitError(error, 'init')
  }
}
