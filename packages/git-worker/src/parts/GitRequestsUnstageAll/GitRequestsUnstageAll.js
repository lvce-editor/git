import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string,gitPath:string }} options
 */
export const unstageAll = async ({ cwd, gitPath }) => {
  try {
    const args = ['rm', '--cached', '-r', '.']
    const gitResult = await Git.exec({
      args,
      name: 'unstageAll',
      cwd,
      gitPath,
    })
  } catch (error) {
    if (
      error &&
      error instanceof Error &&
      error.message.includes(`fatal: pathspec '.' did not match any files`)
    ) {
      return
    }
    throw new GitError(error, 'unstageAll')
  }
}
