import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitAddAll

export const execute = async () => {
  await GitWorker.invoke('Git.addAll')
}
