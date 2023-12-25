import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const add = async ({ cwd, gitPath, file, exec }) => {
  try {
    const gitResult = await exec({
      args: ['add', file],
      name: 'add',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'add')
  }
}
