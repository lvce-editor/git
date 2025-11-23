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
    id: 'discard',
    fn: GitRequests.discard,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      file,
      exec: Git.exec,
      confirm: Confirm.confirm,
      remove,
    },
  })
}
