import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string, gitPath: string, exec:any }} options
 */
export const getBranchNames = async ({ cwd, exec, gitPath }) => {
  try {
    const gitResult = await exec({
      args: ['branch', '-a'],
      cwd,
      gitPath,
      name: 'getBranchNames',
    })
    const branchNames = gitResult.stdout.split('\n')
    return branchNames
  } catch (error) {
    throw new GitError(error, 'getBranchNames')
  }
}
