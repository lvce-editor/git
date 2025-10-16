import { commandMap } from '../CommandMap/CommandMap.js'
import * as GitWebWorkerUrl from '../GitWebWorkerUrl/GitWebWorkerUrl.js'

export const launchGitWebWorker = async () => {
  const workerUrl = GitWebWorkerUrl.getGitWebWorkerUrl()

  // @ts-ignore
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: workerUrl,
    name: 'Git Web Worker',
    commandMap: commandMap,
  })
  return rpc
}
