import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerSync from '../GitWorkerSync/GitWorkerSync.js'

export const id = CommandId.GitSync

export const execute = async () => {
  await GitWorkerSync.execute()
}
