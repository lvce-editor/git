import * as Git from '../Git/Git.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const commandAcceptInput = async (message) => {
  const repository = await Repositories.getCurrent()
  await GitRequests.addAllAndCommit({
    message,
    cwd: repository.path,
    gitPath: repository.gitPath,
    exec: Git.exec,
  })
}
