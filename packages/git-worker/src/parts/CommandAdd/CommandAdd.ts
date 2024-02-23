import * as Git from '../Git/Git.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const commandAdd = async (file) => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'add',
    fn: GitRequests.add,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      file,
      exec: Git.exec,
    },
  })
}
