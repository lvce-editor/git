import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const stage = async ({ cwd, gitPath, file, exec }) => {
  try {
    const args = ['add', file]
    const gitResult = await exec({
      args,
      name: 'stage',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'stage')
  }
}
