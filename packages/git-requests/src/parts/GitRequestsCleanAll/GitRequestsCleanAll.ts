import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string,gitPath:string, exec:any }} options
 */
export const cleanAll = async ({ cwd, gitPath, exec }) => {
  try {
    const args = ['restore', '--', '.']
    const gitResult = await exec({
      args,
      name: 'cleanAll',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'cleanAll')
  }
}
