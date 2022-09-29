import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string, gitPath:string }} options
 */
export const getAddedFiles = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['diff', '--name-only', '--cached'],
      cwd,
      gitPath,
      name: 'getAddedFiles',
    })
  } catch (error) {
    throw new GitError(error, 'getAddedFiles')
  }
}
