import { GitError } from '../GitError/GitError.js'

/**
 * @param {{cwd:string,gitPath:string, file:string, exec:any }} options
 */
export const discard = async ({ cwd, gitPath, file, exec }) => {
  try {
    const gitResult = await exec({
      args: ['clean', '-f', '-q', file],
      cwd,
      gitPath,
      name: 'discard',
    })
  } catch (error) {
    throw new GitError(error, 'discard')
  }
}
