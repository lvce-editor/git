import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, message:string, gitPath:string }} options
 */
export const addAllAndCommit = async ({ cwd, gitPath, message }) => {
  try {
    await Git.exec({
      args: ['add', '.'],
      cwd,
      gitPath,
      name: 'addAllAndCommit/add',
    })
    await Git.exec({
      args: ['commit', '-m', message],
      cwd,
      gitPath,
      name: 'addAllAndCommit/commit',
    })
    try {
      await Git.exec({
        args: ['push'],
        cwd,
        gitPath,
        name: 'addAllAndCommit/push',
      })
    } catch (error) {
      if (
        error &&
        error instanceof Error &&
        error.message.includes('No configured push destination')
      ) {
        // ignore
      } else {
        throw error
      }
    }
  } catch (error) {
    throw new GitError(error, 'addAllAndCommit')
  }
}
