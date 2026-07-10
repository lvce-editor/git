import { createRpc } from '@lvce-editor/api'
import { commandMap } from '../CommandMap/CommandMap.ts'
import * as GitWebWorkerUrl from '../GitWebWorkerUrl/GitWebWorkerUrl.ts'

export const launchGitWebWorker = async () => {
  const workerUrl = GitWebWorkerUrl.getGitWebWorkerUrl()

  const rpc = await createRpc({
    commandMap,
    name: 'Git Web Worker',
    url: workerUrl,
  })
  return rpc
}
