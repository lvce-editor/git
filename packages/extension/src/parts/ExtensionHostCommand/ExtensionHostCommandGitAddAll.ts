import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitAddAll

export const execute = () => {
  return GitWorker.invoke('Command.gitAddAll')
}
