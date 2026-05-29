import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitFetch

export const execute = async () => {
  return GitWorker.invoke('Command.gitFetch')
}
