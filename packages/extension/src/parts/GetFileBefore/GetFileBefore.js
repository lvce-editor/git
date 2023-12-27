import * as Assert from '../Assert/Assert.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const getFileBefore = async (uri) => {
  Assert.string(uri)
  const repository = await Repositories.getCurrent()
  const result = await GitWorker.invoke(GitWorkerCommandType.GitGetFileBefore, { gitPath: repository.gitPath, repositoryPath: repository.path, uri })
  return result
}
