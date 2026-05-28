import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const commandInit = async (): Promise<void> => {
export interface InitOptions {
  readonly bare?: boolean
  readonly cwd?: string
  readonly initialBranch?: string
}

export const commandInit = async (options: InitOptions = {}) => {
  const repository = await Repositories.getCurrent()
  await GitRepositoriesRequests.execute({
    args: {
      bare: options.bare,
      cwd: options.cwd || repository.path,
      exec: Git.exec,
      gitPath: repository.gitPath,
      initialBranch: options.initialBranch,
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
