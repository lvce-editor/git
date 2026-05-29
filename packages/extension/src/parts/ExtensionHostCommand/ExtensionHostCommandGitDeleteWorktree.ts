import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitDeleteWorktree

export const execute = async (worktreePath) => {
  return GitWorker.invoke(GitWorkerCommandType.GitDeleteWorktree, { worktreePath })
}
