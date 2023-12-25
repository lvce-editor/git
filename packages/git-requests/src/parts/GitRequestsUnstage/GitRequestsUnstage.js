import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const unstage = async ({ cwd, gitPath, file, exec }) => {
  try {
    const args = ['rm', '--cached', file]
    const gitResult = await exec({
      args,
      name: 'unstage',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'unstage')
  }
}
