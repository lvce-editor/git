import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const commandInit = async () => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    args: {
      cwd: repository.path,
      exec: Git.exec,
      gitPath: repository.gitPath,
    },
    fn: GitRequests.init,
    id: 'init',
  })

  try {
    await Rpc.invoke('Layout.handleWorkspaceRefresh')
  } catch {
    // ignore
  }
}
