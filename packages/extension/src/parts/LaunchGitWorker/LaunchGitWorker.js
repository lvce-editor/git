import * as Command from '../Command/Command.js'
import * as GitWorkerUrl from '../GitWorkerUrl/GitWorkerUrl.js'

export const launchGitWorker = async () => {
  const workerUrl = GitWorkerUrl.getGitWorkerUrl()
  // @ts-ignore
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: workerUrl,
    name: 'Git Worker',
    execute: Command.execute,
  })
  return rpc
}
