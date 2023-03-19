import * as Assert from '../Assert/Assert.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const getChangedFiles = async (cwd) => {
  const path = vscode.getWorkspaceFolder()
  const result = await GitWorker.invoke(
    GitWorkerCommandType.GitGetChangedFiles,
    path
  )
  Assert.array(result)
  return result
}
