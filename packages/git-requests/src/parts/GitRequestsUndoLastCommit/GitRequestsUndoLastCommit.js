import { GitError } from '../GitError/GitError.js'
import * as GitRequestsUnstageAll from '../GitRequestsUnstageAll/GitRequestsUnstageAll.js'
import * as IsGitNoPreviousCommitError from '../IsGitNoPreviousCommitError/IsGitNoPreviousCommitError.js'

const undoLastCommitFallback = async ({ cwd, gitPath, exec }) => {
  await exec({
    args: ['update-ref', '-d', 'HEAD'],
    name: 'undoLastCommit/fallback',
    cwd,
    gitPath,
  })
  await GitRequestsUnstageAll.unstageAll({ cwd, gitPath, exec })
}

/**
 *
 * @param {{cwd:string,gitPath:string, exec:any  }} options
 */
export const undoLastCommit = async ({ cwd, gitPath, exec }) => {
  try {
    try {
      await exec({
        args: ['reset', '--soft', 'HEAD~1'],
        name: 'undoLastCommit/default',
        cwd,
        gitPath,
      })
    } catch (error) {
      if (IsGitNoPreviousCommitError.isGitNoRepositoryError(error)) {
        await undoLastCommitFallback({ cwd, gitPath, exec })
      } else {
        throw error
      }
    }
  } catch (error) {
    throw new GitError(error, 'undoLastCommit')
  }
}
