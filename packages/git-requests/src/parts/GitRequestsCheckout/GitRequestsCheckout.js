import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string, ref:string, gitPath:string, exec:any   }} options
 */
export const checkout = async ({ cwd, gitPath, ref, exec }) => {
  try {
    const gitResult = await exec({
      args: ['checkout', ref],
      cwd,
      gitPath,
      name: 'checkout',
    })
  } catch (error) {
    throw new GitError(error, 'checkout')
  }
}
