import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerPull from '../GitWorkerPull/GitWorkerPull.js'

export const id = CommandId.GitPull

export const execute = async () => {
  await GitWorkerPull.execute()
}
