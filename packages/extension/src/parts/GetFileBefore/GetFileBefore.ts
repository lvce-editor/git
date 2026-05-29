import * as Assert from '../Assert/Assert.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const getFileBefore = async (uri) => {
  Assert.string(uri)
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetFileBefore, { uri })
  return result
}
