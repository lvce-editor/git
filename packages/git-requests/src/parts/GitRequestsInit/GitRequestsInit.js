import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath: string, exec:any }} options
 */
export const init = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['init'],
      cwd,
      gitPath,
      name: 'init',
    })
  } catch (error) {
    throw new GitError(error, 'init')
  }
}
