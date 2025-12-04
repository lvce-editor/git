import * as Confirm from '../Confirm/Confirm.ts'
import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const remove = async (uri: string) => {
  await Rpc.invoke('FileSystem.remove', uri)
}

export const commandDiscard = async (file) => {
  const repository = await Repositories.getCurrent()

  await GitRepositoriesRequests.execute({
    args: {
      confirm: Confirm.confirm,
      cwd: repository.path,
      exec: Git.exec,
      file,
      gitPath: repository.gitPath,
      remove,
    },
    fn: GitRequests.discard,
    id: 'discard',
  })
}
