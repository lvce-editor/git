import { createRpc } from '@lvce-editor/api'
import { commandMap } from '../CommandMap/CommandMap.ts'
import * as GitWorkerUrl from '../GitWorkerUrl/GitWorkerUrl.ts'

export const launchGitWorker = async () => {
  const workerUrl = GitWorkerUrl.getGitWorkerUrl()
  const rpc = await createRpc({
    commandMap,
    name: 'Git Worker',
    url: workerUrl,
  })
  return rpc
}
