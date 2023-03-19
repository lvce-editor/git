import * as Assert from '../Assert/Assert.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const getGroups = async (cwd) => {
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetGroups, cwd)
  Assert.array(result)
  return result
}
