import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'

type PullOptions = {
  readonly from?: readonly string[]
}

export const commandPull = async (options: PullOptions = {}): Promise<void> => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    args: {
      cwd: repository.path,
      exec: Git.exec,
      from: options.from,
      gitPath: repository.gitPath,
    },
    fn: GitRequests.pull,
    id: 'pull',
  })
  // vscode.showNotification('info', 'git fetch executed successfully')
}
