import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitHub from '../GitHub/GitHub.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

const getGitProvider = (id) => {
  switch (id) {
    case 'github':
      return import('../GitHub/GitHub.js')
    default:
      throw new Error('not supported')
  }
}

const getGitProviderId = (remote) => {
  if (remote.startsWith('git@github.com')) {
    return 'github'
  }
  throw new Error('unknown')
}

export const id = 'git.pr'

export const execute = async () => {
  const repository = await Repositories.getCurrent()
  console.log('todo make pull request')
  console.log(repository)
  const remote = await GitRequests.getRemote({
    gitPath: repository.gitPath,
    cwd: repository.path,
  })
  const currentBranch = await GitRequests.getCurrentBranch({
    cwd: repository.path,
    gitPath: repository.gitPath,
  })
  const gitProviderId = getGitProviderId(remote)
  const gitProvider = await getGitProvider(gitProviderId)
  // TODO pass remote url and branches to this function
  await gitProvider.makePullRequest()
}
