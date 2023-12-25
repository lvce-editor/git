import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath: string, exec:any }} options
 */
export const pull = async ({ cwd, gitPath, exec }) => {
  try {
    const gitResult = await exec({
      args: ['pull'],
      cwd,
      name: 'pull',
      gitPath,
    })
  } catch (error) {
    console.log({ error })
    throw new GitError(error, 'pull')
  }
}
