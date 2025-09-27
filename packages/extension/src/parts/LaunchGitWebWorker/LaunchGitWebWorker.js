import * as Command from '../Command/Command.js'
import * as GitWebWorkerUrl from '../GitWebWorkerUrl/GitWebWorkerUrl.js'

export const launchGitWebWorker = async () => {
  const workerUrl = GitWebWorkerUrl.getGitWebWorkerUrl()
  // @ts-ignore
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: workerUrl,
    name: 'Git Web Worker',
    execute: Command.execute,
  })
  return rpc
}
