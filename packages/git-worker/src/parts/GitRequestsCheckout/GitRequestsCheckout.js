import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string, ref:string, gitPath:string  }} options
 */
export const checkout = async ({ cwd, gitPath, ref }) => {
  try {
    const gitResult = await Git.exec({
      args: ['checkout', ref],
      cwd,
      gitPath,
      name: 'checkout',
    })
  } catch (error) {
    throw new GitError(error, 'checkout')
  }
}
