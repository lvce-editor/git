import * as Assert from '../Assert/Assert.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const getGroups = async (cwd) => {
  const repository = await Repositories.getCurrent()
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetGroups, { gitPath: repository.gitPath, cwd: repository.path })
  Assert.array(result)
  return result
}
