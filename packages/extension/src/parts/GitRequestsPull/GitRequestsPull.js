import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, gitPath: string}} options
 */
export const pull = async ({ cwd, gitPath }) => {
  try {
    const gitResult = await Git.exec({
      args: ['pull'],
      cwd,
      name: 'pull',
      gitPath,
    })
  } catch (error) {
    console.log({ error })
    throw new GitError(error, 'pull')
  }
}
