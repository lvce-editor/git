import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const getCurrentBranch = async ({ cwd, gitPath }) => {
  let gitResult
  try {
    gitResult = await Git.exec({
      args: ['branch', '--show-current'],
      cwd,
      gitPath,
      name: 'getCurrentBranch',
    })
  } catch (error) {
    throw new GitError(error, 'getCurrentBranch')
  }

  const branch = gitResult.stdout
  return branch
}
