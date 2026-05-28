import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath: string, exec:any, ref: string }} options
 */
export const merge = async ({ cwd, exec, gitPath, ref }) => {
  try {
    await exec({
      args: ['merge', ref],
      cwd,
      name: 'merge',
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'merge')
  }
}
