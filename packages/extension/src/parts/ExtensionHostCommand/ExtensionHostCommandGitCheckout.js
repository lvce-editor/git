import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const id = 'git.checkout'

export const execute = async (ref) => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'checkout',
    fn: GitRequests.checkout,
    args: {
      ref,
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
  })
}
