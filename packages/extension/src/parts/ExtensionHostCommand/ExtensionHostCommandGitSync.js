import * as GitRequests from '../GitRequests/GitRequests.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'

export const id = 'git.sync'

export const execute = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'sync',
    fn: GitRequests.sync,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
  })
  console.log('FINISHED RUN it sync')
}
