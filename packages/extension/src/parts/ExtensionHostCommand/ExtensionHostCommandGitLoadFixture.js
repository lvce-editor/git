import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitLoadFixture

/**
 */
export const execute = async (uri) => {
  return GitWorker.invoke('Git.loadFixture', uri)
}
