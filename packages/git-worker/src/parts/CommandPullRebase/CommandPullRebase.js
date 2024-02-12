import * as Git from '../Git/Git.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const commandPullRebase = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'pullAndRebase',
    fn: GitRequests.pullAndRebase,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      exec: Git.exec,
    },
  })
}
