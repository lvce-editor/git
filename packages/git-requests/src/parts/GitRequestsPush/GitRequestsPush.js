import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath:string, exec:any }} options
 */
export const push = async ({ cwd, gitPath, exec }) => {
  try {
    await Git.exec({
      args: ['push', '--porcelain'],
      cwd,
      gitPath,
      name: 'push',
    })
    console.log('finished')
  } catch (error) {
    throw new GitError(error, 'push')
  }
}
