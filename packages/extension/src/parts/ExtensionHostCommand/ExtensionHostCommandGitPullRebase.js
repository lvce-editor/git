import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerPullRebase from '../GitWorkerPullRebase/GitWorkerPullRebase.js'

export const id = CommandId.GitPullRebase

export const execute = async () => {
  await GitWorkerPullRebase.execute()
}
