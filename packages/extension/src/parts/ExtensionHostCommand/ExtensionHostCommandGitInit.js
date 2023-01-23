import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerInit from '../GitWorkerInit/GitWorkerInit.js'

export const id = CommandId.GitInit

export const execute = async () => {
  await GitWorkerInit.execute()
}
