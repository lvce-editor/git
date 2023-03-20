import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string  }} options
 */
export const undoLastCommit = async ({ cwd, gitPath }) => {
  try {
    const args = ['reset', '--soft', 'HEAD~']
    const gitResult = await Git.exec({
      args,
      name: 'undoLastCommit',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'undoLastCommit')
  }
}
