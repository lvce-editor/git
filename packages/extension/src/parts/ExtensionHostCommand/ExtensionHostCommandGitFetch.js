import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

export const id = 'git.fetch'

export const execute = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    id: 'fetch',
    fn: GitRequests.fetch,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
    },
  })
  vscode.showNotification('info', 'git fetch executed successfully')
}
