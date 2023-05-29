import * as Assert from '../Assert/Assert.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const getChangedFiles = async (cwd) => {
  console.log('call changed files')
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetChangedFiles)
  console.log({ result })
  Assert.array(result)
  return result
}
