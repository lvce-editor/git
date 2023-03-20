import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string }} options
 */
export const unstageAll = async ({ cwd, gitPath, file }) => {
  try {
    const args = ['rm', '--cached', '.']
    const gitResult = await Git.exec({
      args,
      name: 'unstageAll',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'unstageAll')
  }
}
