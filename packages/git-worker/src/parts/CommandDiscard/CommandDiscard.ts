import * as Confirm from '../Confirm/Confirm.ts'
import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import * as WorkspaceUris from '../WorkspaceUris/WorkspaceUris.ts'

const remove = async (uri: string): Promise<void> => {
  await Rpc.invoke('FileSystem.remove', uri)
}

export const commandDiscard = async (file: string): Promise<void> => {
  const repository = await Repositories.getCurrent()
  const refresh = async (): Promise<void> => {
    const workspaceUri =
      repository.workspaceUri.startsWith('file://') || repository.workspaceUri.startsWith('remote-ssh://')
        ? repository.workspaceUri
        : new URL(`file://${repository.workspaceUri}`).href
    const fileUri =
      file.startsWith('file://') || file.startsWith('remote-ssh://')
        ? WorkspaceUris.toResourceUri(file, repository.workspaceUri)
        : new URL(file.replaceAll('\\', '/').split('/').map(encodeURIComponent).join('/'), `${workspaceUri.replace(/\/$/, '')}/`).href
    await Rpc.invoke('Layout.handleWorkspaceRefresh', { changed: [fileUri], reloadContent: true })
  }

  await GitRepositoriesRequests.execute({
    args: {
      confirm: Confirm.confirm,
      cwd: repository.path,
      exec: Git.exec,
      file,
      gitPath: repository.gitPath,
      refresh,
      remove,
    },
    fn: GitRequests.discard,
    id: 'discard',
  })
}
