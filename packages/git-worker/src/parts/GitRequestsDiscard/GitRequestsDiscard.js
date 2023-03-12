import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string,gitPath:string, file:string }} options
 */
export const discard = async ({ cwd, gitPath, file }) => {
  try {
    const gitResult = await Git.exec({
      args: ['branch', '-d'],
      cwd,
      gitPath,
      name: 'deleteBranch',
    })
  } catch (error) {
    throw new GitError(error, 'deleteBranch')
  }
}
