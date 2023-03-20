import * as CommandId from '../CommandId/CommandId.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const id = CommandId.GitUnstageAll

/**
 */
export const execute = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'unstageAll',
    fn: GitRequests.unstageAll,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
  })
}
