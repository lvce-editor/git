import * as Assert from '../Assert/Assert.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const getChangedFiles = async (cwd) => {
  const rpc = await GitWorker.getInstance()
  const result = await rpc.invoke(GitWorkerCommandType.GitGetChangedFiles)
  Assert.array(result)
  return result
}
