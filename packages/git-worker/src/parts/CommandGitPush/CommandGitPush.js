import * as GitRequestsGitPush from '../GitRequestsPush/GitRequestsPush.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'

export const execute = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'push',
    fn: GitRequestsGitPush.push,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
  })
}
