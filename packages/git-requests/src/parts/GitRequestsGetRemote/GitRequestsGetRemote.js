import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd: string, gitPath: string, exec:any }} options
 */
export const getRemote = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['config', '--get', 'remote.origin.url'],
      cwd,
      gitPath,
      name: 'init',
    })
  } catch (error) {
    throw new GitError(error, 'remote')
  }
}
