import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd: string, gitPath: string}} options
 */
export const getRemote = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['config', '--get', 'remote.origin.url'],
      cwd,
      gitPath,
      name: 'init',
    })
  } catch (error) {
    throw new GitError(error, 'remote')
  }
}
