import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitSyncRebase

export const execute = () => {
  return GitWorker.invoke('Command.gitSync')
}
