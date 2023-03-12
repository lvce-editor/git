import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'
import * as CommandId from '../CommandId/CommandId.js'

export const id = CommandId.GitInit

export const execute = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'init',
    fn: GitRequests.init,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
  })
}
