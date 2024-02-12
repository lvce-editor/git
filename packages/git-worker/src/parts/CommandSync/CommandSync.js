import * as Git from '../Git/Git.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const commandSync = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'sync',
    fn: GitRequests.sync,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      exec: Git.exec,
    },
  })
  console.log('FINISHED RUN it sync')
}
