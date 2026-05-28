import * as Assert from '../Assert/Assert.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const getDecorations = async (uris) => {
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetDecorations, uris)
  Assert.array(result)
  return result
}
