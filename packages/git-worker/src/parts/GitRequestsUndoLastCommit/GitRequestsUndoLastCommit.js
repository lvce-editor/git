import * as Git from '../Git/Git.js'
import { GitError } from '../GitError/GitError.js'
import * as GitRequestsUnstageAll from '../GitRequestsUnstageAll/GitRequestsUnstageAll.js'
import * as IsGitNoPreviousCommitError from '../IsGitNoPreviousCommitError/IsGitNoPreviousCommitError.js'

const undoLastCommitFallback = async ({ cwd, gitPath }) => {
  await Git.exec({
    args: ['update-ref', '-d', 'HEAD'],
    name: 'undoLastCommit/fallback',
    cwd,
    gitPath,
  })
  await GitRequestsUnstageAll.unstageAll({ cwd, gitPath })
}

/**
 *
 * @param {{cwd:string,gitPath:string  }} options
 */
export const undoLastCommit = async ({ cwd, gitPath }) => {
  try {
    try {
      await Git.exec({
        args: ['reset', '--soft', 'HEAD~1'],
        name: 'undoLastCommit/default',
        cwd,
        gitPath,
      })
    } catch (error) {
      if (IsGitNoPreviousCommitError.isGitNoRepositoryError(error)) {
        await undoLastCommitFallback({ cwd, gitPath })
      } else {
        throw error
      }
    }
  } catch (error) {
    throw new GitError(error, 'undoLastCommit')
  }
}
