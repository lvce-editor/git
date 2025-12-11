import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath: string, exec:any }} options
 */
export const getBranchNames = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['branch', '-a'],
      cwd,
      name: 'getBranchNames',
      gitPath,
    })
    const branchNames = gitResult.stdout.split('\n')
    return branchNames
  } catch (error) {
    throw new GitError(error, 'getBranchNames')
  }
}
