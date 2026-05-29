import * as Assert from '../Assert/Assert.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const getDecorations = async (uris) => {
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetDecorations, uris)
  Assert.array(result)
  return result
}
