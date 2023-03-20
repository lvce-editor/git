import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string }} options
 */
export const stage = async ({ cwd, gitPath, file }) => {
  try {
    const args = ['add', file]
    const gitResult = await Git.exec({
      args,
      name: 'stage',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'stage')
  }
}
