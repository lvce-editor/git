import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const getDefaultCommitMessage = (cwd: string): Promise<string> => {
  return GitWorker.invoke(GitWorkerCommandType.GitGetDefaultCommitMessage, { cwd })
}
