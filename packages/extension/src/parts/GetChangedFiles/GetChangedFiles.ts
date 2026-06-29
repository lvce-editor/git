import * as Assert from '../Assert/Assert.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const getChangedFiles = async () => {
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetChangedFiles)
  Assert.array(result)
  return result
}
