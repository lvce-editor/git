import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitLoadFixture

/**
 */
export const execute = async (uri) => {
  return GitWorker.invoke('Git.loadFixture', uri)
}
