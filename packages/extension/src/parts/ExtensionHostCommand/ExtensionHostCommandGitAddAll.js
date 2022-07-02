import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const id = 'git.addAll'

export const execute = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'addAll',
    fn: GitRequests.addAll,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
  })
}
