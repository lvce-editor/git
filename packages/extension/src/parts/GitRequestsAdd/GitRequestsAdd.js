import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string }} options
 */
export const add = async ({ cwd, gitPath, file }) => {
  console.log('git add')
  try {
    const gitResult = await Git.exec({
      args: ['add', file],
      name: 'add',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'add')
  }
}
