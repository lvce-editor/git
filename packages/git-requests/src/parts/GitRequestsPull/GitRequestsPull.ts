import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string, gitPath: string, exec:any }} options
 */
export const pull = async ({ cwd, exec, gitPath }) => {
  try {
    const gitResult = await exec({
      args: ['pull'],
      cwd,
      gitPath,
      name: 'pull',
    })
  } catch (error) {
    throw new GitError(error, 'pull')
  }
}
