import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'
import * as GitArgs from '../GitArgs/GitArgs.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string }} options
 */
export const add = async ({ cwd, gitPath, file }) => {
  try {
    const gitResult = await Git.exec({
      args: GitArgs.add({ file }),
      name: 'add',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'add')
  }
}
