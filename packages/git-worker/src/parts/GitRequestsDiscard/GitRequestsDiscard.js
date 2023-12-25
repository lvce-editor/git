import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'
import * as GitArgs from '../GitArgs/GitArgs.js'

/**
 * @param {{cwd:string,gitPath:string, file:string }} options
 */
export const discard = async ({ cwd, gitPath, file }) => {
  try {
    const gitResult = await Git.exec({
      args: GitArgs.discard({ file }),
      cwd,
      gitPath,
      name: 'discard',
    })
  } catch (error) {
    throw new GitError(error, 'discard')
  }
}
