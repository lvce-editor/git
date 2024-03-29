import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'

export const commandPush = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'push',
    fn: GitRequests.push,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      exec: Git.exec,
    },
  })
}
