import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitCreateWorktree

export const execute = async (worktreePath, ref) => {
  return GitWorker.invoke(GitWorkerCommandType.GitCreateWorktree, { ref, worktreePath })
}
