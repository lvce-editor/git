import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string, gitPath:string }} options
 */
export const addAll = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['add', '.'],
      cwd,
      gitPath,
      name: 'addAll',
    })
  } catch (error) {
    throw new GitError(error, 'addAll')
  }
}
