import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string,gitPath:string, name:string}} options
 */
export const deleteBranch = async ({ cwd, gitPath }) => {
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
