import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerFetch from '../GitWorkerFetch/GitWorkerFetch.js'

export const id = CommandId.GitFetch

export const execute = async () => {
  await GitWorkerFetch.execute()
}
