import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'
import * as GitRequestsUnstageAll from '../GitRequestsUnstageAll/GitRequestsUnstageAll.ts'
import * as IsGitNoPreviousCommitError from '../IsGitNoPreviousCommitError/IsGitNoPreviousCommitError.ts'

const undoLastCommitFallback = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  await exec({
    args: ['update-ref', '-d', 'HEAD'],
    cwd,
    gitPath,
    name: 'undoLastCommit/fallback',
  })
  await GitRequestsUnstageAll.unstageAll({ cwd, exec, gitPath })
}

export const undoLastCommit = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  try {
    try {
      await exec({
        args: ['reset', '--soft', 'HEAD~1'],
        cwd,
        gitPath,
        name: 'undoLastCommit/default',
      })
    } catch (error) {
      if (IsGitNoPreviousCommitError.isGitNoRepositoryError(error)) {
        await undoLastCommitFallback({ cwd, exec, gitPath })
      } else {
        throw error
      }
    }
  } catch (error) {
    throw new GitError(error, 'undoLastCommit')
  }
}
