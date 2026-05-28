import { GitError } from '../GitError/GitError.ts'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const add = async ({ cwd, exec, file, gitPath }) => {
  try {
    const gitResult = await exec({
      args: ['add', file],
      cwd,
      gitPath,
      name: 'add',
    })
  } catch (error) {
    throw new GitError(error, 'add')
  }
}
