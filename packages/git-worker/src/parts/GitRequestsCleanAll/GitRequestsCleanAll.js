import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string }} options
 */
export const cleanAll = async ({ cwd, gitPath }) => {
  try {
    const args = ['clean', '--force', '.']
    const gitResult = await Git.exec({
      args,
      name: 'cleanAll',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'cleanAll')
  }
}
