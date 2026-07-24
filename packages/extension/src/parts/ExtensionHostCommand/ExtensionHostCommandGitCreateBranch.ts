import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'
import * as QuickPick from '../QuickPick/QuickPick.ts'

export const id = CommandId.GitCreateBranch

export const execute = async (): Promise<unknown> => {
  const name = await QuickPick.showInput('Branch name')
  if (typeof name !== 'string' || name === '') {
    return undefined
  }
  return GitWorker.invoke(GitWorkerCommandType.GitBranch, { name })
}
