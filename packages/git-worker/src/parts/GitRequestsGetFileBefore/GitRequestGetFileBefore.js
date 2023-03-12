import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string}} options
 */
export const getFileBefore = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['show', `HEAD:${cwd}`],
      cwd,
      gitPath,
      name: 'getFileBefore',
    })
  } catch (error) {
    throw new GitError(error, 'getFileBefore')
  }
}
