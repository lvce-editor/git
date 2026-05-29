import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const getGroups = async (cwd) => {
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetGroups, {})
  return result
}
