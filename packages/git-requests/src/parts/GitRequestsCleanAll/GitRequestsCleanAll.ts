import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string,gitPath:string, exec:any }} options
 */
export const cleanAll = async ({ cwd, exec, gitPath }) => {
  try {
    const args = ['restore', '--', '.']
    const gitResult = await exec({
      args,
      cwd,
      gitPath,
      name: 'cleanAll',
    })
  } catch (error) {
    throw new GitError(error, 'cleanAll')
  }
}
