import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const getCurrentBranch = (cwd: string): Promise<string> => {
  return GitWorker.invoke(GitWorkerCommandType.GitGetCurrentBranch, { cwd })
}
