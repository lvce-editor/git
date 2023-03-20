import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string  }} options
 */
export const stageAll = async ({ cwd, gitPath }) => {
  try {
    const args = ['add', '.']
    const gitResult = await Git.exec({
      args,
      name: 'stageAll',
      cwd,
      gitPath,
    })
  } catch (error) {
    throw new GitError(error, 'stageAll')
  }
}
