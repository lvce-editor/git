import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any }} options
 */
export const fetch = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['fetch', '--all'],
      cwd,
      gitPath,
      name: 'fetch',
    })
  } catch (error) {
    throw new GitError(error, 'fetch')
  }
}
