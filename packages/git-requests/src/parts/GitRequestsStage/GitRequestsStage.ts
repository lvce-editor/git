import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const stage = async ({ cwd, exec, file, gitPath }) => {
  try {
    const args = ['add', file]
    const gitResult = await exec({
      args,
      cwd,
      gitPath,
      name: 'stage',
    })
  } catch (error) {
    throw new GitError(error, 'stage')
  }
}
