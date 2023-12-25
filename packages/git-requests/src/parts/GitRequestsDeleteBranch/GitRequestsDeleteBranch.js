import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string,gitPath:string, name:string, exec:any }} options
 */
export const deleteBranch = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['branch', '-d'],
      cwd,
      gitPath,
      name: 'deleteBranch',
    })
  } catch (error) {
    throw new GitError(error, 'deleteBranch')
  }
}
