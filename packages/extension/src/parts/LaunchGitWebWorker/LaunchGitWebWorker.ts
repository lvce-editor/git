import { createRpc } from '@lvce-editor/api'
import { commandMap } from '../CommandMap/CommandMap.ts'
import * as GitWebWorkerUrl from '../GitWebWorkerUrl/GitWebWorkerUrl.ts'

type Rpc = {
  invoke(method: string, ...params: readonly any[]): Promise<any>
}

export const launchGitWebWorker = async (): Promise<Rpc> => {
  const workerUrl = GitWebWorkerUrl.getGitWebWorkerUrl()

  const rpc = await createRpc({
    commandMap,
    name: 'Git Web Worker',
    url: workerUrl,
  })
  return rpc
}
