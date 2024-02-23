import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'

export const commandAcceptInput = async (message) => {
  const repository = await Repositories.getCurrent()
  await GitRequests.addAllAndCommit({
    message,
    cwd: repository.path,
    gitPath: repository.gitPath,
    exec: Git.exec,
  })
}
