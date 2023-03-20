import * as CommandId from '../CommandId/CommandId.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const id = CommandId.GitUndoLastCommit

export const execute = async () => {
  // TODO get current workspace from somewhere
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'undoLastCommit',
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
    fn: GitRequests.undoLastCommit,
  })
}
