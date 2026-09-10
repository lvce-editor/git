import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitCreateBranch

export const execute = async (): Promise<unknown> => {
  const name = await GitWorker.invoke('Command.gitGetNewBranchName')
  if (typeof name !== 'string' || name === '') {
    return undefined
  }
  return GitWorker.invoke(GitWorkerCommandType.GitBranch, { name })
}
