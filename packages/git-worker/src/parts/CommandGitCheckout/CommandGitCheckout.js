import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequestsCheckout/GitRequestsCheckout.js'

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
