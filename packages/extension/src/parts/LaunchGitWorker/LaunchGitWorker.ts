import { commandMap } from '../CommandMap/CommandMap.js'
import * as GitWorkerUrl from '../GitWorkerUrl/GitWorkerUrl.js'

export const launchGitWorker = async () => {
  const workerUrl = GitWorkerUrl.getGitWorkerUrl()
  // @ts-ignore
  const rpc = await vscode.createRpc({
    type: 'worker',
    url: workerUrl,
    name: 'Git Worker',
    commandMap,
  })
  return rpc
}
