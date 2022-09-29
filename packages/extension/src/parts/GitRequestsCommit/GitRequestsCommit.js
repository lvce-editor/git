import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string, gitPath:string, message:string}} options
 */
export const commit = async ({ cwd, gitPath, message }) => {
  try {
    const gitResult = await Git.exec({
      args: ['commit', '-m', message],
      cwd,
      gitPath,
      name: 'commit',
    })
  } catch (error) {
    throw new GitError(error, 'commit')
  }
}
