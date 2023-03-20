import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string,gitPath:string, file:string }} options
 */
export const discard = async ({ cwd, gitPath, file }) => {
  try {
    const gitResult = await Git.exec({
      args: ['clean', '-f', '-q', file],
      cwd,
      gitPath,
      name: 'discard',
    })
  } catch (error) {
    throw new GitError(error, 'discard')
  }
}
