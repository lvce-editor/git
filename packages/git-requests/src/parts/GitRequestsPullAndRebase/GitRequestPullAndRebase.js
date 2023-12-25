import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any }} options
 */
export const pullAndRebase = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['pull', '--rebase'],
      cwd,
      gitPath,
      name: 'pullAndRebase',
    })
  } catch (error) {
    throw new GitError(error, 'pullAndRebase')
  }
}
