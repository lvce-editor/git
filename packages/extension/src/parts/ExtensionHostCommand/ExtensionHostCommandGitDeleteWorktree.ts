import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitDeleteWorktree

export const execute = async (worktreePath) => {
  return GitWorker.invoke(GitWorkerCommandType.GitDeleteWorktree, { worktreePath })
}
