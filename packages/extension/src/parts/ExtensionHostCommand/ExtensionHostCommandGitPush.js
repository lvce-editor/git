import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerPush from '../GitWorkerPush/GitWorkerPush.js'

export const id = CommandId.GitPush

export const execute = async () => {
  await GitWorkerPush.execute()
}
