import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitPull

type PullOptions = {
  readonly from?: readonly string[]
}

export const execute = (options: PullOptions = {}) => {
  return GitWorker.invoke('Command.gitPull', options)
}
