import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string }} options
 */
export const unstage = async ({ cwd, gitPath, file }) => {
  try {
    const args = ['rm', '--cached', file]
    const gitResult = await Git.exec({
      args,
      name: 'unstage',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'unstage')
  }
}
