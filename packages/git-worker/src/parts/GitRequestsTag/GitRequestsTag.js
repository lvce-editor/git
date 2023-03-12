import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath: string,  tag: string}} options
 */
export const tag = async ({ cwd, gitPath, tag }) => {
  try {
    const gitResult = await Git.exec({
      args: ['tag', tag],
      cwd,
      gitPath,
      name: 'tag',
    })
  } catch (error) {
    throw new GitError(error, 'tag')
  }
}
