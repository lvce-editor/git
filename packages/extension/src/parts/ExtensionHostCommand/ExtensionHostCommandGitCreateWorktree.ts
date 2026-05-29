import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitCreateWorktree

export const execute = async (worktreePath, ref) => {
  return GitWorker.invoke(GitWorkerCommandType.GitCreateWorktree, { ref, worktreePath })
}
