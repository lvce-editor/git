import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

export const id = CommandId.GitPull

type PullOptions = {
  readonly from?: readonly string[]
}

export const execute = (options: PullOptions = {}) => {
  return executeAndRefresh(options)
}

const executeAndRefresh = async (options: PullOptions): Promise<unknown> => {
  try {
    return await GitWorker.invoke('Command.gitPull', options)
  } finally {
    await StatusBarSync.refresh()
  }
}
