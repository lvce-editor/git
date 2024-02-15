import * as Assert from '../Assert/Assert.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const getFileBefore = async (uri) => {
  Assert.string(uri)
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetFileBefore, { uri })
  return result
}
