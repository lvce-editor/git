import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any  }} options
 */
export const getCurrentBranch = async ({ cwd, gitPath, exec }) => {
  let gitResult
  try {
    gitResult = await exec({
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
